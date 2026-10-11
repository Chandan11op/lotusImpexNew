import { Request, Response, NextFunction } from 'express';
import { FollowUp } from '../models/FollowUp.js';
import { Enquiry } from '../models/Enquiry.js';
import { scheduleFollowUpSchema } from '../validators/index.js';

export async function getFollowUps(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { filter = 'all', page = '1', limit = '20' } = req.query;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const query: any = {};

    if (filter === 'due_today') {
      query.status = 'pending';
      query.dueDate = { $gte: startOfToday, $lte: endOfToday };
    } else if (filter === 'overdue') {
      query.status = 'pending';
      query.dueDate = { $lt: startOfToday };
    } else if (filter === 'upcoming') {
      query.status = 'pending';
      query.dueDate = { $gt: endOfToday };
    } else if (filter === 'completed') {
      query.status = 'completed';
    } else if (filter === 'pending') {
      query.status = 'pending';
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [followUps, total] = await Promise.all([
      FollowUp.find(query)
        .sort({ dueDate: filter === 'completed' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum)
        .populate('assignedUser', 'name email'),
      FollowUp.countDocuments(query),
    ]);

    // Calculate live summary badge counts
    const [overdueCount, todayCount, upcomingCount, completedCount] = await Promise.all([
      FollowUp.countDocuments({ status: 'pending', dueDate: { $lt: startOfToday } }),
      FollowUp.countDocuments({
        status: 'pending',
        dueDate: { $gte: startOfToday, $lte: endOfToday },
      }),
      FollowUp.countDocuments({ status: 'pending', dueDate: { $gt: endOfToday } }),
      FollowUp.countDocuments({ status: 'completed' }),
    ]);

    res.json({
      success: true,
      data: {
        followUps,
        counts: {
          overdue: overdueCount,
          dueToday: todayCount,
          upcoming: upcomingCount,
          completed: completedCount,
          totalPending: overdueCount + todayCount + upcomingCount,
        },
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createFollowUp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { enquiryId } = req.params;
    const validated = scheduleFollowUpSchema.parse(req.body);

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    const followUp = await FollowUp.create({
      enquiryRef: enquiry._id,
      enquiryNumber: enquiry.enquiryNumber,
      customerName: enquiry.customerName,
      company: enquiry.company,
      dueDate: new Date(validated.dueDate),
      taskDescription: validated.taskDescription,
      priority: validated.priority,
      status: 'pending',
      assignedUser: validated.assignedUserId || req.user?.userId,
      isDemoRecord: false,
    });

    // Update enquiry next follow-up date
    enquiry.nextFollowUpDate = new Date(validated.dueDate);
    enquiry.activityHistory.push({
      action: 'Follow-up Task Scheduled',
      performedBy: req.user?.name || 'Staff',
      timestamp: new Date(),
      notes: `Due on ${new Date(validated.dueDate).toLocaleDateString()}: ${validated.taskDescription}`,
    });
    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Follow-up scheduled successfully',
      data: { followUp },
    });
  } catch (error) {
    next(error);
  }
}

export async function completeFollowUp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { completionNotes } = req.body;

    const followUp = await FollowUp.findById(id);
    if (!followUp) {
      res.status(404).json({ success: false, message: 'Follow-up not found' });
      return;
    }

    followUp.status = 'completed';
    followUp.completedAt = new Date();
    followUp.completionNotes = completionNotes || 'Marked completed by user';
    await followUp.save();

    // Log in related enquiry
    const enquiry = await Enquiry.findById(followUp.enquiryRef);
    if (enquiry) {
      enquiry.activityHistory.push({
        action: 'Follow-up Completed',
        performedBy: req.user?.name || 'Staff',
        timestamp: new Date(),
        notes: `${followUp.taskDescription} — Notes: ${followUp.completionNotes}`,
      });
      await enquiry.save();
    }

    res.json({
      success: true,
      message: 'Follow-up marked as completed',
      data: { followUp },
    });
  } catch (error) {
    next(error);
  }
}

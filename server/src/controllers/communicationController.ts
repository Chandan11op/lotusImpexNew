import { Request, Response, NextFunction } from 'express';
import { CommunicationLog } from '../models/CommunicationLog.js';
import { Enquiry } from '../models/Enquiry.js';
import { communicationLogSchema } from '../validators/index.js';

export async function getEnquiryCommunications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { enquiryId } = req.params;

    const logs = await CommunicationLog.find({ enquiryRef: enquiryId }).sort({
      timestamp: -1,
    });

    res.json({
      success: true,
      data: { logs },
    });
  } catch (error) {
    next(error);
  }
}

export async function createCommunicationLog(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { enquiryId } = req.params;
    const validated = communicationLogSchema.parse(req.body);

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    const author = req.user?.name || 'Staff Member';

    const log = await CommunicationLog.create({
      enquiryRef: enquiry._id,
      enquiryNumber: enquiry.enquiryNumber,
      customerRef: enquiry.customerRef,
      author,
      authorId: req.user?.userId,
      type: validated.type,
      summary: validated.summary,
      notes: validated.notes,
      timestamp: validated.timestamp ? new Date(validated.timestamp) : new Date(),
      isDemoRecord: false,
    });

    // Also record in enquiry activity history for high-level timeline
    enquiry.activityHistory.push({
      action: `Logged ${validated.type.toUpperCase()}: ${validated.summary}`,
      performedBy: author,
      timestamp: new Date(),
      notes: validated.notes,
    });
    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Communication logged successfully',
      data: { log },
    });
  } catch (error) {
    next(error);
  }
}

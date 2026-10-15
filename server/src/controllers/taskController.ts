import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { taskSchema } from '../validators/index.js';

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, priority, assignedUser, page = 1, limit = 50 } = req.query;
    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    if (assignedUser && assignedUser !== 'all') {
      filter.assignedUser = assignedUser;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignedUser', 'name email role')
        .populate('enquiryRef', 'enquiryNumber customerName company status')
        .sort({ dueDate: 1 })
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = taskSchema.parse(req.body);

    const user = await User.findById(validated.assignedUserId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Assigned staff user not found' });
      return;
    }

    const task = new Task({
      taskTitle: validated.taskTitle,
      description: validated.description,
      assignedUser: user._id,
      assignedUserName: user.name,
      enquiryRef: validated.enquiryRef ? new mongoose.Types.ObjectId(validated.enquiryRef) : undefined,
      customerRef: validated.customerRef ? new mongoose.Types.ObjectId(validated.customerRef) : undefined,
      dueDate: new Date(validated.dueDate),
      priority: validated.priority,
      status: validated.status || 'pending',
      completionNotes: validated.completionNotes,
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, completionNotes, taskTitle, description, priority, dueDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
    }
    if (completionNotes !== undefined) task.completionNotes = completionNotes;
    if (taskTitle) task.taskTitle = taskTitle;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

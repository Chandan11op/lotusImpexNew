import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { createUserSchema, updateRoleSchema } from '../validators/index.js';

export async function getUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = createUserSchema.parse(req.body);

    const existing = await User.findOne({ email: validated.email.toLowerCase() });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const user = await User.create({
      name: validated.name,
      email: validated.email.toLowerCase(),
      passwordHash,
      role: validated.role,
      phone: validated.phone,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: `User ${user.name} created successfully as ${user.role}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleUserStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (req.user?.userId === id) {
      res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.',
      });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} is now ${user.isActive ? 'active' : 'deactivated'}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { role } = updateRoleSchema.parse(req.body);

    if (req.user?.userId === id && role !== 'super_admin') {
      res.status(400).json({
        success: false,
        message: 'You cannot remove your own Super Admin role.',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function resetUserPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const user = await User.findByIdAndUpdate(id, { passwordHash }, { new: true });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: `Password reset successfully for ${user.name}`,
    });
  } catch (error) {
    next(error);
  }
}

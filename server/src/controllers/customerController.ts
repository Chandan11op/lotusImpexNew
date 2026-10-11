import { Request, Response, NextFunction } from 'express';
import { Customer } from '../models/Customer.js';

export async function getCustomers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, country, page = '1', limit = '15' } = req.query;

    const query: any = {};
    if (country && typeof country === 'string' && country !== 'all') {
      query.country = country;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('linkedEnquiries', 'enquiryNumber status productName createdAt'),
      Customer.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        customers,
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

export async function getCustomerById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id).populate({
      path: 'linkedEnquiries',
      options: { sort: { createdAt: -1 } },
    });

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    res.json({
      success: true,
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { name, company, phone, country, notes } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, company, phone, country, notes },
      { new: true }
    );

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Customer profile updated',
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
}

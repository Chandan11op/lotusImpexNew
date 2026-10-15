import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Quotation, IQuotationLineItem } from '../models/Quotation.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { AuditLog } from '../models/AuditLog.js';
import { createQuotationSchema, updateQuotationStatusSchema } from '../validators/index.js';

// Helper to generate unique quotation number
async function generateQuotationNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Quotation.countDocuments();
  const sequence = String(count + 101).padStart(4, '0');
  return `QT-${year}-${sequence}`;
}

export async function createQuotation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createQuotationSchema.parse(req.body);

    const customer = await Customer.findById(validated.customerRef);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer record not found' });
      return;
    }

    // Server-side calculation of line items and totals
    let subtotal = 0;
    let discountTotal = 0;

    const calculatedLineItems: IQuotationLineItem[] = validated.lineItems.map((item) => {
      const gross = item.quantity * item.unitPrice;
      const discount = gross * ((item.discountPercent || 0) / 100);
      const net = gross - discount;

      subtotal += net;
      discountTotal += discount;

      return {
        productRef: item.productRef ? new mongoose.Types.ObjectId(item.productRef) : undefined,
        productName: item.productName,
        sku: item.sku,
        description: item.description,
        grade: item.grade || 'SS 316L',
        size: item.size,
        quantity: item.quantity,
        unit: item.unit || 'Pieces',
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent || 0,
        lineTotal: Math.round(net * 100) / 100,
      };
    });

    subtotal = Math.round(subtotal * 100) / 100;
    discountTotal = Math.round(discountTotal * 100) / 100;
    const taxTotal = Math.round(subtotal * (validated.taxPercent / 100) * 100) / 100;
    const grandTotal = Math.round((subtotal + taxTotal) * 100) / 100;

    const validityDate = new Date(Date.now() + validated.validityDays * 24 * 60 * 60 * 1000);
    const quotationNumber = await generateQuotationNumber();

    const quotation = new Quotation({
      quotationNumber,
      revision: 0,
      enquiryRef: validated.enquiryRef ? new mongoose.Types.ObjectId(validated.enquiryRef) : undefined,
      customerRef: customer._id,
      customerName: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      billingAddress: customer.address || '',
      country: customer.country || 'India',
      currency: validated.currency,
      lineItems: calculatedLineItems,
      subtotal,
      discountTotal,
      taxPercent: validated.taxPercent,
      taxTotal,
      grandTotal,
      deliveryTerms: validated.deliveryTerms,
      paymentTerms: validated.paymentTerms,
      validityDate,
      status: 'draft',
      notes: validated.notes,
      createdBy: req.user ? new mongoose.Types.ObjectId(req.user.userId) : undefined,
      createdByName: req.user?.name || 'Authorized Staff',
    });

    await quotation.save();

    // Link quotation to customer
    if (!customer.linkedQuotations) customer.linkedQuotations = [];
    customer.linkedQuotations.push(quotation._id as mongoose.Types.ObjectId);
    await customer.save();

    // If linked to an enquiry, update enquiry status and record activity
    if (validated.enquiryRef) {
      const enquiry = await Enquiry.findById(validated.enquiryRef);
      if (enquiry) {
        enquiry.status = 'quotation_sent';
        enquiry.activityHistory.push({
          action: 'Quotation Generated',
          performedBy: req.user?.name || 'Sales Staff',
          timestamp: new Date(),
          notes: `Quotation ${quotationNumber} generated for ${validated.currency} ${grandTotal.toLocaleString()}`,
        });
        await enquiry.save();
      }
    }

    // Log to AuditLog
    await AuditLog.create({
      userId: req.user ? new mongoose.Types.ObjectId(req.user.userId) : undefined,
      userName: req.user?.name || 'System',
      userRole: req.user?.role,
      action: 'CREATE_QUOTATION',
      entityType: 'quotation',
      entityId: String(quotation._id),
      details: {
        quotationNumber,
        grandTotal,
        currency: validated.currency,
        customer: customer.company,
      },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getQuotations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { quotationNumber: searchRegex },
        { customerName: searchRegex },
        { company: searchRegex },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [quotations, total] = await Promise.all([
      Quotation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Quotation.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        quotations,
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

export async function getQuotationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id).populate('customerRef').populate('enquiryRef');

    if (!quotation) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    res.json({ success: true, data: quotation });
  } catch (error) {
    next(error);
  }
}

export async function updateQuotationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, notes } = updateQuotationStatusSchema.parse(req.body);

    const quotation = await Quotation.findById(id);
    if (!quotation) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    const prevStatus = quotation.status;
    quotation.status = status;
    if (notes) quotation.notes = notes;
    await quotation.save();

    // If quotation accepted, update linked enquiry to order_confirmed
    if (status === 'accepted' && quotation.enquiryRef) {
      const enquiry = await Enquiry.findById(quotation.enquiryRef);
      if (enquiry) {
        enquiry.status = 'order_confirmed';
        enquiry.activityHistory.push({
          action: 'Order Confirmed',
          performedBy: req.user?.name || 'Accounts/Sales Staff',
          timestamp: new Date(),
          notes: `Quotation ${quotation.quotationNumber} accepted by customer.`,
        });
        await enquiry.save();
      }
    }

    // Audit Log
    await AuditLog.create({
      userId: req.user ? new mongoose.Types.ObjectId(req.user.userId) : undefined,
      userName: req.user?.name || 'System',
      userRole: req.user?.role,
      action: 'UPDATE_QUOTATION_STATUS',
      entityType: 'quotation',
      entityId: String(quotation._id),
      details: { quotationNumber: quotation.quotationNumber, prevStatus, newStatus: status },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Quotation status updated to ${status}`,
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
}

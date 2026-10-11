import { Request, Response, NextFunction } from 'express';
import { Enquiry } from '../models/Enquiry.js';
import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { FollowUp } from '../models/FollowUp.js';

export async function getDashboardOverview(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    const [
      totalEnquiries,
      newCount,
      contactedCount,
      qualifiedCount,
      quotationSentCount,
      negotiationCount,
      wonCount,
      lostCount,
      overdueFollowUps,
      totalCustomers,
      totalProducts,
      recentEnquiries,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'contacted' }),
      Enquiry.countDocuments({ status: 'qualified' }),
      Enquiry.countDocuments({ status: 'quotation_sent' }),
      Enquiry.countDocuments({ status: 'negotiation' }),
      Enquiry.countDocuments({ status: 'won' }),
      Enquiry.countDocuments({ status: 'lost' }),
      FollowUp.countDocuments({ status: 'pending', dueDate: { $lt: startOfToday } }),
      Customer.countDocuments(),
      Product.countDocuments({ isPublished: true }),
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select('enquiryNumber customerName company status priority createdAt productName'),
    ]);

    // Pipeline stage breakdown for charts
    const pipelineData = [
      { stage: 'New', count: newCount, color: '#3b82f6' },
      { stage: 'Contacted', count: contactedCount, color: '#06b6d4' },
      { stage: 'Qualified', count: qualifiedCount, color: '#8b5cf6' },
      { stage: 'Quotation Sent', count: quotationSentCount, color: '#f59e0b' },
      { stage: 'Negotiation', count: negotiationCount, color: '#ec4899' },
      { stage: 'Won', count: wonCount, color: '#10b981' },
      { stage: 'Lost', count: lostCount, color: '#ef4444' },
    ];

    // Enquiries by product category breakdown
    const categoryBreakdown = await Enquiry.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productRef',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$product.category', 'General Sanitary Fittings'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Lead source breakdown
    const sourceBreakdown = await Enquiry.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        kpis: {
          totalEnquiries,
          newEnquiries: newCount,
          contacted: contactedCount,
          qualified: qualifiedCount,
          quotationSent: quotationSentCount,
          negotiation: negotiationCount,
          won: wonCount,
          lost: lostCount,
          overdueFollowUps,
          totalCustomers,
          totalProducts,
          conversionRate:
            totalEnquiries > 0 ? ((wonCount / totalEnquiries) * 100).toFixed(1) + '%' : '0%',
        },
        pipelineData,
        categoryBreakdown: categoryBreakdown.map((item) => ({
          category: item._id,
          count: item.count,
        })),
        sourceBreakdown: sourceBreakdown.map((item) => ({
          source: item._id,
          count: item.count,
        })),
        recentEnquiries,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getReports(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery: any = {};
    if (startDate && typeof startDate === 'string') {
      matchQuery.createdAt = { ...matchQuery.createdAt, $gte: new Date(startDate) };
    }
    if (endDate && typeof endDate === 'string') {
      matchQuery.createdAt = { ...matchQuery.createdAt, $lte: new Date(endDate) };
    }

    const [statusReport, sourceReport, countryReport, monthlyTrends] = await Promise.all([
      Enquiry.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Enquiry.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Enquiry.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Enquiry.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        statusReport: statusReport.map((r) => ({ status: r._id, count: r.count })),
        sourceReport: sourceReport.map((r) => ({ source: r._id, count: r.count })),
        countryReport: countryReport.map((r) => ({ country: r._id, count: r.count })),
        monthlyTrends: monthlyTrends.map((r) => ({ month: r._id, count: r.count })),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function exportEnquiriesCSV(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status, country } = req.query;
    const query: any = {};
    if (status && typeof status === 'string' && status !== 'all') query.status = status;
    if (country && typeof country === 'string' && country !== 'all') query.country = country;

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });

    const csvHeaders = [
      'Enquiry Number',
      'Date',
      'Customer Name',
      'Company',
      'Email',
      'Phone',
      'Country',
      'Product Name',
      'Quantity',
      'Unit',
      'Status',
      'Priority',
      'Source',
      'Loss Reason',
      'Requirements / Message',
    ];

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = enquiries.map((enq) =>
      [
        escapeCSV(enq.enquiryNumber),
        escapeCSV(enq.createdAt.toISOString().slice(0, 10)),
        escapeCSV(enq.customerName),
        escapeCSV(enq.company),
        escapeCSV(enq.email),
        escapeCSV(enq.phone),
        escapeCSV(enq.country),
        escapeCSV(enq.productName),
        escapeCSV(enq.quantity),
        escapeCSV(enq.unit),
        escapeCSV(enq.status),
        escapeCSV(enq.priority),
        escapeCSV(enq.source),
        escapeCSV(enq.lossReason || ''),
        escapeCSV(enq.message),
      ].join(',')
    );

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="lotus_impex_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
}

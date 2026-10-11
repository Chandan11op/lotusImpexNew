import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { productSchema } from '../validators/index.js';

export async function getPublicProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { category, search, grade, material, industry, page = '1', limit = '12' } = req.query;

    const query: any = { isPublished: true };

    if (category && typeof category === 'string' && category !== 'All') {
      query.category = category;
    }

    if (grade && typeof grade === 'string' && grade !== 'All') {
      query.grade = { $regex: grade, $options: 'i' };
    }

    if (material && typeof material === 'string' && material !== 'All') {
      query.material = { $regex: material, $options: 'i' };
    }

    if (industry && typeof industry === 'string') {
      query.applicableIndustries = { $in: [industry] };
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { connectionType: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products,
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

export async function getPublicProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isPublished: true });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found or has been unpublished.',
      });
      return;
    }

    // Related products in same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isPublished: true,
    })
      .limit(3)
      .select('name slug category images shortDescription');

    res.json({
      success: true,
      data: {
        product,
        related,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categoriesWithCount = await Product.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: categoriesWithCount.map((c) => ({
        name: c._id,
        count: c.count,
      })),
    });
  } catch (error) {
    next(error);
  }
}

// Admin product endpoints
export async function getAdminProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { category, search, page = '1', limit = '20' } = req.query;

    const query: any = {};
    if (category && typeof category === 'string' && category !== 'All') {
      query.category = category;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { slug: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products,
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

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = productSchema.parse(req.body);

    const existing = await Product.findOne({ slug: validatedData.slug });
    if (existing) {
      res.status(409).json({
        success: false,
        message: `Product slug "${validatedData.slug}" is already in use.`,
      });
      return;
    }

    const product = await Product.create({
      ...validatedData,
      isDemoItem: false,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = productSchema.partial().parse(req.body);

    const product = await Product.findByIdAndUpdate(id, validatedData, { new: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

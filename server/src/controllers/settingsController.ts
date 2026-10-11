import { Request, Response, NextFunction } from 'express';
import { CompanySettings } from '../models/CompanySettings.js';
import { companySettingsSchema } from '../validators/index.js';

export async function getCompanySettings(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }

    res.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCompanySettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = companySettingsSchema.parse(req.body);

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings(validated);
    } else {
      Object.assign(settings, validated);
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Company settings updated successfully',
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
}

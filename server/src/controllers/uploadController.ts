import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Upload } from '../models/Upload.js';
import { Enquiry } from '../models/Enquiry.js';

// Approved extensions for sanitary engineering BOQ & technical drawings
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.xlsx', '.xls', '.csv', '.dwg', '.dxf', '.png', '.jpg', '.jpeg', '.doc', '.docx']);
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const UPLOAD_BASE_DIR = path.resolve(process.cwd(), 'uploads', 'private');

// Ensure directory exists
if (!fs.existsSync(UPLOAD_BASE_DIR)) {
  fs.mkdirSync(UPLOAD_BASE_DIR, { recursive: true });
}

export async function uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { originalName, mimeType, base64Data, category = 'boq', enquiryRef } = req.body;

    if (!originalName || !base64Data) {
      res.status(400).json({ success: false, message: 'File name and base64 data are required' });
      return;
    }

    // 1. Sanitize and validate file extension
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      res.status(400).json({
        success: false,
        message: `File format '${ext}' is not permitted. Supported formats: PDF, Excel (.xlsx, .xls), CSV, AutoCAD (.dwg, .dxf), Word (.docx), and Images.`,
      });
      return;
    }

    // 2. Decode base64 and check size
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      res.status(400).json({
        success: false,
        message: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 25 MB.`,
      });
      return;
    }

    // 3. Generate safe unique file ID and filename
    const fileId = crypto.randomUUID();
    const storageFilename = `${fileId}${ext}`;
    const targetFilePath = path.join(UPLOAD_BASE_DIR, storageFilename);

    // Prevent any possibility of directory traversal
    if (!targetFilePath.startsWith(UPLOAD_BASE_DIR)) {
      res.status(400).json({ success: false, message: 'Invalid file path' });
      return;
    }

    await fs.promises.writeFile(targetFilePath, buffer);

    // 4. Save metadata to database
    const upload = new Upload({
      fileId,
      originalName: path.basename(originalName),
      storageFilename,
      mimeType: mimeType || 'application/octet-stream',
      sizeBytes: buffer.length,
      category,
      linkedEnquiry: enquiryRef || undefined,
      uploadedBy: req.user ? new mongoose.Types.ObjectId(req.user.userId) : undefined,
      isPublic: false,
    });

    await upload.save();

    // If linked to enquiry, update enquiry attachments
    if (enquiryRef) {
      await Enquiry.findByIdAndUpdate(enquiryRef, {
        $addToSet: { attachments: upload._id },
      });
    }

    res.status(201).json({
      success: true,
      message: 'File uploaded and secured successfully',
      data: {
        fileId: upload.fileId,
        originalName: upload.originalName,
        sizeBytes: upload.sizeBytes,
        category: upload.category,
        createdAt: upload.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileId } = req.params;

    const upload = await Upload.findOne({ fileId });
    if (!upload) {
      res.status(404).json({ success: false, message: 'Requested file not found or expired' });
      return;
    }

    const filePath = path.join(UPLOAD_BASE_DIR, upload.storageFilename);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, message: 'File asset missing from private storage' });
      return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(upload.originalName)}"`);
    res.setHeader('Content-Type', upload.mimeType || 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

export async function getEnquiryUploads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { enquiryId } = req.params;
    const uploads = await Upload.find({ linkedEnquiry: enquiryId }).select('-storageFilename');
    res.json({ success: true, data: uploads });
  } catch (error) {
    next(error);
  }
}

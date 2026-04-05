import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import Industry from '../models/Industry';
import Content from '../models/Content';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// AWS S3 Setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

// Get all industries (Admin)
router.get('/industries', async (req: Request, res: Response) => {
  try {
    const industries = await Industry.find();
    res.json(industries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching industries', error });
  }
});

// Create new industry
router.post('/industries', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const industry = new Industry({ name, description });
    await industry.save();

    res.status(201).json(industry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating industry', error });
  }
});

// Update industry
router.put('/industries/:id', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const industry = await Industry.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    res.json(industry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating industry', error });
  }
});

// Delete industry
router.delete('/industries/:id', async (req: Request, res: Response) => {
  try {
    const industry = await Industry.findByIdAndDelete(req.params.id);

    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    // Delete associated content
    await Content.deleteMany({ industryId: req.params.id });

    res.json({ message: 'Industry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting industry', error });
  }
});

// Upload content for industry
router.post('/industries/:id/content', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload to S3
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME || 'market-research-hub',
      Key: `content/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as const,
    };

    const s3Result = await s3.upload(s3Params).promise();

    // Create content record
    const content = new Content({
      industryId: req.params.id,
      title,
      description,
      type,
      fileUrl: s3Result.Location,
      fileSize: file.size,
    });

    await content.save();

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading content', error });
  }
});

// Delete content
router.delete('/content/:id', async (req: Request, res: Response) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Delete from S3
    const key = content.fileUrl.split('/').pop();
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME || 'market-research-hub',
        Key: `content/${key}`,
      })
      .promise();

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content', error });
  }
});

export default router;

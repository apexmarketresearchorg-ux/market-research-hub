import express, { Request, Response, Router } from 'express';
import Industry from '../models/Industry';
import Content from '../models/Content';

const router: Router = express.Router();

// Get all industries
router.get('/', async (req: Request, res: Response) => {
  try {
    const industries = await Industry.find();

    // Enhance with content count
    const industriesWithCount = await Promise.all(
      industries.map(async (industry) => {
        const contentCount = await Content.countDocuments({ industryId: industry._id });
        return {
          ...industry.toObject(),
          contentCount,
        };
      })
    );

    res.json(industriesWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching industries', error });
  }
});

// Get single industry with content
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const industry = await Industry.findById(req.params.id);

    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    const content = await Content.find({ industryId: req.params.id });

    res.json({
      ...industry.toObject(),
      content,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching industry', error });
  }
});

export default router;

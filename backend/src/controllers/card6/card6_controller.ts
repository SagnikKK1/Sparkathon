import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';

export class Card6Controller {
  /**
   * Fetch latest card6 data (Comment Frequency Heatmap)
   * GET /api/card6/latest
   */
  static async getLatestCard6(req: Request, res: Response): Promise<void> {
    try {
      const latestCard6 = await prisma.card6.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!latestCard6) {
        res.status(404).json({
          success: false,
          message: 'No card6 data found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: latestCard6.id,
          type: 'card6',
          content: latestCard6.data,
          createdAt: latestCard6.createdAt,
          updatedAt: latestCard6.updatedAt
        }
      });

    } catch (error: unknown) {
      console.error('Error fetching latest card6 data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      });
    }
  }
}

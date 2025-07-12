import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';

export class Card4Controller {
  /**
   * Fetch latest card4 data (Sentiment Over Time)
   * GET /api/card4/latest
   */
  static async getLatestCard4(req: Request, res: Response): Promise<void> {
    try {
      const latestCard4 = await prisma.card4.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!latestCard4) {
        res.status(404).json({
          success: false,
          message: 'No card4 data found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: latestCard4.id,
          type: 'card4',
          content: latestCard4.data,
          createdAt: latestCard4.createdAt,
          updatedAt: latestCard4.updatedAt
        }
      });

    } catch (error: unknown) {
      console.error('Error fetching latest card4 data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      });
    }
  }
}

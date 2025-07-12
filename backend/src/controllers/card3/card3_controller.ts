import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Card3Controller {
  /**
   * Fetch latest card3 data (Overview)
   * GET /api/card3/latest
   */
  static async getLatestCard3(req: Request, res: Response): Promise<void> {
    try {
      const latestCard3 = await prisma.card3.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!latestCard3) {
        res.status(404).json({
          success: false,
          message: 'No card3 data found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: latestCard3.id,
          type: 'card3',
          content: latestCard3.data,
          createdAt: latestCard3.createdAt,
          updatedAt: latestCard3.updatedAt
        }
      });

    } catch (error: unknown) {
      console.error('Error fetching latest card3 data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      });
    }
  }
}

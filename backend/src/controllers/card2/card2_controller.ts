import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Card2Controller {
  /**
   * Fetch latest card2 data (Buzz Pie)
   * GET /api/card2/latest
   */
  static async getLatestCard2(req: Request, res: Response): Promise<void> {
    try {
      const latestCard2 = await prisma.card2.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!latestCard2) {
        res.status(404).json({
          success: false,
          message: 'No card2 data found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: latestCard2.id,
          type: 'card2',
          content: latestCard2.data,
          createdAt: latestCard2.createdAt,
          updatedAt: latestCard2.updatedAt
        }
      });

    } catch (error: unknown) {
      console.error('Error fetching latest card2 data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      });
    }
  }
}

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Card1Controller {
  /**
   * Fetch latest card1 data (Summary Card)
   * GET /api/card1/latest
   */
  static async getLatestCard1(req: Request, res: Response): Promise<void> {
    try {
      const latestCard1 = await prisma.card1.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!latestCard1) {
        res.status(404).json({
          success: false,
          message: 'No card1 data found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: latestCard1.id,
          type: 'card1',
          content: latestCard1.data,
          createdAt: latestCard1.createdAt,
          updatedAt: latestCard1.updatedAt
        }
      });

    } catch (error: unknown) {
      console.error('Error fetching latest card1 data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      });
    }
  }
}

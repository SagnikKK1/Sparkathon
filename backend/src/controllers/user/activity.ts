import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';

export async function updateUserActivity(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await prisma.userStatus.upsert({
      where: { userId },
      update: { 
        lastOnline: new Date()
      },
      create: { 
        userId,
        isActive: true,
        lastOnline: new Date()
      }
    });

    res.json({ message: 'Activity updated successfully' });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

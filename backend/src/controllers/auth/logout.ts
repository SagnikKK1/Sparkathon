import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    
    if (userId) {
      await prisma.userStatus.upsert({
        where: { userId },
        update: { 
          isActive: false,
          lastOnline: new Date()
        },
        create: { 
          userId,
          isActive: false,
          lastOnline: new Date()
        }
      });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

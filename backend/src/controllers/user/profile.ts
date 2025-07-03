import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';

export async function getUserProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userStatus: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: {
          isActive: user.userStatus?.isActive ?? false,
          lastOnline: user.userStatus?.lastOnline,
          createdAt: user.userStatus?.createdAt,
          updatedAt: user.userStatus?.updatedAt
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

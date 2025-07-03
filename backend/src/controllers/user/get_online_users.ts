import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';

export async function getOnlineUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      where: {
        userStatus: {
          isActive: true
        }
      },
      include: { userStatus: true },
      orderBy: { 
        userStatus: { 
          lastOnline: 'desc' 
        } 
      }
    });

    const onlineUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      lastOnline: user.userStatus?.lastOnline
    }));

    res.json({ onlineUsers });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      include: { userStatus: true },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
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
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

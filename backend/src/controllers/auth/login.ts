import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../global_prisma/prisma';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { userStatus: true }
    });
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    await prisma.userStatus.upsert({
      where: { userId: user.id },
      update: { 
        isActive: true,
        lastOnline: new Date()
      },
      create: { 
        userId: user.id,
        isActive: true,
        lastOnline: new Date()
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.json({ 
      message: 'Login successful',
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        status: {
          isActive: true,
          lastOnline: new Date()
        }
      } 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

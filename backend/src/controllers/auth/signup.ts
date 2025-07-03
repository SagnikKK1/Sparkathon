import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../global_prisma/prisma';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash, 
        name,
        userStatus: {
          create: {
            isActive: true,
            lastOnline: new Date()
          }
        }
      },
      include: {
        userStatus: true
      }
    });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.status(201).json({ 
      message: 'User created successfully',
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        status: {
          isActive: user.userStatus?.isActive,
          lastOnline: user.userStatus?.lastOnline
        }
      } 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

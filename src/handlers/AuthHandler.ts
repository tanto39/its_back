import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { BaseHandler } from './BaseHandler';

export class AuthHandler extends BaseHandler {
  protected getEntity() { return User; }

  async login(req: Request, res: Response) {
    const { login, password } = req.body;
    if (!login || !password) {
      return this.sendError(res, 'Login and password required', 400);
    }

    try {
      const user = await this.repository.findOne({
        where: { login },
        relations: ['role']
      });

      // В реальном проекте пароль должен сравниваться с хешем (например, bcrypt)
      if (!user || user.password !== password) {
        return this.sendError(res, 'Invalid credentials', 401);
      }

      const token = jwt.sign(
        { login: user.login, role: user.role_name },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      this.sendSuccess(res, { token, user: { login: user.login, role: user.role_name } });
    } catch (error) {
      this.sendError(res, 'Login failed', 500);
    }
  }

  async getMe(req: Request, res: Response) {
    // req.user устанавливается в middleware аутентификации
    const user = (req as any).user;
    if (!user) return this.sendError(res, 'Not authenticated', 401);
    this.sendSuccess(res, user);
  }
}
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { BaseHandler } from './BaseHandler';

export class AuthHandler extends BaseHandler {
  protected getEntity() { return User; }

  async login(req: Request, res: Response) {
    const { login, password } = req.body;
    if (!login || !password) {
      return this.sendError(res, 'Логин и пароль обязательны', 400);
    }

    try {
      const user = await this.repository.findOne({
        where: { login },
        relations: ['role']
      });

      if (!user) {
        return this.sendError(res, 'Пользователь не найден', 401);
      }

      // Сравнение хешированного пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return this.sendError(res, 'Неправильный логин или пароль', 401);
      }

      const token = jwt.sign(
        { login: user.login, role_name: user.role_name },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      this.sendSuccess(res, { token, user: user });
    } catch (error) {
      this.sendError(res, 'Ошибка авторизации ' + error, 500);
    }
  }

  async getMe(req: Request, res: Response) {
    // req.user устанавливается в middleware аутентификации
    const user = (req as any).user;
    if (!user) return this.sendError(res, 'Ошибка авторизации', 401);
    this.sendSuccess(res, user);
  }
}
import { Request, Response } from 'express';
import { User } from '../entities/User';
import { BaseHandler } from './BaseHandler';

export class UserHandler extends BaseHandler {
  protected getEntity() { return User; }

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.repository.find({ relations: ['role'] });
      this.sendSuccess(res, users);
    } catch (error) {
      this.sendError(res, 'Failed to fetch users', 500);
    }
  }

  async create(req: Request, res: Response) {
    const { login, password, second_name, first_name, middle_name, role_name } = req.body;
    if (!login || !password || !role_name) {
      return this.sendError(res, 'Login, password and role_name are required', 400);
    }

    try {
      const existing = await this.repository.findOneBy({ login });
      if (existing) return this.sendError(res, 'User already exists', 400);

      // В реальном проекте пароль должен хешироваться
      const newUser = this.repository.create({
        login,
        password,
        second_name,
        first_name,
        middle_name,
        role_name
      });
      await this.repository.save(newUser);
      this.sendSuccess(res, newUser, 201);
    } catch (error) {
      this.sendError(res, 'Failed to create user', 500);
    }
  }

  async update(req: Request, res: Response) {
    const { login } = req.params;
    const { password, second_name, first_name, middle_name, role_name } = req.body;

    try {
      const user = await this.repository.findOneBy({ login });
      if (!user) return this.sendError(res, 'User not found', 404);

      if (password) user.password = password;
      if (second_name !== undefined) user.second_name = second_name;
      if (first_name !== undefined) user.first_name = first_name;
      if (middle_name !== undefined) user.middle_name = middle_name;
      if (role_name) user.role_name = role_name;

      await this.repository.save(user);
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, 'Failed to update user', 500);
    }
  }

  async delete(req: Request, res: Response) {
    const { login } = req.params;
    try {
      const user = await this.repository.findOneBy({ login });
      if (!user) return this.sendError(res, 'User not found', 404);
      await this.repository.remove(user);
      this.sendSuccess(res, { message: 'User deleted' });
    } catch (error) {
      this.sendError(res, 'Failed to delete user', 500);
    }
  }
}
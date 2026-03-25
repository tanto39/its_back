import { Request, Response } from "express";
import { User } from "../entities/User";
import { BaseHandler } from "./BaseHandler";
import bcrypt from "bcrypt";

export class UserHandler extends BaseHandler {
  protected getEntity() {
    return User;
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.repository.find();
      this.sendSuccess(res, users);
    } catch (error) {
      this.sendError(res, "Ошибка получения пользвателей " + error, 500);
    }
  }

  async getOne(req: Request, res: Response) {
    const { login } = req.params;
    try {
      const user = await this.repository.findOneBy({ login });
      if (!user) return this.sendError(res, "Пользователь не найден", 404);
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, "Ошибка получения пользователя " + error, 500);
    }
  }

  async create(req: Request, res: Response) {
    const { login, password, second_name, first_name, middle_name, role_name } = req.body;
    if (!login || !password || !role_name) {
      return this.sendError(res, "Логин, пароль и роль обязательны", 400);
    }

    try {
      const existing = await this.repository.findOneBy({ login });
      if (existing) return this.sendError(res, "Пользователь уже существует", 400);

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10); // 10 = соль

      const newUser = this.repository.create({
        login,
        password: hashedPassword,
        second_name,
        first_name,
        middle_name,
        role_name,
      });
      await this.repository.save(newUser);
      this.sendSuccess(res, newUser, 201);
    } catch (error) {
      this.sendError(res, "Ошибка создания пользователя " + error, 500);
    }
  }

  async update(req: Request, res: Response) {
    const { login } = req.params;
    const { password, second_name, first_name, middle_name, role_name } = req.body;

    try {
      const user = await this.repository.findOneBy({ login });
      if (!user) return this.sendError(res, "Пользователь не найден", 404);

      if (password) {
        // Если пароль передан, хешируем его
        user.password = await bcrypt.hash(password, 10);
      }
      if (second_name !== undefined) user.second_name = second_name;
      if (first_name !== undefined) user.first_name = first_name;
      if (middle_name !== undefined) user.middle_name = middle_name;
      if (role_name) user.role_name = role_name;

      await this.repository.save(user);
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, "Ошибка обновления " + error, 500);
    }
  }

  async delete(req: Request, res: Response) {
    const { login } = req.params;
    try {
      const user = await this.repository.findOneBy({ login });
      if (!user) return this.sendError(res, "Пользователь не найден", 404);
      await this.repository.remove(user);
      this.sendSuccess(res, { login: login });
    } catch (error) {
      this.sendError(res, "Ошибка удаления пользователя " + error, 500);
    }
  }
}

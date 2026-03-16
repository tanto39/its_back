import { Request, Response } from "express";
import { TechRequest } from "../entities/TechRequest";
import { BaseHandler } from "./BaseHandler";
import { User } from "../entities/User";

export class TechRequestHandler extends BaseHandler {
  protected getEntity() {
    return TechRequest;
  }

  async getAll(req: Request, res: Response) {
    try {
      const requests = await this.repository.find({ relations: ["car", "person", "requestType"] });
      this.sendSuccess(res, requests);
    } catch (error) {
      this.sendError(res, "Ошибка выборки" + error, 500);
    }
  }

  async getOne(req: Request, res: Response) {
    const { request_id } = req.params;
    try {
      const request = await this.repository.findOne({
        where: { request_id: parseInt(request_id) },
        relations: ["car", "person", "requestType"],
      });
      if (!request) return this.sendError(res, "Заявка не найдена", 404);
      this.sendSuccess(res, request);
    } catch (error) {
      this.sendError(res, "Ошибка выборки" + error, 500);
    }
  }

  async create(req: Request, res: Response) {
    const { request_type, car_id, date_repair, person, info } = req.body;
    if (!request_type || !car_id) return this.sendError(res, "Тип и автомобиль обязательны", 400);

    try {
      const newRequest = this.repository.create({
        request_type,
        car_id: parseInt(car_id),
        date_repair: date_repair || null,
        person: person || null,
        info,
      });
      await this.repository.save(newRequest);

      const request = await this.repository.findOne({
        where: { request_id: parseInt(newRequest.request_id) },
        relations: ["car", "person", "requestType"],
      });
      if (!request) return this.sendError(res, "Заявка не найдена", 404);

      console.log(request);

      this.sendSuccess(res, request, 201);
    } catch (error) {
      this.sendError(res, "Ошибка создания " + error, 500);
    }
  }

  async update(req: Request, res: Response) {
    const { request_id } = req.params;
    const { request_type, date_repair, person, info, car_id } = req.body;

    try {
      const request = await this.repository.findOneBy({ request_id: parseInt(request_id) });
      if (!request) return this.sendError(res, "Заявка не найдена", 404);

      if (request_type) request.request_type = request_type;
      if (date_repair !== undefined) request.date_repair = date_repair;
      if (person !== undefined) {
        request.person = person ? ({ login: person } as User) : null;
      }
      if (car_id !== undefined) request.car_id = car_id;
      if (info !== undefined) request.info = info;

      await this.repository.save(request);
      this.sendSuccess(res, request);
    } catch (error) {
      this.sendError(res, "Ошибка обновления " + error, 500);
    }
  }

  async delete(req: Request, res: Response) {
    const { request_id } = req.params;
    try {
      const request = await this.repository.findOneBy({ request_id: parseInt(request_id) });
      if (!request) return this.sendError(res, "Заявка не найдена", 404);
      await this.repository.remove(request);
      this.sendSuccess(res, { request_id: request_id });
    } catch (error) {
      this.sendError(res, "Ошибка удаления " + error, 500);
    }
  }
}

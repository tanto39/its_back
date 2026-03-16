import { Request, Response } from "express";
import { Car } from "../entities/Car";
import { BaseHandler } from "./BaseHandler";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class CarHandler extends BaseHandler {
  protected getEntity() {
    return Car;
  }

  async getAll(req: Request, res: Response) {
    try {
      const cars = await this.repository.find({ relations: ["person"] });
      this.sendSuccess(res, cars);
    } catch (error) {
      this.sendError(res, "Ошибка получения автомобилей" + error, 500);
    }
  }

  async getOne(req: Request, res: Response) {
    const { car_id } = req.params;
    try {
      const car = await this.repository.findOne({
        where: { car_id: parseInt(car_id) },
        relations: ["person", "units"],
      });
      if (!car) return this.sendError(res, "Автомобиль не найден", 404);
      this.sendSuccess(res, car);
    } catch (error) {
      this.sendError(res, "Ошибка получения автомобиля", 500);
    }
  }

  async create(req: Request, res: Response) {
    const { name, reg_number, date_tech, date_repair, milage, person, info } = req.body;
    if (!name) return this.sendError(res, "Name is required", 400);

    try {
      const image_url = req.file ? "/images/" + req.file.filename : null;
      const newCar = this.repository.create({
        name,
        reg_number,
        date_tech: date_tech || null,
        date_repair: date_repair || null,
        milage: milage ? parseInt(milage) : null,
        person: person ? { login: person } : null, // устанавливаем связь через объект с логином
        info,
        image_url,
      });
      await this.repository.save(newCar);

      const car = await this.repository.findOne({
        where: { car_id: parseInt(newCar.car_id) },
        relations: ["person", "units"],
      });
      if (!car) return this.sendError(res, "Автомобиль не найден", 404);
      this.sendSuccess(res, car, 201);
    } catch (error) {
      this.sendError(res, "Ошибка создания: " + error, 500);
    }
  }

  async update(req: Request, res: Response) {
    const { car_id } = req.params;
    const { name, reg_number, date_tech, date_repair, milage, person, info } = req.body;

    try {
      const car = await this.repository.findOne({
        where: { car_id: parseInt(car_id) },
        relations: ["person", "units"],
      });
      if (!car) return this.sendError(res, "Автомобиль не найден", 404);

      if (name) car.name = name;
      if (reg_number !== undefined) car.reg_number = reg_number;
      if (date_tech !== undefined) car.date_tech = date_tech;
      if (date_repair !== undefined) car.date_repair = date_repair;
      if (milage !== undefined) car.milage = milage ? parseInt(milage) : null;
      if (person !== undefined) {
        car.person = person ? ({ login: person } as User) : null;
      }
      if (info !== undefined) car.info = info;
      if (req.file) {
        car.image_url = "/images/" + req.file.filename;
      }

      await this.repository.save(car);
      this.sendSuccess(res, car);
    } catch (error) {
      this.sendError(res, "Ошибка обновления автомобиля " + error, 500);
    }
  }

  async delete(req: Request, res: Response) {
    const { car_id } = req.params;
    try {
      const car = await this.repository.findOne({
        where: { car_id: parseInt(car_id) },
        relations: ["units", "techRequests"],
      });
      if (!car) return this.sendError(res, "Автомобиль не найден", 404);

      const unitRepo = AppDataSource.getRepository("Unit");
      const techRepo = AppDataSource.getRepository("TechRequest");
      await unitRepo.delete({ car_id: car.car_id });
      await techRepo.delete({ car_id: car.car_id });
      await this.repository.remove(car);
      this.sendSuccess(res, { car_id: car_id });
    } catch (error) {
      this.sendError(res, "Ошибка удаления автомобиля: " + error, 500);
    }
  }
}

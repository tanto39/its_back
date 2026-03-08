import { Request, Response } from 'express';
import { Unit } from '../entities/Unit';
import { Car } from '../entities/Car';
import { BaseHandler } from './BaseHandler';
import { AppDataSource } from '../data-source';

export class UnitHandler extends BaseHandler {
  protected getEntity() { return Unit; }

  async getOne(req: Request, res: Response) {
    const { unit_id } = req.params;
    try {
      const unit = await this.repository.findOne({
        where: { unit_id: parseInt(unit_id) },
        relations: ['car']
      });
      if (!unit) return this.sendError(res, 'Не найдено', 404);
      this.sendSuccess(res, unit);
    } catch (error) {
      this.sendError(res, 'Ошибка получения ' + error, 500);
    }
  }

  async create(req: Request, res: Response) {
    const { name, car_id, date_repair, its, info } = req.body;
    if (!name || !car_id) return this.sendError(res, 'Название и автомобиль обязательны', 400);

    try {
      const image_url = req.file ? '/images/' + req.file.filename : null;
      const newUnit = this.repository.create({
        name,
        car_id: parseInt(car_id),
        date_repair: date_repair || null,
        its: its ? parseInt(its) : null,
        info,
        image_url
      });
      await this.repository.save(newUnit);
      await this.recalcCarITS(newUnit.car_id);
      this.sendSuccess(res, newUnit, 201);
    } catch (error) {
      this.sendError(res, 'Ошибка создания ' + error, 500);
    }
  }

  async update(req: Request, res: Response) {
    const { unit_id } = req.params;
    const { name, date_repair, its, info } = req.body;

    try {
      const unit = await this.repository.findOneBy({ unit_id: parseInt(unit_id) });
      if (!unit) return this.sendError(res, 'Не найдено', 404);

      if (name) unit.name = name;
      if (date_repair !== undefined) unit.date_repair = date_repair;
      if (its !== undefined) unit.its = its ? parseInt(its) : null;
      if (info !== undefined) unit.info = info;
      if (req.file) {
        unit.image_url = '/images/' + req.file.filename;
      }

      await this.repository.save(unit);
      await this.recalcCarITS(unit.car_id);
      this.sendSuccess(res, unit);
    } catch (error) {
      this.sendError(res, 'Ошибка обновления ' + error, 500);
    }
  }

  async delete(req: Request, res: Response) {
    const { unit_id } = req.params;
    try {
      const unit = await this.repository.findOneBy({ unit_id: parseInt(unit_id) });
      if (!unit) return this.sendError(res, 'Единица не найдена', 404);
      const carId = unit.car_id;
      await this.repository.remove(unit);
      await this.recalcCarITS(carId);
      this.sendSuccess(res, { unit_id: unit_id });
    } catch (error) {
      this.sendError(res, 'Ошибка удаления ' + error, 500);
    }
  }

  private async recalcCarITS(carId: number) {
    const unitRepo = AppDataSource.getRepository(Unit);
    const carRepo = AppDataSource.getRepository(Car);
    const units = await unitRepo.find({ where: { car_id: carId } });
    const itsValues = units.map(u => u.its).filter(v => v !== null) as number[];
    const avgIts = itsValues.length ? Math.round(itsValues.reduce((a,b) => a+b, 0) / itsValues.length) : 100;
    await carRepo.update(carId, { its: avgIts });
  }
}
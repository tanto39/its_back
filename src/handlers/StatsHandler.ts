import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Car } from '../entities/Car';
import { TechRequest } from '../entities/TechRequest';
import { BaseHandler } from './BaseHandler';
import { Between } from 'typeorm';

export class StatsHandler extends BaseHandler {
  protected getEntity() { return Car; } // не используется, но требуется абстрактным классом

  async getStats(req: Request, res: Response) {
    try {
      const carRepo = AppDataSource.getRepository(Car);
      const requestRepo = AppDataSource.getRepository(TechRequest);

      const totalCars = await carRepo.count();

      const avgItsResult = await carRepo
        .createQueryBuilder('car')
        .select('AVG(car.its)', 'avg')
        .where('car.its IS NOT NULL')
        .getRawOne();
      const avgIts = avgItsResult.avg ? Math.round(avgItsResult.avg) : null;

      const count70_100 = await carRepo.count({ where: { its: Between(70, 100) } });
      const count30_69 = await carRepo.count({ where: { its: Between(30, 69) } });
      const count0_29 = await carRepo.count({ where: { its: Between(0, 29) } });

      const totalRequests = await requestRepo.count();

      this.sendSuccess(res, {
        avgIts,
        totalCars,
        count70_100,
        count30_69,
        count0_29,
        totalRequests
      });
    } catch (error) {
      this.sendError(res, 'Failed to get stats', 500);
    }
  }
}
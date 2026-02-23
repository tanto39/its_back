import { Response } from 'express';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { instanceToPlain } from 'class-transformer';

export abstract class BaseHandler {
  protected abstract getEntity(): new () => any;
  protected repository: Repository<any>;

  constructor() {
    this.repository = AppDataSource.getRepository(this.getEntity());
  }

  protected sendSuccess(res: Response, data: any, status = 200): void {
    const plainData = instanceToPlain(data);
    res.status(status).json(plainData);
  }

  protected sendError(res: Response, message: string, status = 400): void {
    res.status(status).json({ error: message });
  }
}
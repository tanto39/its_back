import { Request, Response } from 'express';
import { TechRequest } from '../entities/TechRequest';
import { BaseHandler } from './BaseHandler';

export class TechRequestHandler extends BaseHandler {
  protected getEntity() { return TechRequest; }

  async getAll(req: Request, res: Response) {
    try {
      const requests = await this.repository.find({ relations: ['car', 'person', 'requestType'] });
      this.sendSuccess(res, requests);
    } catch (error) {
      this.sendError(res, 'Failed to fetch requests', 500);
    }
  }

  async getOne(req: Request, res: Response) {
    const { request_id } = req.params;
    try {
      const request = await this.repository.findOne({
        where: { request_id: parseInt(request_id) },
        relations: ['car', 'person', 'requestType']
      });
      if (!request) return this.sendError(res, 'Request not found', 404);
      this.sendSuccess(res, request);
    } catch (error) {
      this.sendError(res, 'Failed to fetch request', 500);
    }
  }

  async create(req: Request, res: Response) {
    const { request_type, car_id, date_repair, person_login, info } = req.body;
    if (!request_type || !car_id) return this.sendError(res, 'Request type and car_id are required', 400);

    try {
      const newRequest = this.repository.create({
        request_type,
        car_id: parseInt(car_id),
        date_repair: date_repair || null,
        person_login: person_login || null,
        info
      });
      await this.repository.save(newRequest);
      this.sendSuccess(res, newRequest, 201);
    } catch (error) {
      this.sendError(res, 'Failed to create request', 500);
    }
  }

  async update(req: Request, res: Response) {
    const { request_id } = req.params;
    const { request_type, date_repair, person_login, info } = req.body;

    try {
      const request = await this.repository.findOneBy({ request_id: parseInt(request_id) });
      if (!request) return this.sendError(res, 'Request not found', 404);

      if (request_type) request.request_type = request_type;
      if (date_repair !== undefined) request.date_repair = date_repair;
      if (person_login !== undefined) request.person_login = person_login;
      if (info !== undefined) request.info = info;

      await this.repository.save(request);
      this.sendSuccess(res, request);
    } catch (error) {
      this.sendError(res, 'Failed to update request', 500);
    }
  }

  async delete(req: Request, res: Response) {
    const { request_id } = req.params;
    try {
      const request = await this.repository.findOneBy({ request_id: parseInt(request_id) });
      if (!request) return this.sendError(res, 'Request not found', 404);
      await this.repository.remove(request);
      this.sendSuccess(res, { message: 'Request deleted' });
    } catch (error) {
      this.sendError(res, 'Failed to delete request', 500);
    }
  }
}
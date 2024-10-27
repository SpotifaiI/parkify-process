import { Request, Response } from 'express';
import { SenseDomain } from '../domain/SenseDomain';
import { HTTP_SUCCESS } from '../utils/Httputils';

export class SenseController {
  private sense: SenseDomain;

  constructor() {
    this.sense = new SenseDomain();
  }

  async show(_: Request, res: Response): Promise<void> {
    res.status(HTTP_SUCCESS).send({ ok: true });
  }
}

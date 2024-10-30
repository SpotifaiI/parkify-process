import { Request, Response } from 'express';
import { SenseDomain } from '../domain/SenseDomain';
import { SenseBody, SenseData } from '../types/senseTypes';
import { ControllerUtils } from '../utils/ControllerUtils';

export class SenseController {
  private sense: SenseDomain;

  constructor() {
    this.sense = new SenseDomain();
  }

  public async byEncodedUrl(req: Request, res: Response): Promise<void> {
    const { distance, is_available, light }: SenseBody = req.body;

    try {
      const dataIsComplete =
        !ControllerUtils.isUndefined(distance) &&
        !ControllerUtils.isUndefined(is_available) &&
        !ControllerUtils.isUndefined(light);

      if (!dataIsComplete) {
        throw new Error('Parâmetros de [distance, is_available, light] são obrigatórios.');
      }

      const saveData: SenseData = {
        distance: this.sense.toFloat(distance),
        light: this.sense.toFloat(light),
        is_available: this.sense.toAvailable(is_available)
      };

      const saveResult = await this.sense.add(saveData);

      if (!saveResult) {
        throw new Error('Ocorreu um erro e não foi possível salvar a leitura.');
      }

      res.status(200).send({ ok: true, sense: saveResult });
    } catch (error) {
      let message = error as string;

      if (error instanceof Error) {
        message = error.message;
      }

      res.status(400).send({
        ok: false,
        error: message
      });
    }
  }

  public async view(_: Request, res: Response): Promise<void> {
    try {
      const listResult = await this.sense.list();

      res.status(200).send({ ok: true, senses: listResult });
    } catch (error) {
      let message = error as string;

      if (error instanceof Error) {
        message = error.message;
      }

      res.status(400).send({
        ok: false,
        error: message
      });
    }
  }
}

import { Request, Response } from 'express';
import { presentation } from '../config/api';
import { SenseDomain } from '../domain/SenseDomain';
import { SenseBody, SenseData } from '../types/senseTypes';
import { ControllerUtils } from '../utils/ControllerUtils';

export class SenseController {
  private sense: SenseDomain;

  constructor() {
    this.sense = new SenseDomain();
  }

  public async byEncodedUrl(req: Request, res: Response): Promise<void> {
    const { distance, is_available, light, parking_slot }: SenseBody = req.body;

    try {
      const dataIsComplete =
        !ControllerUtils.isUndefined(distance) &&
        !ControllerUtils.isUndefined(is_available) &&
        !ControllerUtils.isUndefined(light) &&
        !ControllerUtils.isUndefined(parking_slot);

      if (!dataIsComplete) {
        throw new Error('Parâmetros de [distance, is_available, light, parking_slot] são obrigatórios.');
      }

      const saveData: SenseData = {
        distance: this.sense.toFloat(distance),
        light: this.sense.toFloat(light),
        is_available: this.sense.toAvailable(is_available),
        parking_slot: (parking_slot || 'N/D').toString()
      };

      const saveResult = await this.sense.add(saveData);

      if (!saveResult) {
        throw new Error('Ocorreu um erro e não foi possível salvar a leitura.');
      }

      const recentFilledSlot = await this.sense.model().recentFilledSlot();
      const recentFreeSlot = await this.sense.model().recentFreeSlot();
      const busySlot = await this.sense.model().busySlot();
      const chillSlot = await this.sense.model().chillSlot();
      const timeFreeToday = await this.sense.model().timeFreeToday();
      const timeFilledToday = await this.sense.model().timeFilledToday();
      const recentFree = await this.sense.model().recentFree();
      const recentFilled = await this.sense.model().recentFilled();

      const recentFreeDistinct: string[] = [];
      const recentFilledDistinct: string [] = [];

      for (let free of recentFree) {
        if (!recentFreeDistinct.includes(free.parking_slot || '')) {
          recentFreeDistinct.push(free.parking_slot || '');
        }
      }
      for (let filled of recentFilled) {
        if (!recentFilledDistinct.includes(filled.parking_slot || '')) {
          recentFilledDistinct.push(filled.parking_slot || '');
        }
      }

      const content = {
        recentFilledSlot: recentFilledSlot?.parking_slot || '',
        recentFreeSlot: recentFreeSlot?.parking_slot || '',
        busySlot: busySlot.parking_slot || '',
        chillSlot: chillSlot.parking_slot || '',
        timeFreeToday,
        timeFilledToday,
        recentFree: recentFreeDistinct,
        recentFilled: recentFilledDistinct
      };

      console.log(content);

      await presentation.post('/refresh', content);

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
import knex from 'knex';
import { db } from '../config/db';
import { SenseData, SenseRow, SerializedSenseRow } from '../types/senseTypes';

export class Sense {
  private db: knex.Knex;

  constructor() {
    this.db = db;
  }

  public insert(info: SenseData) {
    return this.db<SenseData>('sense').insert(info);
  }

  public async list(): Promise<SerializedSenseRow[]> {
    const results = await this.db<SenseRow>('sense').select('*');
    const serialized = results.map(item => {
      const serializedItem: SerializedSenseRow = {
        ...item,
        distance: parseFloat(item.distance),
        light: parseFloat(item.light),
        is_available: item.is_available === 1
      };

      return serializedItem;
    });

    return serialized;
  }
}

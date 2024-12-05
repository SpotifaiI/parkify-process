import knex from 'knex';
import { db } from '../config/db';
import { RecentSlot, SenseData, SenseRow, SerializedSenseRow, TimeSlot } from '../types/senseTypes';
import { ControllerUtils } from '../utils/ControllerUtils';

export class Sense {
  private db: knex.Knex;

  constructor() {
    this.db = db;
  }

  public recentFilledSlot() {
    return this.db<RecentSlot>('sense')
      .select('parking_slot')
      .where('is_available', false)
      .orderBy('created_at', 'desc')
      .first();
  }

  public recentFreeSlot() {
    return this.db<RecentSlot>('sense')
      .select('parking_slot')
      .where('is_available', true)
      .orderBy('created_at', 'desc')
      .first();
  }

  public busySlot() {
    return this.db
      .select(this.db.raw(
        `results.parking_slot
        FROM (
          SELECT (
              (SELECT COUNT(*) FROM sense WHERE is_available = 1 AND parking_slot = master.parking_slot) +
              (SELECT COUNT(*) FROM sense WHERE is_available = 0 AND parking_slot = master.parking_slot)
            ) total,
            master.parking_slot
          FROM sense master
          GROUP BY master.parking_slot
        ) results
        ORDER BY results.total DESC`
      )).first() as Promise<RecentSlot>;
  }

  public chillSlot() {
    return this.db
      .select(this.db.raw(
        `results.parking_slot
        FROM (
          SELECT (
              (SELECT COUNT(*) FROM sense WHERE is_available = 1 AND parking_slot = master.parking_slot) +
              (SELECT COUNT(*) FROM sense WHERE is_available = 0 AND parking_slot = master.parking_slot)
            ) total,
            parking_slot
          FROM sense master
          GROUP BY parking_slot
        ) results
        ORDER BY results.total ASC`
      )).first() as Promise<RecentSlot>;
  }

  public async timeFreeToday() {
    const dates = await this.db<TimeSlot>('sense')
      .select('created_at')
      .where('is_available', true)
      .orderBy('created_at', 'asc');
    const times = dates.map(date => ControllerUtils.getSeconds(new Date(date.created_at || '')));
    let timeDiff = 0;
    let previousTime = 0;

    for (let time of times) {
      if (previousTime > 0) {
        timeDiff += (time - previousTime);
      }

      previousTime = time;
    }

    const timeAverageMinutes = ((timeDiff / times.length) / 60).toFixed(2);

    return ControllerUtils.convertMinutesToMMSS(parseFloat(timeAverageMinutes));
  }

  public async timeFilledToday() {
    const dates = await this.db<TimeSlot>('sense')
      .select('created_at')
      .where('is_available', false)
      .orderBy('created_at', 'asc');
    const times = dates.map(date => ControllerUtils.getSeconds(new Date(date.created_at || '')));
    let timeDiff = 0;
    let previousTime = 0;

    for (let time of times) {
      if (previousTime > 0) {
        timeDiff += (time - previousTime);
      }

      previousTime = time;
    }

    const timeAverageMinutes = ((timeDiff / times.length) / 60).toFixed(2);

    return ControllerUtils.convertMinutesToMMSS(parseFloat(timeAverageMinutes));
  }

  public recentFree() {
    return this.db
      .select(this.db.raw(
        `DISTINCT results.parking_slot
        FROM (
          SELECT parking_slot
          FROM sense
          WHERE is_available = 1
          ORDER BY created_at DESC
        ) results`
      )).limit(3);
  }

  public recentFilled() {
    return this.db
    .select(this.db.raw(
      `DISTINCT results.parking_slot
      FROM (
        SELECT parking_slot
        FROM sense
        WHERE is_available = 0
        ORDER BY created_at DESC
      ) results`
    )).limit(3);
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

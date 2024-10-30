import { Sense } from '../models/Sense';
import { SenseData } from '../types/senseTypes';

export class SenseDomain {
  private sense: Sense;

  constructor() {
    this.sense = new Sense();
  }

  public model(): Sense {
    return this.sense;
  }

  public toFloat(value: string): number {
    return parseFloat(parseFloat(value.replace(',', '.')).toFixed(4));
  }

  public toAvailable(value: string): boolean {
    return parseInt(value) === 1;
  }

  public async add(data: SenseData) {
    const insertListIds = await this.sense.insert(data);

    return insertListIds[0] || 0;
  }

  public async list() {
    const senses = await this.sense.list();

    return senses || [];
  }
}
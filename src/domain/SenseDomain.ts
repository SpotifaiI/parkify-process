import { Sense } from '../models/Sense';

export class SenseDomain {
  private sense: Sense;

  constructor() {
    this.sense = new Sense();
  }

  public model(): Sense {
    return this.sense;
  }
}
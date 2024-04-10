export interface User {
  name: string;
  enable?: boolean;
  [x: string | number | symbol]: unknown;
}

export type RotationType = 'day' | 'week';

export interface Rotation {
  every?: RotationType;
  users: User[];
}

export interface Layer {
  rotation?: Rotation;
  user?: User;
  start?: string;
  end?: string;
}

export interface Schedule {
  layers: Layer[]
}

export function getOnCallPerson(schedule: Schedule) {}
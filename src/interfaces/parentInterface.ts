import { PositionType } from '../types';

export interface ParentModule {
  getPosition(): PositionType;
}

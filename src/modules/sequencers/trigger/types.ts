import { ThreeStateButton } from '@components/index';
import { PositionType } from 'src/types';

export const enum StepId {
  'ONE' = 1,
  'TWO' = 2,
  'THREE' = 3,
}

export interface StepGroup {
  positions: PositionType[];
  threeStateButtons: ThreeStateButton[];
}

export interface Steps {
  [StepId.ONE]: StepGroup;
  [StepId.TWO]: StepGroup;
  [StepId.THREE]: StepGroup;
}

export interface CurrentSteps {
  [StepId.ONE]: number;
  [StepId.TWO]: number;
  [StepId.THREE]: number;
}

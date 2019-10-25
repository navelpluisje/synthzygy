import { InputType, OutputType, PositionType } from 'src/types';

export interface Module {
  draw(): void;
  getActiveOutput(): OutputType;
  getActiveInput(): InputType;
  getActiveControl(): number;
  getSelectedInput(event: MouseEvent): InputType | null;
  getModuleData(): any;
  onMouseDown(event: MouseEvent): boolean;
  onMouseMove(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  setId(id: string): void;
  unset(): void;
}

export interface ModuleData {
  [id: string]: {
    id: string,
    position: PositionType,
    values: Record<string, number | number[] | boolean[]>,
    type: string,
  };
}

import { InputType, OutputType } from 'src/types';

export interface Module {
  draw(): void;
  getActiveOutput(): OutputType;
  getActiveInput(): InputType;
  getActiveControl(): number;
  getSelectedInput(event: MouseEvent): InputType | null;
  getValues(): any;
  onMouseDown(event: MouseEvent): boolean;
  onMouseMove(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  setId(id: string): void;
  unset(): void;
}

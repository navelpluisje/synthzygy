import { GateNode } from './nodes/gateNode';
import { SynthModuleOutput } from "@components/moduleOutput";
import { SynthModuleInput } from "@components/moduleInput";

export type KnobSizes = 'small' | 'medium' | 'large'

export type KnobSizeType = {
  radius: number,
  baseOffset: number,
}

export type KnobSizesType = {
  [size in KnobSizes]: KnobSizeType
}

export type ColorsType = {
  [color: string]: string,
}

export type PositionType = {
  x: number,
  y: number,
}

export type DimensionType = {
  width: number,
  height: number,
}

export type ControlType = {
  type: string,
  label: string,
  size: KnobSizes,
  position: PositionType,
  steps?: Array<string>,
  min?: number,
  max?: number,
  step?: number,
  value?: number,
  log?: boolean,
}

export type ModuleOutputType = {
  icon: string,
  position: PositionType,
}

export type ModuleInputType = {
  icon: string,
  showIcon?: boolean,
  position: PositionType,
  connection?: PositionType[]
}

export type ModuleType = {
  type: string,
  title: string,
  color: string,
  inputs?: Array<string>,
  outputs: Array<string>,
  controls: Array<ControlType>
  position: PositionType,
  dimensions: DimensionType
}

export type ModuleCollectionType = {
  [key: string]: ModuleType
}

export type ConnectionType = {
  from: {
    module: string,
    x: number,
    y: number,
    output: string
  },
  to: {
    module: string,
    yStart: number,
    yEnd: number,
    input: string,
  }
}

export type NewConnectionType = {
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
}

export type ActiveModuleType = {
  key: string,
  x: number,
  y: number,
}

export type CollisionType = {
  x: number,
  y: number,
  width: number,
  height: number,
}

export interface RotaryType extends ControlType {
  xPos: number,
  yPos: number,
}

export type ActiveOutputType = {
  position: PositionType
  type: string;
  node: Function
  component: SynthModuleOutput
} | null

export type ActiveInputType = {
  position: PositionType
  type: string;
  node: Function
  component: SynthModuleInput
} | null

export type ActiveControlType = {
  index: number,
  x: number,
  y: number,
}

export type OutputType = {
  type: string,
  node: OscillatorNode | GainNode | GateNode,
  component: SynthModuleOutput,
}

export type InputType = {
  type: string,
  node: AudioParam | GainNode | Function,
  component: SynthModuleInput,
}





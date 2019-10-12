import { InputConnector, OutputConnector } from '@components/index';
import { ClockNode } from '@nodes/clockNode';
import { GateNode } from '@nodes/gateNode';
import { GateTrigger } from 'src/types';

export type KnobSizes = 'small' | 'medium' | 'large';

export interface KnobSizeType {
  radius: number;
  baseOffset: number;
}

export type KnobSizesType = {
  [size in KnobSizes]: KnobSizeType
};

export interface ColorsType {
  [color: string]: string;
}

export interface PositionType {
  x: number;
  y: number;
}

export interface DimensionType {
  width: number;
  height: number;
}

export interface ControlType {
  type: string;
  label?: string;
  size: KnobSizes;
  position: PositionType;
  steps?: string[];
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  log?: boolean;
}

export interface SynthConnectorType {
  name: string;
  icon?: string;
  type: 'audio' | 'cv' | 'gate';
  showIcon?: boolean;
  showLabel?: boolean;
  position: PositionType;
  connection?: PositionType[];
}

export interface ModuleType {
  type: string;
  title: string;
  color: string;
  inputs?: string[];
  outputs: string[];
  controls: ControlType[];
  position: PositionType;
  dimensions: DimensionType;
}

export interface ModuleCollectionType {
  [key: string]: ModuleType;
}

export interface ConnectionType {
  from: {
    module: string,
    x: number,
    y: number,
    output: string,
  };
  to: {
    module: string,
    yStart: number,
    yEnd: number,
    input: string,
  };
}

export interface NewConnectionType {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
}

export interface ActiveModuleType {
  key: string;
  x: number;
  y: number;
}

export interface CollisionType {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RotaryType extends ControlType {
  xPos: number;
  yPos: number;
}

export type ActiveOutputType = {
  position: PositionType
  type: string;
  node: () => void
  component: OutputConnector
} | null;

export type ActiveInputType = {
  position: PositionType
  type: string;
  node: () => void
  component: InputConnector
} | null;

export interface ActiveControlType {
  index: number;
  x: number;
  y: number;
}

export interface OutputType {
  type: string;
  node?: AudioNode | OscillatorNode | GainNode | AudioWorkletNode;
  gate?: GateNode | ClockNode;
  component: OutputConnector;
}

export interface InputType {
  type: string;
  node?: AudioNode | AudioParam | AudioWorkletNode;
  gate?: GateTrigger;
  cv?: AudioParam;
  component: InputConnector;
}

export type GateTrigger = (value: number) => void;

export type SetMidiDevice = (id: string) => void;

import { InputConnector, OutputConnector } from '@components/index';
import { ModuleData } from '@interfaces/moduleInterface';
import { ClockNode } from '@nodes/clockNode';
import { GateNode } from '@nodes/gateNode';

export type KnobSizes = 'small' | 'medium' | 'large';

export interface KnobSizeType {
  radius: number;
  baseOffset: number;
}

export type KnobSizesType = {
  [size in KnobSizes]: KnobSizeType
};

export type SliderSizesType = {
  [size in KnobSizes]: number
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

export interface KnobType {
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
  controls: KnobType[];
  position: PositionType;
  dimensions: DimensionType;
}

export interface ModuleCollectionType {
  [key: string]: ModuleType;
}

export interface ModuleDefaultValues {
  [parameter: string]: number | string | number[] | boolean[];
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

export interface ConnectionData {
  input: Record<'module' | 'name', string>;
  output: Record<'module' | 'name', string>;
}

export interface PatchData {
  connections: ConnectionData[];
  modules: ModuleData;
  // modules: Record<string, ModuleDefaultValues>;
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

export interface ActiveKnobType {
  index: number;
  x: number;
  y: number;
}

export interface OutputType {
  module: string;
  type: string;
  name: string;
  node?: AudioNode | OscillatorNode | GainNode | AudioWorkletNode;
  gate?: GateNode | ClockNode;
  component: OutputConnector;
}

export interface InputType {
  module: string;
  type: string;
  name: string;
  node?: AudioNode | AudioParam | AudioWorkletNode;
  gate?: GateTrigger;
  component: InputConnector;
}

export type GateTrigger = (value: number) => void;

export type SetMidiDevice = (id: string) => void;

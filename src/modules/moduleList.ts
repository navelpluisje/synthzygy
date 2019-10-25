import { ModuleData } from '@interfaces/moduleInterface';
import { Synth } from 'src/app/synth';
import { DimensionType, PositionType } from 'src/types';
import { Knob } from '../components/knob';
import {
  AudioOut,
  BitCrusher,
  Clock,
  Delay,
  Envelope,
  Filter,
  GateTrigger,
  HiHat,
  Kick,
  Lfo,
  Midi,
  Mixer,
  Noise,
  Oscillator,
  Oscilloscope,
  Sequencer,
  Snare,
  TuringMachine,
  Vca,
 } from './index';

type Module = AudioOut
  | BitCrusher
  | Clock
  | Delay
  | Envelope
  | Filter
  | GateTrigger
  | HiHat
  | Kick
  | Lfo
  | Midi
  | Mixer
  | Noise
  | Oscillator
  | Oscilloscope
  | TuringMachine
  | Sequencer
  | Snare
  | Vca;
interface Modules {
  [key: string]: Module;
}

export class ModuleList {
  public canvas: CanvasRenderingContext2D;
  public audio: AudioContext;
  private modules: Modules = {};
  private activeModuleId: string;

  constructor(canvas: CanvasRenderingContext2D, audio: AudioContext) {
    this.canvas = canvas;
    this.audio = audio;
  }

  public addModule(group: string, name: string): void {
    const tmpModule = this.getModule(name);
    const key = new Date().getTime().toString();
    const position: PositionType = this.calculatePosition(tmpModule.dimensions);

    if (position.x > 0) {
      this.modules[key] = new tmpModule(this.canvas, this.audio, position, {
        id: key,
      });
      this.modules[key].setId(key);
      requestAnimationFrame(this.draw);
    } else {
      alert(`Looks like there's no room for: ${name}`);
    }
  }

  public removeModule(key: string) {
    delete this.modules[key];
    requestAnimationFrame(this.draw);
  }

  public getActiveModule() {
    return this.modules[this.activeModuleId];
  }

  public moveActiveModule(event: MouseEvent) {
    const activeModule = this.getActiveModule();
    const offset = activeModule.getOffset();
    const position = {
      x: event.offsetX - offset.x,
      y: event.offsetY - offset.y,
    };
    const dimensions = this.getModule(activeModule.type).dimensions;

    if (!Object.values(this.modules).some((module) => {
      if (module.getId() === activeModule.getId()) {
        return false;
      }
      return this.doesCollide(module, position, dimensions);
    })) {
      this.getActiveModule().onMouseMove(event);
      this.draw();
    }
  }

  public draw = () => {
    const {width, height} = Synth.canvasDimension;
    this.canvas.clearRect(0, 0, width, height);
    Knob.knobCanvas.clearRect(0, 0, width, height);

    Object.values(this.modules).forEach((module) => module.draw());
  }

  public moduleSelected(event: MouseEvent): boolean {
    Object.entries(this.modules).some(([key, module]) => {
      if (!module.onMouseDown(event)) { return false; }
      this.activeModuleId = key;
      return true;
    });

    return this.activeModuleId !== '';
  }

  public onMouseUp(event: MouseEvent) {
    Object.values(this.modules).forEach((module) => {
      module.onMouseUp(event);
      module.unset();
    });
  }

  public getAllModulesData = (): ModuleData => {
    let values = {};
    Object.values(this.modules).forEach((module) => {
      const id = module.getId();
      values = {
        ...values,
        [id]: {
          id,
          position: module.getPosition(),
          type: module.getType(),
          values: module.getModuleData(),
        },
      };
    });

    return values;
  }

  private getModule(name: string) {
    switch (name) {
      case 'audioOut':
        return AudioOut;
      case 'bitCrusher':
        return BitCrusher;
      case 'clock':
        return Clock;
      case 'delay':
        return Delay;
      case 'envelope':
        return Envelope;
      case 'filter':
        return Filter;
      case 'gate':
      case 'gateTrigger':
        return GateTrigger;
      case 'hihat':
        return HiHat;
      case 'kick':
        return Kick;
      case 'lfo':
        return Lfo;
      case 'midi':
        return Midi;
      case 'mixer':
        return Mixer;
      case 'noise':
        return Noise;
      case 'oscillator':
        return Oscillator;
      case 'oscilloscope':
        return Oscilloscope;
      case 'sequencer':
        return Sequencer;
      case 'snare':
        return Snare;
      case 'turinger':
        return TuringMachine;
      case 'vca':
        return Vca;
    }
  }

  private doesCollide = (module: Module, position: PositionType, dimensions: DimensionType): boolean => {
    const modDimensions = this.getModule(module.getType()).dimensions;
    const modPosition = module.getPosition();
    if (
      (
        position.x > modPosition.x + modDimensions.width
        || position.x + dimensions.width < modPosition.x
      )
      && position.x + dimensions.width < Synth.canvasDimension.width
    ) {
      return false;
    }
    if (
      (
        position.y > modPosition.y + modDimensions.height
        || position.y + dimensions.height < modPosition.y
      )
      && position.y + dimensions.height < Synth.canvasDimension.height
    ) {
      return false;
    }
    return true;
  }

  private calculatePosition(dimensions: DimensionType): PositionType {
    const {width: canvasWidth, height: canvasHeight} = Synth.canvasDimension;
    let position = {
      x: 10,
      y: 10,
    };
    let collide = true;

    for (let y = 10; y < canvasHeight; y += 10) {
      for (let x = 10; x < canvasWidth; x += 10) {
        position = {x, y};
        if (!Object.values(this.modules).some((module) => this.doesCollide(module, position, dimensions))) {
          collide = false;
          break;
        }
      }
      if (!collide) {
        return position;
      }
    }
    return {
      x: 0,
      y: 0,
    };
  }
}

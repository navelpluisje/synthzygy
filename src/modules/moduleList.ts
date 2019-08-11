import { PositionType, DimensionType } from 'src/types';
import { Lfo } from "@modules/lfo";
import { Oscillator } from "@modules/oscillator";
import { Mixer } from "@modules/mixer";
import { Vca } from "@modules/vca";
import { Envelope } from "@modules/envelope";
import { AudioOut } from "@modules/audio-out";
import { Filter } from "@modules/filter";
import { Keyboard } from "@modules/keyboard";
import { GateTrigger } from "@modules/gateTrigger";
import { SynthModuleRotary } from '../components/moduleRotary';

type Modules = {
  [key: string]: Lfo | Oscillator | Mixer | Vca | Envelope | AudioOut | Filter | GateTrigger | Keyboard,
}

export class ModuleList {
  canvas: CanvasRenderingContext2D
  audio: AudioContext
  private modules: Modules = {}
  private activeModuleId: string

  constructor(canvas: CanvasRenderingContext2D, audio: AudioContext) {
    this.canvas = canvas
    this.audio = audio
  }

  public addModule(group: string, name: string): void {
    const Module = this.getModule(name)
    const key = new Date().getTime().toString()
    const position: PositionType = this.calculatePosition(Module.dimensions)

    this.modules[key] = new Module(this.canvas, this.audio, position)
    requestAnimationFrame(this.draw)
  }

  private getModule(name: string) {
    switch (name) {
      case 'audioOut':
        return AudioOut
      case 'envelope':
        return Envelope
      case 'filter':
        return Filter
      case 'gate':
        return GateTrigger
      case 'keyboard':
        return Keyboard
      case 'lfo':
        return Lfo
      case 'mixer':
        return Mixer
      case 'oscillator':
        return Oscillator
      case 'vca':
        return Vca
    }
  }

  private calculatePosition(dimensions: DimensionType): PositionType {
    const x = Object.keys(this.modules).length

    return {
      x: x * 150,
      y: 20,
    }
  }

  public removeModule(key: string) {
    delete this.modules[key]
  }

  public getActiveModule() {
    return this.modules[this.activeModuleId]
  }

  public moveActiveModule(event: MouseEvent) {
    this.getActiveModule().onMouseMove(event)
    requestAnimationFrame(this.draw)
  }

  public draw = () => {
    this.canvas.clearRect(0, 0, 1000, 600)
    SynthModuleRotary.rotaryCanvas.clearRect(0, 0, 1000, 600)

    Object.values(this.modules).forEach(module => module.draw())
  }

  public moduleSelected(event: MouseEvent): boolean {
    Object.entries(this.modules).some(([key, module]) => {
      if (!module.onMouseDown(event)) { return false }
      this.activeModuleId = key;
      return true
    })

    return this.activeModuleId !== ''
  }

  public onMouseUp(event: MouseEvent) {
    Object.values(this.modules).forEach(module => {
      module.onMouseUp(event)
      module.unset()
    })

  }
}
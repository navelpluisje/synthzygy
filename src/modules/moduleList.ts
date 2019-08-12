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
import { Synth } from 'src/app/synth';

type Module = Lfo | Oscillator | Mixer | Vca | Envelope | AudioOut | Filter | GateTrigger | Keyboard
type Modules = {
  [key: string]: Module,
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

    if (position.x > 0) {
      this.modules[key] = new Module(this.canvas, this.audio, position)
      requestAnimationFrame(this.draw)
    } else {
      alert(`Looks like there's no room for: ${name}`)
    }
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
      case 'gateTrigger':
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

  private doesCollide = (module: Module, position: PositionType, dimensions: DimensionType): boolean => {
    const modDimensions = this.getModule(module.type).dimensions
    if (
      (
        position.x > module.position.x + modDimensions.width
        || position.x + dimensions.width < module.position.x
      )
      && position.x + dimensions.width < Synth.canvasDimension.width
    ) {
      return false
    }
    if (
      (
        position.y > module.position.y + modDimensions.height
        || position.y + dimensions.height < module.position.y
      )
      && position.y + dimensions.height < Synth.canvasDimension.height
    ) {
      return false
    }
    return true
  }

  private calculatePosition(dimensions: DimensionType): PositionType {
    const {width: canvasWidth, height: canvasHeight} = Synth.canvasDimension
    let position = {
      x: 10,
      y: 10,
    }
    let collide = true

    for (let y = 10; y < canvasHeight; y += 10) {
      for (let x = 10; x < canvasWidth; x += 10) {
        position = {x, y}
        if (!Object.values(this.modules).some(module => this.doesCollide(module, position, dimensions))) {
          collide = false
          break
        }
      }
      if (!collide) {
        return position
      }
    }
    return {
      x: 0,
      y: 0,
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
    const {width, height} = Synth.canvasDimension
    this.canvas.clearRect(0, 0, width, height)
    SynthModuleRotary.rotaryCanvas.clearRect(0, 0, width, height)

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
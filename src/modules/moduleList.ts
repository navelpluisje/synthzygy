import { Oscilloscope } from './oscilloscope/index';
import { PositionType, DimensionType } from 'src/types';
import {
  AudioOut,
  BitCrusher,
  Clock,
  Delay,
  Envelope,
  Filter,
  GateTrigger,
  Keyboard,
  Lfo,
  Mixer,
  Oscillator,
  Sequencer,
  Vca,
 } from "./index";
import { Rotary } from '../components/rotary';
import { Synth } from 'src/app/synth';

type Module = Lfo | Oscillator | Mixer | Vca | Envelope | AudioOut | Filter | GateTrigger | Keyboard | Delay | BitCrusher | Clock | Sequencer | Oscilloscope
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
      this.modules[key].setId(key)
      requestAnimationFrame(this.draw)
    } else {
      alert(`Looks like there's no room for: ${name}`)
    }
  }

  private getModule(name: string) {
    switch (name) {
      case 'audioOut':
        return AudioOut
      case 'bitCrusher':
        return BitCrusher
      case 'clock':
        return Clock
      case 'delay':
        return Delay
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
      case 'oscilloscope':
        return Oscilloscope
      case 'sequencer':
        return Sequencer
      case 'vca':
        return Vca
    }
  }

  private doesCollide = (module: Module, position: PositionType, dimensions: DimensionType): boolean => {
    const modDimensions = this.getModule(module.getType()).dimensions
    const modPosition = module.getPosition()
    if (
      (
        position.x > modPosition.x + modDimensions.width
        || position.x + dimensions.width < modPosition.x
      )
      && position.x + dimensions.width < Synth.canvasDimension.width
    ) {
      return false
    }
    if (
      (
        position.y > modPosition.y + modDimensions.height
        || position.y + dimensions.height < modPosition.y
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
    const activeModule = this.getActiveModule()
    const offset = activeModule.getOffset()
    const position = {
      x: event.layerX - offset.x,
      y: event.layerY - offset.y,
    }
    const dimensions = this.getModule(activeModule.type).dimensions

    if (!Object.values(this.modules).some(module => {
      if (module.getId() === activeModule.getId()) {
        return false
      }
      return this.doesCollide(module, position, dimensions)
    })) {
      this.getActiveModule().onMouseMove(event)
      this.draw()
    }
  }

  public draw = () => {
    const {width, height} = Synth.canvasDimension
    this.canvas.clearRect(0, 0, width, height)
    Rotary.rotaryCanvas.clearRect(0, 0, width, height)

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
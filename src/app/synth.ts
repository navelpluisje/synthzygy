import { ModuleList } from "@modules/moduleList";
import { ConnectionList, Rotary } from "@components/index";
import { DimensionType } from "src/types";

export class Synth {
  static canvasDimension: DimensionType = {
    height: 600,
    width: 1000,
  }
  private moduleCanvas: HTMLCanvasElement
  private rotaryCanvas: HTMLCanvasElement
  private connectionCanvas: HTMLCanvasElement
  private modulesCtx: CanvasRenderingContext2D
  private rotaryCtx: CanvasRenderingContext2D
  private connectionCtx: CanvasRenderingContext2D

  private synthArea: HTMLElement
  private audioContext: AudioContext;

  private init: boolean = true
  private mooved: boolean = false
  private modules: ModuleList
  private connections: ConnectionList = new ConnectionList()

  constructor() {
    this.moduleCanvas = <HTMLCanvasElement>document.getElementById('canvas')
    this.rotaryCanvas = <HTMLCanvasElement>document.getElementById('canvas-rotary')
    this.connectionCanvas = <HTMLCanvasElement>document.getElementById('canvas-connection')

    this.synthArea = document.querySelector('main')
    this.connectionCanvas.addEventListener('mousedown', this.onMouseDown);
    // Prevent the context menu to disturb our creativity
    this.connectionCanvas.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      return false
    });
    this.setSize()
    window.addEventListener('resize', this.setSize)
  }

 public onMouseDown = (event: MouseEvent) => {
    // Left mouse button used
    console.log('Synth Mousedown')
    if (event.button === 0 && !event.ctrlKey) {
      if (this.modules.moduleSelected(event)) {
        const module = this.modules.getActiveModule()
        if (module && module.hasActiveOutput()) {
          this.connections.setNewConnection(module.getActiveOutput(), event)
        }
      }
    }
    // right button clicked
    if (event.button === 2 || (event.button === 0 && event.ctrlKey)) {
      this.connections.removeConnection(event)
    }

    this.connectionCanvas.addEventListener('mousemove', this.onMouseMove)
    this.connectionCanvas.addEventListener('mouseup', this.onMouseUp)
  }

  public onMouseMove = (event: MouseEvent) => {
    // TODO: Need to make a nicer fix for this.
    // Neeeded 'cause Chrome will not start the audio
    if (this.init) {
      this.init = false
      this.audioContext.resume()
    }
    this.mooved = true
    const module = this.modules.getActiveModule()
    if (module) {
      if (module.hasActiveOutput()) {
        this.connections.updateConnection(event)
      } else if (module.hasActiveControl()) {
        module.onMouseMove(event)
      } else {
        this.modules.moveActiveModule(event)
        requestAnimationFrame(this.connections.draw)
      }
    }
  }

  public onMouseUp = (event: MouseEvent) => {
    const module = this.modules.getActiveModule()

    if (module && !this.mooved) {
      // console.log('clicked')
      module.onMouseClick(event)
      this.modules.draw()
    } else if (module && this.mooved) {
      // console.log('mooved')
      if (this.modules.moduleSelected(event) && this.connections.hasNewConnection()) {
        const endModule = this.modules.getActiveModule()
        const input = endModule.getSelectedInput(event)
        if (input) {
          this.connections.createConnection(input)
        }
      }
    }

    // Clean up all the rest
    this.connections.hasNewConnection() && this.connections.removeNewConnection()
    this.modules.onMouseUp(event)

    this.mooved = false
    this.connectionCanvas.removeEventListener('mousemove', this.onMouseMove)
    this.connectionCanvas.removeEventListener('mouseup', this.onMouseUp)
    // requestAnimationFrame(draw)
  }

  private getWorklets = async () => {
    await this.audioContext.audioWorklet.addModule('dist/processors.js')
  }

  public addModule = (category: string, name: string) => {
    // @ts-ignore
    this.modules.addModule(category, name)
  }

  private setSize = () => {
    const {width, height} = this.synthArea.getBoundingClientRect()
    Synth.canvasDimension = { width, height }
    this.moduleCanvas.setAttribute('width', width.toString())
    this.moduleCanvas.setAttribute('height', height.toString())
    this.rotaryCanvas.setAttribute('width', width.toString())
    this.rotaryCanvas.setAttribute('height', height.toString())
    this.connectionCanvas.setAttribute('width', width.toString())
    this.connectionCanvas.setAttribute('height', height.toString())

    // this.modules && this.modules.draw()
    // this.connections && this.connections.draw()
  }

  public async start() {
    if (this.moduleCanvas.getContext) {
      console.log('start npModular')
      this.audioContext = new AudioContext()
      await this.getWorklets()
      this.modulesCtx = this.moduleCanvas.getContext('2d')
      this.rotaryCtx = this.rotaryCanvas.getContext('2d')
      this.connectionCtx = this.connectionCanvas.getContext('2d')

      Rotary.rotaryCanvas = this.rotaryCtx
      ConnectionList.canvas = this.connectionCtx
      this.modules = new ModuleList(this.modulesCtx, this.audioContext)

      const menuitems = document.querySelectorAll('np-moduleitem')
    }
    this.modules.draw()
    this.connections.draw()
  }
}
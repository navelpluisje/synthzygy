import { ModuleList } from "@modules/moduleList";
import { ConnectionList } from "@components/ConnectionList";
import { SynthModuleRotary } from "@components/moduleRotary";

export class Synth {
  moduleCanvas: HTMLCanvasElement
  rotaryCanvas: HTMLCanvasElement
  connectionCanvas: HTMLCanvasElement
  modulesCtx: CanvasRenderingContext2D
  rotaryCtx: CanvasRenderingContext2D
  connectionCtx: CanvasRenderingContext2D

  audioContext: AudioContext;

  init: boolean = true
  mooved: boolean = false
  modules: ModuleList
  connections: ConnectionList = new ConnectionList()

  constructor() {
    this.moduleCanvas = <HTMLCanvasElement>document.getElementById('canvas')
    this.rotaryCanvas = <HTMLCanvasElement>document.getElementById('canvas-rotary')
    this.connectionCanvas = <HTMLCanvasElement>document.getElementById('canvas-connection')
    this.connectionCanvas.addEventListener('mousedown', this.onMouseDown);
    // Prevent the context menu to disturb our creativity
    this.connectionCanvas.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      return false
    });
  }

  onMouseDown = (event: MouseEvent) => {
    // Left mouse button used
    if (event.button === 0 && !event.ctrlKey) {
      if (this.modules.moduleSelected(event)) {
        const module = this.modules.getActiveModule()
        if (module.activeOutput) {
          this.connections.setNewConnection(module.activeOutput, event)
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

  onMouseMove = (event: MouseEvent) => {
    // TODO: Need to make a nicer fix for this.
    // Neeeded 'cause Chrome will not start the audio
    if (this.init) {
      this.init = false
      this.audioContext.resume()
    }
    this.mooved = true
    const module = this.modules.getActiveModule()
    if (module) {
      if (module.activeOutput !== null) {
        this.connections.updateConnection(event)
      } else if (module.activeControl !== null) {
        module.onMouseMove(event)
      } else {
        this.modules.moveActiveModule(event)
        requestAnimationFrame(this.connections.draw)
      }
    }
  }

  onMouseUp = (event: MouseEvent) => {
    const module = this.modules.getActiveModule()

    if (module && !this.mooved) {
      // console.log('clicked')
      module.onMouseClick(event)
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

  getWorklets = async () => {
    await this.audioContext.audioWorklet.addModule('dist/cvOutput.js')
  }

  addModule = (category: string, name: string) => {
    // @ts-ignore
    this.modules.addModule(category, name)
  }

  async start() {
    if (this.moduleCanvas.getContext) {
      this.audioContext = new AudioContext()
      await this.getWorklets()
      this.modulesCtx = this.moduleCanvas.getContext('2d')
      this.rotaryCtx = this.rotaryCanvas.getContext('2d')
      this.connectionCtx = this.connectionCanvas.getContext('2d')

      SynthModuleRotary.rotaryCanvas = this.rotaryCtx
      ConnectionList.canvas = this.connectionCtx
      this.modules = new ModuleList(this.modulesCtx, this.audioContext)

      const menuitems = document.querySelectorAll('np-moduleitem')
    }
    this.modules.draw()
    this.connections.draw()
  }
}
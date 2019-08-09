import { ModuleList } from '@components/moduleList';
import { ConnectionList } from '@components/ConnectionList';
import { SynthModuleRotary } from '@components/moduleRotary';
import { setCssColors } from '@utilities/colors'
import ListModuleGroup from './customElements/listModuleGroup'
import ListModuleItem from './customElements/listModuleItem'

ListModuleGroup()
ListModuleItem()

// Canvasses
const canvas = <HTMLCanvasElement>document.getElementById('canvas')
const rotaryCanvas = <HTMLCanvasElement>document.getElementById('canvas-rotary')
const connectionCanvas = <HTMLCanvasElement>document.getElementById('canvas-connection')

let mooved: boolean = false
let init = true

let ctx: CanvasRenderingContext2D
let rotaryCtx: CanvasRenderingContext2D
let connectionCtx: CanvasRenderingContext2D

let modules: ModuleList
const connections: ConnectionList = new ConnectionList()

function onMouseDown(event: MouseEvent) {
  // Left mouse button used
  if (event.button === 0 && !event.ctrlKey) {
    if (modules.moduleSelected(event)) {
      const module = modules.getActiveModule()
      if (module.activeOutput) {
        connections.setNewConnection(module.activeOutput, event)
      }
    }
  }
  // right button clicked
  if (event.button === 2 || (event.button === 0 && event.ctrlKey)) {
    // Do stuff for the right click
    // If connection input/output > remove connection
    connections.removeConnection(event)
  }

  connectionCanvas.addEventListener('mousemove', onMouseMove)
  connectionCanvas.addEventListener('mouseup', onMouseUp)
  requestAnimationFrame(draw)
}

function onMouseMove(event: MouseEvent) {
  // TODO: Need to make a nicer fix for this.
  // Neeeded 'cause Chrome will not start the audio
  if (init) {
    init = false
    act.resume()
  }
  // TODO: Get the activeModule
  // If it's the module, move it around. => Redraw everything
  // If it's a control handle the control stuff
  // If it's an output, draw the connection
  mooved = true
  const module = modules.getActiveModule()
  if (module) {
    module.onMouseMove(event)

    if (module && module.activeOutput) {
      connections.updateConnection(event)
    }
  }
  requestAnimationFrame(draw)
}

function onMouseUp(event: MouseEvent) {
  // TODO: What do we do when we stop
  // Reset all mouse related stuff
  // In case of a new connection, add the connection

  const module = modules.getActiveModule()

  if (module && !mooved) {
    // console.log('clicked')
    module.onMouseClick(event)
  } else {
    // console.log('mooved')
    if (modules.moduleSelected(event)) {
      const endModule = modules.getActiveModule()

      if (connections.hasNewConnection()) {
        const input = endModule.getSelectedInput(event)
        if (input) {
          connections.createConnection(input)
        }
      }
    }
  }
  connections.removeNewConnection()
  modules.onMouseUp(event)
  mooved = false
  connectionCanvas.removeEventListener('mousemove', onMouseMove)
  connectionCanvas.removeEventListener('mouseup', onMouseUp)
  requestAnimationFrame(draw)
}

connectionCanvas.addEventListener('mousedown', onMouseDown);
// Prevent the context menu to disturb our creativity
connectionCanvas.addEventListener('contextmenu', (event) => {
  event.preventDefault()
  return false
});

function draw() {
  modules.draw()
  connections.draw()
}

const getWorklets = async (act: AudioContext) => {
  await act.audioWorklet.addModule('dist/cvOutput.js')
}

let act: AudioContext;
async function start() {
  if (canvas.getContext) {
    act = new AudioContext()
    await getWorklets(act)
    ctx = canvas.getContext('2d')
    rotaryCtx = rotaryCanvas.getContext('2d')
    connectionCtx = connectionCanvas.getContext('2d')
    SynthModuleRotary.rotaryCanvas = rotaryCtx
    ConnectionList.canvas = connectionCtx
    modules = new ModuleList(ctx, act)
    modules.addModule('test', 'oscillator')

    const menuitems = document.querySelectorAll('np-moduleitem')
    menuitems.forEach(item => item.addEventListener('itemclick', ({target}) => {
      // @ts-ignore
      modules.addModule('test', target.name)
      requestAnimationFrame(draw)
    }))
  }
  draw()
}

setCssColors()
start()

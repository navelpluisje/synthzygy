import { Filter } from '@modules/filter';
import { AudioOut } from '@modules/audio-out';
import { PositionType, OutputType } from 'src/types';
import { ConnectionList } from '@components/ConnectionList';
import { SynthModuleRotary } from '@components/moduleRotary';
import { GateTrigger } from '@modules/gateTrigger/index';
import { Lfo } from '@modules/lfo';
import { Oscillator } from '@modules/oscillator';
import { Mixer } from '@modules/mixer';
import { Vca } from '@modules/vca';
import { ActiveControlType } from './types'
import { Envelope } from '@modules/envelope';
import { setCssColors } from '@utilities/colors'
import ListModuleGroup from './customElements/listModuleGroup'
import ListModuleItem from './customElements/listModuleItem'

ListModuleGroup()
ListModuleItem()

const canvas = <HTMLCanvasElement>document.getElementById('canvas')
const rotaryCanvas = <HTMLCanvasElement>document.getElementById('canvas-rotary')
const connectionCanvas = <HTMLCanvasElement>document.getElementById('canvas-connection')
const rackHeight = 267;

let mooved: boolean = false
let activeModule: string | null = null
let init = true

let modules: {
  [key: string]: Lfo | Oscillator | Mixer | Vca | Envelope | AudioOut | Filter | GateTrigger,
} = {}
let ctx: CanvasRenderingContext2D
let rotaryCtx: CanvasRenderingContext2D
let connectionCtx: CanvasRenderingContext2D

type NewConnectionType = {
  start: OutputType | null,
  end: {
    position: PositionType,
  } | null
}

const connections: ConnectionList = new ConnectionList()

function onMouseMove(event: MouseEvent) {
  if (init) {
    init = false
    act.resume()
  }
  // TODO: Get the activeModule
  // If it's the module, move it around. => Redraw everything
  // If it's a control handle the control stuff
  // If it's an output, draw the connection
  mooved = true
  activeModule && modules[activeModule].onMouseMove(event)
  if (activeModule && modules[activeModule].activeOutput) {
    connections.onMouseMove(event)
  }
  requestAnimationFrame(draw)
}

function onMouseUp(event: MouseEvent) {
  // TODO: What do we do when we stop
  // Reset all mouse related stuff
  // In case of a new connection, add the connection
  if (activeModule && !mooved) {
    // console.log('clicked')
    modules[activeModule].onMouseClick(event)
  } else {
    // console.log('mooved')
    mooved = false
    if (connections.hasNewConnection()) {
      const { layerX, layerY } = event
      Object.entries(modules).some(([key, module]) => {
        if (!module.onMouseDown(layerX, layerY)) { return false }
        const input = module.getSelectedInput(event)
        if (input) {
          connections.onMouseUp(input)
        }
      })
    }
  }
  Object.values(modules).forEach(module => {
    module.onMouseUp(event)
    module.unset()
  })


  mooved = false;
  activeModule = null
  connectionCanvas.removeEventListener('mousemove', onMouseMove)
  connectionCanvas.removeEventListener('mouseup', onMouseUp)
  requestAnimationFrame(draw)
}

function onMouseDown(event: MouseEvent) {
  const {layerX, layerY} = event
  Object.entries(modules).some(([key, module]) => {
    if (!module.onMouseDown(layerX, layerY)) { return false }
    activeModule = key;
    if (module.activeOutput) {
      connections.setNewConnection(module.activeOutput, event)
    } else if (module) {

    }
  })
  connectionCanvas.addEventListener('mousemove', onMouseMove)
  connectionCanvas.addEventListener('mouseup', onMouseUp)
  requestAnimationFrame(draw)
}

connectionCanvas.addEventListener('mousedown', onMouseDown);

function draw() {
  Object.values(modules).forEach(module => module.draw())
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

    modules.osc1 = new Oscillator(ctx, act, {x: 225, y: 50})
    modules.osc2 = new Oscillator(ctx, act, {x: 225, y: 270})
    modules.lfo1 = new Lfo(ctx, act, {x: 50, y: 50})
    modules.mixer1 = new Mixer(ctx, act, {x: 440, y: 50})
    modules.vca1 = new Vca(ctx, act, {x: 440, y: 320})
    modules.envelope1 = new Envelope(ctx, act, {x: 635, y: 50})
    modules.audioOut1 = new AudioOut(ctx, act, {x: 805, y: 50})
    modules.filter1 = new Filter(ctx, act, {x: 805, y: 250})
    modules.trigger1 = new GateTrigger(ctx, act, {x: 635, y: 280})
  }
  draw()
}
setCssColors()
start()

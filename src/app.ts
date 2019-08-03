import { Filter } from '@modules/filter';
import { AudioOut } from '@modules/audio-out';
import { PositionType, OutputType } from 'src/types';
import { Connection } from '@components/connection';
import { SynthModuleRotary } from '@components/moduleRotary';
import { GateTrigger } from '@modules/gateTrigger/index';
import { Lfo } from '@modules/lfo';
import { Oscillator } from '@modules/oscillator';
import { Mixer } from '@modules/mixer';
import { Vca } from '@modules/vca';
import { ActiveControlType } from './types'
import { Envelope } from '@modules/envelope';

const canvas = <HTMLCanvasElement>document.getElementById('canvas')
const rotaryCanvas = <HTMLCanvasElement>document.getElementById('canvas-rotary')
const rackHeight = 267;

let connectionColor = 0
let mooved: boolean = false
let activeModule: string | null = null
let activeControl: ActiveControlType | null = null
let activeOutput: OutputType | null = null
let init = true

let modules: {
  [key: string]: Lfo | Oscillator | Mixer | Vca | Envelope | AudioOut | Filter | GateTrigger,
} = {}
let ctx: CanvasRenderingContext2D
let rotaryCtx: CanvasRenderingContext2D

type NewConnectionType = {
  start: OutputType | null,
  end: {
    position: PositionType,
  } | null
}

let newConnection: NewConnectionType | null = null

const connections: Array<Connection> = []

const drawConnection = (ctx: CanvasRenderingContext2D) => {
  const tightness = 100
  const startPosition = newConnection.start.component.getPosition()
  const startX = startPosition.x
  const startY = startPosition.y
  const endX = newConnection.end.position.x
  const endY = newConnection.end.position.y

  const offset = endX < startX ? -.25 : .25
  ctx.lineWidth = 4
  // Create the plugs first
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.beginPath();
  ctx.arc(startX, startY, 5, 0, Math.PI * 2)
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(endX, endY, 5, 0, Math.PI * 2)
  ctx.stroke();

  // Create the actual cable
  ctx.lineCap = 'round'
  ctx.shadowBlur = 1
  ctx.shadowColor = 'black'
  ctx.strokeStyle = `#8c1c13`
  ctx.lineWidth = 4
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(
    startX + Math.abs(startX - endX) * offset,
    startY + tightness,
    endX - Math.abs(startX - endX) * offset,
    endY + tightness,
    endX,
    endY
  );
  ctx.stroke();
  // reset som stuff
  ctx.lineWidth = 1
  ctx.shadowBlur = 0
}

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
    newConnection.end.position = {
      x: event.layerX,
      y: event.layerY,
    }
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
    if (newConnection !== null) {
      const { layerX, layerY } = event
      Object.entries(modules).some(([key, module]) => {
        if (!module.onMouseDown(layerX, layerY)) { return false }
        const input = module.getSelectedInput(event)
        if (input) {
          connections.push(new Connection(newConnection.start, input))
        }
      })
    }
  }
  Object.values(modules).forEach(module => {
    module.onMouseUp(event)
    module.unset()
  })


  mooved = false;
  activeControl = null
  activeModule = null
  newConnection = null
  rotaryCanvas.removeEventListener('mousemove', onMouseMove)
  rotaryCanvas.removeEventListener('mouseup', onMouseUp)
  requestAnimationFrame(draw)
}

function onMouseDown({layerX, layerY}: MouseEvent) {
  Object.entries(modules).some(([key, module]) => {
    if (!module.onMouseDown(layerX, layerY)) { return false }
    activeModule = key;
    if (module.activeOutput) {
      newConnection = {
        start: null,
        end: {
          position: {
            x: layerX,
            y: layerY,
          }
        }
      }
      activeOutput = module.activeOutput
      newConnection.start = module.activeOutput
    } else if (module) {

    }
  })
  rotaryCanvas.addEventListener('mousemove', onMouseMove)
  rotaryCanvas.addEventListener('mouseup', onMouseUp)
  requestAnimationFrame(draw)
}

rotaryCanvas.addEventListener('mousedown', onMouseDown);

function draw() {
  const gradient = ctx.createLinearGradient(0, 0, 1000, 600)
  gradient.addColorStop(0, '#404040')
  gradient.addColorStop(1, '#303030')
  ctx.fillStyle = gradient
  ctx.strokeStyle = '#000000'
  ctx.fillRect(0, 0, 1000, 600)
  ctx.strokeRect(0, 0, 1000, 600)

  Object.values(modules).forEach(module => module.draw())

  // connectionColor = 0
  connections.forEach(connection => connection.draw())
  // connectionColor += 60
  newConnection && drawConnection(ctx)
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
    SynthModuleRotary.rotaryCanvas = rotaryCtx
    Connection.canvas = ctx

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

start()

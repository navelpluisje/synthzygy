import { IModule } from '@interfaces/moduleInterface';
import { PositionType, ActiveOutputType, OutputType } from 'src/types';
import { Connection } from './components/connection';
import { SynthModuleRotary } from './components/moduleRotary';
import { Lfo, ILfo } from '@modules/lfo';
import { Oscillator, IOscillator } from '@modules/oscillator';
import {
  ActiveModuleType,
  InputType,
  ModuleCollectionType,
  // NewConnectionType,
  ModuleType,
  CollisionType,
  ActiveControlType
} from './types'

const canvas = <HTMLCanvasElement>document.getElementById('canvas')
const rotaryCanvas = <HTMLCanvasElement>document.getElementById('canvas-rotary')
const rackHeight = 267;

let connectionColor = 0
let mooved: boolean = false
let activeModule: string | null = null
let activeControl: ActiveControlType | null = null
let activeOutput: OutputType | null = null

let modules: {
  [key: string]: IOscillator | ILfo,
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

// const setConnection = (event: MouseEvent) => {
//   const xStart = activeOutput.xPos + 15
//   const yStart = activeOutput.yPos + 15
//   const xEnd = event.layerX
//   const yEnd = event.layerY
//   newConnection = {
//     xStart,
//     yStart,
//     xEnd,
//     yEnd,
//   };
//   requestAnimationFrame(draw)
// }

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
  ctx.arc(startX, startY, 8, 0, Math.PI * 2)
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(endX, endY, 8, 0, Math.PI * 2)
  ctx.stroke();

  // Create the actual cable
  ctx.lineCap = 'round'
  ctx.shadowBlur = 1
  ctx.shadowColor = 'black'
  ctx.strokeStyle = `hsla(${connectionColor}, 50%, 50%, 0.5)`
  ctx.lineWidth = 6
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

const blockInputs = (ctx: CanvasRenderingContext2D, block: ModuleType) => {
  const { inputs, dimensions: { height }, position: {x, y} } = block
  const size = 30
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6';
  inputs.forEach((name: string, index: number) => {
    const yStart = y + height - size * (inputs.length - index)
    ctx.beginPath()
    ctx.moveTo(x, yStart)
    ctx.lineTo(x + size, yStart);
    ctx.lineTo(x + size, yStart + size);
    ctx.stroke();
  })
}

// const detectInput = (x: number, y: number, endModule: ActiveModuleType) => {
//   const { inputs, dimensions: { height }, position } = modules[endModule.key]
//   let activeInput: InputType | null = null;
//   inputs.some((name, index) => {
//     const yPos = position.y + height - 30 * (inputs.length - index) // top-left
//     const xPos = position.x

//     if (xPos < x && x < (xPos + 30)) {
//       if (yPos < y && y < (yPos + 30)) {
//         activeInput = {
//           name,
//           index,
//           xPos,
//           yPos,
//         };
//         return true
//       }
//     }
//   });

//   return activeInput
// }


function onMouseMove(event: MouseEvent) {
  // TODO: Get the activeModule
  // If it's the module, move it around. => Redraw everything
  // If it's a control handle the control stuff
  // If it's an output, draw the connection
  modules[activeModule].onMouseMove(event)
  if (modules[activeModule].activeOutput) {
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
  if (newConnection !== null) {
    const { layerX, layerY } = event
    let connectedModule = null
    Object.entries(modules).some(([key, module]) => {
      if (!module.onMouseDown(layerX, layerY)) { return false }
      connectedModule = module;
      module.onMouseUp(event)
      if (module.activeInput) {
        connections.push(new Connection(newConnection.start, module.activeInput))
        newConnection = null
        console.log(connections)
        // activeInput = connectedModule.activeInput
      }
    })

    console.log(connections)
    modules[activeModule].onMouseUp(event)
    modules[activeModule].unset()
  }
  // if (!mooved) {
  //   // console.log('clicked')
  // } else {
  //   // console.log('mooved')
  // }


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

  // const lf = lfo.getNode()
  // const ocs = oscillator.getNode()
  // // lfo.outputSquare().connect(act.destination)
  // ocs.connectFM(lf.outputSine())
  // ocs.outputSine().connect(act.destination)
  // ocs.outputSquare().connect(act.destination)
}

rotaryCanvas.addEventListener('mousedown', onMouseDown);

let oscillator: IOscillator
let lfo: ILfo


function draw() {
  ctx.fillStyle = '#0f0326';
  ctx.strokeStyle = '#000000';
  ctx.fillRect(0, 0, 1000, 600);
  ctx.strokeRect(0, 0, 1000, 600);

  Object.values(modules).forEach(module => module.draw())

  // connectionColor = 0
  connections.forEach(connection => connection.draw())
  // connectionColor += 60
  newConnection && drawConnection(ctx)
}

let act: AudioContext;
if (canvas.getContext) {
  act = new AudioContext()
  ctx = canvas.getContext('2d')
  rotaryCtx = rotaryCanvas.getContext('2d')
  SynthModuleRotary.rotaryCanvas = rotaryCtx
  Connection.canvas = ctx

  modules.osc1 = new Oscillator(ctx, act, {x: 700, y: 200})
  modules.lfo1 = new Lfo(ctx, act, {x: 400, y: 200})

  modules.osc1.getNode().outputSaw().connect(act.destination)
}
draw()
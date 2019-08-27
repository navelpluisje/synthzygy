import oscilloscopeTemplate from "./template.html"
import oscilloscopeStyle from "./style.css"

export interface IOscilloscope extends HTMLElement {
  analyserNode: AnalyserNode
  context: AudioContext
  bufferLength: number
  dataArray: Uint8Array
  canvas: HTMLCanvasElement
  canvasCtx: CanvasRenderingContext2D
  getOscilloscopeNode(context: AudioContext): AnalyserNode
}

class Oscilloscope extends HTMLElement implements IOscilloscope {
  analyserNode: AnalyserNode
  context: AudioContext
  bufferLength: number
  dataArray: Uint8Array
  canvas: HTMLCanvasElement
  canvasCtx: CanvasRenderingContext2D

  static instantiated: boolean = false

  constructor() {
    super()
    const template = document.createElement('div')
    template.innerHTML = oscilloscopeTemplate
    const templateContent = <HTMLTemplateElement>template.firstChild
    const shadowRoot = this.attachShadow({ mode: 'open' })

    const styling = document.createElement('style')
    styling.innerHTML = oscilloscopeStyle

    shadowRoot.appendChild(templateContent.content.cloneNode(true))
    shadowRoot.appendChild(styling.cloneNode(true))
  }

  connectedCallback() {
    this.canvas = <HTMLCanvasElement>this.shadowRoot.getElementById("oscilloscope")
    this.canvasCtx = this.canvas.getContext("2d")
  }

  getOscilloscopeNode(context: AudioContext): AnalyserNode {
    this.context = context
    this.analyserNode = this.context.createAnalyser()
    this.analyserNode.fftSize = 4096
    this.bufferLength = this.analyserNode.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)

    this.draw()
    return this.analyserNode
  }

  draw() {
    if (!this.analyserNode) {return false}
    requestAnimationFrame(() => this.draw())
    this.analyserNode.getByteTimeDomainData(this.dataArray)
    this.canvasCtx.fillStyle = "hsl(210, 96%, 37%)"
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.canvasCtx.lineWidth = 2
    this.canvasCtx.strokeStyle = "hsl(209, 80%, 67%)"
    this.canvasCtx.beginPath()

    const sliceWidth = this.canvas.width * 1.0 / (this.bufferLength / 8)
    let x = 0
    for (let i = 0; i < (this.bufferLength); i += 8) {
      const v = this.dataArray[i] / 128.0
      const y = v * this.canvas.height / 2
      if (i === 0) {
        this.canvasCtx.moveTo(x, y)
      } else {
        this.canvasCtx.lineTo(x, y)
      }
      x += sliceWidth
    }

    this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2)
    this.canvasCtx.stroke()
  }
}

export default () => {
  if (Oscilloscope.instantiated) { return null }
  Oscilloscope.instantiated = true
  return customElements.define('synth-oscilloscope', Oscilloscope)
}

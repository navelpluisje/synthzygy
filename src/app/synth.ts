import { ConnectionList, Knob } from '@components/index';
import { Slider } from '@components/slider';
import { ModuleList } from '@modules/moduleList';
import { DimensionType, PatchData } from 'src/types';

export class Synth {
  public static canvasDimension: DimensionType = {
    height: 600,
    width: 1000,
  };
  private moduleCanvas: HTMLCanvasElement;
  private knobCanvas: HTMLCanvasElement;
  private connectionCanvas: HTMLCanvasElement;
  private modulesCtx: CanvasRenderingContext2D;
  private knobCtx: CanvasRenderingContext2D;
  private connectionCtx: CanvasRenderingContext2D;

  private synthArea: HTMLElement;
  private audioContext: AudioContext;

  private init: boolean = true;
  private mooved: boolean = false;
  private modules: ModuleList;
  private connections: ConnectionList = new ConnectionList();

  constructor() {
    this.moduleCanvas = (document.getElementById('canvas') as HTMLCanvasElement);
    this.knobCanvas = (document.getElementById('canvas-knob') as HTMLCanvasElement);
    this.connectionCanvas = (document.getElementById('canvas-connection') as HTMLCanvasElement);

    this.synthArea = document.querySelector('main');
    this.connectionCanvas.addEventListener('mousedown', this.onMouseDown);
    // Prevent the context menu to disturb our creativity
    this.connectionCanvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      return false;
    });
    this.setSize();
    window.addEventListener('resize', this.setSize);
  }

  public getPatchData(): PatchData {
    return {
      connections: this.connections.getConnectionsData(),
      modules: this.modules.getAllModulesData(),
    };
  }

  public loadPatch(patch: PatchData) {
    Object.values(patch.modules).forEach((module) => {
      this.modules.addModule(module.type, module);
    })
  }

  public onMouseDown = (event: MouseEvent) => {
    // Left mouse button used
    if (event.button === 0 && !event.ctrlKey) {
      if (this.modules.moduleSelected(event)) {
        const module = this.modules.getActiveModule();
        if (module && module.hasActiveOutput()) {
          this.connections.setNewConnection(module.getActiveOutput(), event);
        }
      }
    }
    // right button clicked
    if (event.button === 2 || (event.button === 0 && event.ctrlKey)) {
      this.connections.removeConnection(event);

      if (this.modules.moduleSelected(event)) {
        const module = this.modules.getActiveModule();
        if (!module.isDeleteAreaClicked()) { return; }
        this.connections.removeConnectionsByModule(module.getPosition(), module.getDimensions());
        this.modules.removeModule(module.getId());
      }
    }

    this.connectionCanvas.addEventListener('mousemove', this.onMouseMove);
    this.connectionCanvas.addEventListener('mouseup', this.onMouseUp);
  }

  public onMouseMove = (event: MouseEvent) => {
    // TODO: Need to make a nicer fix for this.
    // Neeeded 'cause Chrome will not start the audio
    if (this.init) {
      this.init = false;
      this.audioContext.resume();
    }
    this.mooved = true;
    const module = this.modules.getActiveModule();
    if (module) {
      if (module.hasActiveOutput()) {
        this.connections.updateConnection(event);
      } else if (module.hasActiveControl()) {
        module.onMouseMove(event);
      } else {
        this.modules.moveActiveModule(event);
        requestAnimationFrame(this.connections.draw);
      }
    }
  }

  public onMouseUp = (event: MouseEvent) => {
    const module = this.modules.getActiveModule();

    if (module && !this.mooved) {
      module.onMouseClick(event);
      requestAnimationFrame(this.connections.draw);
    } else if (module && this.mooved) {
      if (this.modules.moduleSelected(event) && this.connections.hasNewConnection()) {
        const endModule = this.modules.getActiveModule();
        const input = endModule.getSelectedInput(event);
        if (input) {
          this.connections.createConnection(input);
        }
      }
    }

    // Clean up all the rest
    this.connections.hasNewConnection() && this.connections.removeNewConnection();
    this.modules.onMouseUp(event);

    this.mooved = false;
    this.connectionCanvas.removeEventListener('mousemove', this.onMouseMove);
    this.connectionCanvas.removeEventListener('mouseup', this.onMouseUp);
    // requestAnimationFrame(draw)
  }

  public addModule = (category: string, name: string) => {
    // @ts-ignore
    this.modules.addModule(category, name);
  }

  public async start() {
    if (this.moduleCanvas.getContext) {
      this.audioContext = new AudioContext();
      await this.getWorklets();
      this.modulesCtx = this.moduleCanvas.getContext('2d');
      this.knobCtx = this.knobCanvas.getContext('2d');
      this.connectionCtx = this.connectionCanvas.getContext('2d');

      Knob.knobCanvas = this.knobCtx;
      Slider.knobCanvas = this.knobCtx;
      ConnectionList.canvas = this.connectionCtx;
      this.modules = new ModuleList(this.modulesCtx, this.audioContext);
    }
    this.modules.draw();
    this.connections.draw();
  }

  private getWorklets = async () => {
    await this.audioContext.audioWorklet.addModule('/app/processors.js');
  }

  private setSize = () => {
    const {width, height} = this.synthArea.getBoundingClientRect();
    Synth.canvasDimension = { width, height };
    this.moduleCanvas.setAttribute('width', width.toString());
    this.moduleCanvas.setAttribute('height', height.toString());
    this.knobCanvas.setAttribute('width', width.toString());
    this.knobCanvas.setAttribute('height', height.toString());
    this.connectionCanvas.setAttribute('width', width.toString());
    this.connectionCanvas.setAttribute('height', height.toString());

    this.modules && this.modules.draw();
    this.connections && this.connections.draw();
  }
}

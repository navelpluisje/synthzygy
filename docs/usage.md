# Usage

There are some basic usage things to take in account while using the SYnthZYGY modular

## Modules & Connections

* Modules can have multiple inputs and outputs. All the inputs are on the left side of the module and all the outputs
  are on the right side of the module.
* Connecting one module with another one can only by connecting the output to the input. The other way around does
  not work (yet)
* Connections can be removed by right-clicking the start or end of the connector
* Modules can be deleted by right-clicking the header area of a module. This will also remove it's connections

### Connection colors

Currently there are 4 different kind of connections. The type of the connection is determined by the end-point (input-side) of the connection:
* **Audio** (*Red*): used for audio signals
* **Gate** (Blue): for gate-signale
* **CV** (*Green*): for control purposes (can be an audio signal to a cv-input connector)
* **Data** (*Purple*): Weirdo connection used for transport control

## Usability thingies

* Collision detection needs to be improved. While dragging modules around and 'hitting' another module, can feel a bit
  clumsy.
* If there are no options to drag a module around another one, you can drag it through other modules. Visualy you will
  see nothing, 'till there is room to place the module

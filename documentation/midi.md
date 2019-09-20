# Midi

![Midi](./images/midi.png)

Midi connector to connect the modular to any midi device you want. All about midi can be found at [Midi.org](https://www.midi.org)

Links to midi data tables
* [Summary of midi messages](https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message)
* [Expanded messages](https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes)
* [All others](https://www.midi.org/specifications-old/category/reference-tables  )

## Control
* Midi channel: Select the prefered midi channel
  * 0: All channels
  * 1-16: Channel number
* Clock: Select the amount of clock ticks per trigger
  * 2 ** n > n = { 1, 5 }

## Outputs
| Label | Description | min | max |
| ----- | ----------- | --: | --: |
| **v/oct** | Note triggered | 0 | 8 |
| **pitch** | Pitch Bend | -2.5 | 2.5 |
| **mod** | Modulation wheel | 0 | 8 |
| **press** | Pressure / After touch | 0 | 8 |
| **gate** | Callback to trigger | | |
| **clock** | Trigger clock | | |
| **Transport** | Trigger transport controls | | |

## Button
* Settings: Open the settings window to select the midi device you want to use
![Midi](./images/midi-2.png)


### future/whishlist:
* start
* stop
* pause
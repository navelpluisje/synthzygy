# Turing Machine

![Turing Machine](../images/turing-machine.png)

This is a binary sequencer, based around a 16 bit memory circuit called a shift register. It’s designed as a sequencer that you can steer in one direction or another, not one that you can program precisely. It is a kind of reproduction of the Turing Machine by [Music Thing Modular](https://musicthing.co.uk/)

[Read more](https://musicthing.co.uk/pages/turing.html)

## Controls
* Probability: Set the probability of the Turing Machine
* Length: Set the length of the sequence

## Inputs
* Gate: The clock trigger

## Outputs
* Gate: same as the gate input
* CV output: The genereated note
* 2, 4, 6, 8, 2+4, 2+6: When these steps of the shiftregister are set to '1' they are triggered

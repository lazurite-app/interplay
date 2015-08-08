# interplay

Modular UI controls library designed for both debugging and
performance environments, with a focus on simplicity and providing multiple
interaction methods.

## Developing a new Input Node

### JavaScript API

#### `domElement = InputNode(node)`

Each Input Node is exposed as a function which takes a `node` object and
returns a DOM element to be attached to the interplay input list. Interfacing
with interplay is done through the `node` object that's passed through to you.

#### `node.input.manual = true|false`

Should be set to `true` if manual input is supported, e.g. buttons, sliders,
and any other directly manipulable UI elements.

``` javascript
module.exports = function (node) {
  node.input.manual = true
  // ...
}
```

#### `node.input.keyboard = true|false`

Should be set to `true` if keyboard input is supported, e.g. it can be triggered
using key presses without directly interacting with the node.

``` javascript
module.exports = function (node) {
  node.input.keyboard = true
  // ...
}
```

#### `node.input.midi = true|false`

Should be set to `true` if MIDI input is supported.

``` javascript
module.exports = function (node) {
  node.input.midi = true
  // ...
}
```

### `node.value`

Change `node.value` to set the node's output value.

### `node.on('change', changed)`

Calls the `changed` function whenever the Node's value is changed.

### `node.on('init', init)`

Calls the `init` function when the Node is added to interplay. Should be used to set up event listeners, load assets, etc.

Note that `init` may be fired more than once if the node is added/removed multiple times.

### `node.on('stop', stop)`

Calls the `stop` function when the Node is removed from interplay. Should be used to clean up any allocated resources created when firing the `init` function.

Note that `stop` may be fired more than once if the node is added/removed multiple times.

### Required CSS Classes

#### `.interplay-manual`

Should wrap the manual input mode of the Input Node.

#### `.interplay-keyboard`

Should wrap the keyboard input mode of the Input Node.

#### `.interplay-midi`

Should wrap the MIDI input mode of the Input Node.

const inherits = require('inherits')
const Emitter = require('events/')
const css = require('defaultcss')
const path = require('path')
const fs = require('fs')

module.exports = Interplay

css('interplay', fs.readFileSync(
  path.join(__dirname, 'index.css')
, 'utf8'))

function Interplay () {
  if (!(this instanceof Interplay)) {
    return new Interplay()
  }

  this.nodes = {}
  this.data = {}

  this.el = document.createElement('div')
  this.el.classList.add('interplay-root')
}

Interplay.prototype.attach = function () {
  document.body.appendChild(this.el)
  return this
}

Interplay.prototype.add = function (key, Base, options) {
  options = options || {}

  const node = new InterplayNode(options.label || key)
  const el = Base(node, options)

  this.nodes[key] = node
  this.el.appendChild(el)
  node.emit('init')

  return node
}

inherits(InterplayNode, Emitter)
function InterplayNode (label) {
  Emitter.call(this)

  this._value = null
  this.label = label
  this.input = {
    keyboard: false,
    manual: false,
    midi: false
  }
}

Object.defineProperty(InterplayNode.prototype, 'value', {
  get: function() {
    return this._value
  },
  set: function(next) {
    const prev = this._value
    if (next === prev) return
    this.emit('change', next, prev)
    this._value = next
  }
})

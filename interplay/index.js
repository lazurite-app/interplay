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

  this._enabled = true
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

  const node = new InterplayNode(options.label || key, this.enabled)
  const el = Base(node, options)

  this.nodes[key] = node
  this.el.appendChild(el)
  node.emit('init')

  return node
}

Object.defineProperty(Interplay.prototype, 'enabled', {
  get: function () {
    return this._enabled
  },
  set: function (next) {
    const nodes = this.nodes

    this._enabled = next = !!next

    Object.keys(nodes).forEach(function (key) {
      nodes[key].enabled = next
    })
  }
})

inherits(InterplayNode, Emitter)
function InterplayNode (label, enabled) {
  Emitter.call(this)

  this._enabled = enabled
  this._value = null
  this.label = label
  this.input = {
    keyboard: false,
    manual: false,
    midi: false
  }
}

Object.defineProperty(InterplayNode.prototype, 'value', {
  get: function () {
    return this._value
  },
  set: function (next) {
    const prev = this._value
    if (next === prev) return
    this._value = next
    this.emit('change', next, prev)
  }
})

Object.defineProperty(InterplayNode.prototype, 'enabled', {
  get: function () {
    return this._enabled
  },
  set: function (next) {
    const prev = this._enabled
    if (prev === next) return
    this._enabled = !!next
    this.emit(next ? 'enable' : 'disable')
  }
})

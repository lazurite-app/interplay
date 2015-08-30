const remove = require('remove-element')
const inherits = require('inherits')
const Emitter = require('events/')
const css = require('defaultcss')
const path = require('path')
const fs = require('fs')

module.exports = Interplay

css('interplay', fs.readFileSync(
  path.join(__dirname, 'index.css')
, 'utf8'))

inherits(Interplay, Emitter)
function Interplay () {
  if (!(this instanceof Interplay)) {
    return new Interplay()
  }

  Emitter.call(this)

  this._enabled = true
  this.changers = {}
  this.values = {}
  this.nodes = {}
  this.elems = {}
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

  const self = this
  const node = new InterplayNode(options.label || key, this.enabled)
  const el = Base(node, options)

  this.nodes[key] = node
  this.elems[key] = el
  this.el.appendChild(el)
  node.emit('init')
  node.on('change', this.changers[key] = change)

  Object.defineProperty(this.values, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return node.value
    },
    set: function (value) {
      node.value = value
    }
  })

  function change (next, prev) {
    self.emit('change', key, next, prev)
  }

  return node
}

Interplay.prototype.remove = function (key) {
  const changer = this.changers[key]
  const node = this.nodes[key]
  const elem = this.elems[key]

  node.removeListener('change', changer)
  node.emit('stop')
  remove(elem)

  delete this.nodes[key]
  delete this.elems[key]
  delete this.values[key]
  delete this.changers[key]

  return node
}

Interplay.prototype.clear = function () {
  const self = this

  Object.keys(self.nodes).forEach(function (key) {
    self.remove(key)
  })
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

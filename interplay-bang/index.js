const escape = require('escape-html')
const css = require('defaultcss')
const domify = require('domify')
const slice = require('sliced')
const path = require('path')
const vkey = require('vkey')
const fs = require('fs')

module.exports = InterplayBang

css('interplay-bang', fs.readFileSync(
  path.join(__dirname, 'index.css')
, 'utf8'))

const html = fs.readFileSync(
  path.join(__dirname, 'index.html')
, 'utf8')

function InterplayBang (node, options) {
  options = options || {}

  var rest = !!options.value
  const el = domify(html)
  const toggle = el.querySelector('.interplay-bang-toggle')
  const button = el.querySelector('.interplay-bang-button')

  node.value = rest

  //
  // Setup DOM labels for key bindings
  //
  const labels = slice(el.querySelectorAll('label'))

  labels.forEach(function (label) {
    label.innerHTML = escape(node.label)
  })

  options.keys = options.keys || {}

  if (options.keys.toggle) {
    if (options.keys.toggle.length !== 1) {
      throw new Error('Keys must be one character long')
    }

    el.querySelector('.interplay-bang-toggle-key')
      .innerHTML = escape(options.keys.toggle)
  }
  if (options.keys.button) {
    if (options.keys.button.length !== 1) {
      throw new Error('Keys must be one character long')
    }

    el.querySelector('.interplay-bang-button-key')
      .innerHTML = escape(options.keys.button)
  }

  //
  // Enable/disable button classes
  //
  node.on('enable', function () {
    el.classList.remove('interplay-bang-disabled')
  }).on('disable', function () {
    el.classList.add('interplay-bang-disabled')
  })

  if (!node.enabled) {
    el.classList.add('interplay-bang-disabled')
  }

  //
  // Handling state changes and interaction
  //
  node.on('change', function (next, prev) {
    updateClasses(next)
  }).on('init', function () {
    if (options.keys.toggle || options.keys.button) {
      window.addEventListener('keydown', keydown, false)
      window.addEventListener('keyup', keyup, false)
    }

    toggle.addEventListener('mouseup', toggleup, false)
    button.addEventListener('mousedown', buttondown, false)
    window.addEventListener('mouseup', buttonup, false)
  }).on('stop', function () {
    if (options.keys.toggle || options.keys.button) {
      window.addEventListener('keydown', keydown, false)
      window.addEventListener('keyup', keyup, false)
    }

    toggle.removeEventListener('mouseup', toggleup, false)
    button.removeEventListener('mousedown', buttondown, false)
    window.removeEventListener('mouseup', buttonup, false)
  })

  function buttondown () {
    if (!node.enabled) return
    el.classList.add('interplay-bang-active')
    node.value = !rest
  }
  function buttonup () {
    if (!node.enabled) return
    el.classList.remove('interplay-bang-active')
    node.value = rest
  }

  function keydown (e) {
    if (!node.enabled) return
    const key = vkey[e.keyCode]
    if (key === options.keys.button) {
      buttondown()
    }
    if (key === options.keys.toggle) {
      toggleup()
    }
  }

  function keyup (e) {
    if (!node.enabled) return
    const key = vkey[e.keyCode]
    if (key === options.keys.button) {
      buttonup()
    }
  }

  function toggleup () {
    if (!node.enabled) return
    node.value = rest = !rest
  }

  updateClasses(node.value)
  function updateClasses (value) {
    if (rest) {
      el.classList.add('interplay-bang-rest')
    } else {
      el.classList.remove('interplay-bang-rest')
    }

    if (value) {
      el.classList.add('interplay-bang-yay')
      el.classList.remove('interplay-bang-nay')
    } else {
      el.classList.add('interplay-bang-nay')
      el.classList.remove('interplay-bang-yay')
    }
  }

  return el
}

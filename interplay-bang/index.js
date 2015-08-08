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
  const el = domify(html)
  const rest = !!options.value


  node.input.manual = true
  node.input.keyboard = true
  node.value = rest

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

  node.on('change', function (next, prev) {
    console.log('!!!', next)
    updateClasses(next)
  }).on('init', function () {
    if (options.keys.toggle || options.keys.button) {
      window.addEventListener('keydown', keydown, false)
      window.addEventListener('keyup', keyup, false)
    }

    el.addEventListener('mousedown', mousedown, false)
    window.addEventListener('mouseup', mouseup, false)
  }).on('stop', function () {
    if (options.keys.toggle || options.keys.button) {
      window.addEventListener('keydown', keydown, false)
      window.addEventListener('keyup', keyup, false)
    }

    el.removeEventListener('mousedown', mousedown, false)
    window.removeEventListener('mouseup', mouseup, false)
  })

  function mousedown () {
    node.value = !rest
  }
  function mouseup () {
    node.value = rest
  }

  function keydown (e) {
    const key = vkey[e.keyCode]
    if (key === options.keys.button) {
      mousedown()
    }
  }
  function keyup (e) {
    const key = vkey[e.keyCode]
    if (key === options.keys.button) {
      mouseup()
    }
  }

  updateClasses(node.value)
  function updateClasses (value) {
    if (value) {
      if (!el.classList.contains('interplay-bang-yay')) {
        el.classList.add('interplay-bang-yay')
      }
      while (el.classList.contains('interplay-bang-nay')) {
        el.classList.remove('interplay-bang-nay')
      }
    } else {
      if (!el.classList.contains('interplay-bang-nay')) {
        el.classList.add('interplay-bang-nay')
      }
      while (el.classList.contains('interplay-bang-yay')) {
        el.classList.remove('interplay-bang-yay')
      }
    }
  }

  return el
}

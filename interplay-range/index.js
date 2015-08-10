const escape = require('escape-html')
const clamp = require('clamp')
const domify = require('domify')
const css = require('defaultcss')
const path = require('path')
const vkey = require('vkey')
const fs = require('fs')

const html = fs.readFileSync(
  path.join(__dirname, 'index.html')
, 'utf8')

css('interplay-range', fs.readFileSync(
  path.join(__dirname, 'index.css')
, 'utf8'))

module.exports = InterplayRange

function InterplayRange (node, options) {
  options = options || {}
  options.keys = options.keys || {}

  const el = domify(html)
  const innerLabel = el.querySelector('.interplay-range-slider-inner > label')
  const outerLabel = el.querySelector('.interplay-range-slider > label')
  const valueLabel = el.querySelector('.interplay-range-slider span')
  const innerSlide = el.querySelector('.interplay-range-slider-inner')
  const outerSlide = el.querySelector('.interplay-range-slider')
  const nudge = [
    el.querySelector('.interplay-range-nudge-left'),
    el.querySelector('.interplay-range-nudge-right')
  ]

  node.value = 'value' in options ? options.value : 0
  innerLabel.innerHTML =
  outerLabel.innerHTML = escape(options.label)

  const nudgeLabels = nudge.map(function (nudge) {
    return nudge.querySelector('label')
  })

  nudgeLabels[0].innerHTML = options.keys.down || '&#9664;'
  nudgeLabels[1].innerHTML = options.keys.up || '&#9654;'

  if (!node.enabled) {
    el.classList.add('interplay-range-disabled')
  }

  node.on('enable', function () {
    el.classList.remove('interplay-range-disabled')
  }).on('disable', function () {
    el.classList.add('interplay-range-disabled')
  })

  node.on('change', function (next, prev) {
    updateSlider(next)
  }).on('init', function () {
    outerSlide.addEventListener('mousedown', mousedown, false)
    nudge[0].addEventListener('mousedown', nudgedown[0], false)
    nudge[1].addEventListener('mousedown', nudgedown[1], false)
    window.addEventListener('mouseup', nudgeup[0], false)
    window.addEventListener('mouseup', nudgeup[1], false)
    window.addEventListener('mousemove', mousemove, false)
    window.addEventListener('mouseup', mouseup, false)
    window.addEventListener('keydown', keydown, false)
    window.addEventListener('keyup', keyup, false)
  }).on('stop', function () {
    outerSlide.removeEventListener('mousedown', mousedown, false)
    nudge[0].removeEventListener('mousedown', nudgedown[0], false)
    nudge[1].removeEventListener('mousedown', nudgedown[1], false)
    window.removeEventListener('mouseup', nudgeup[0], false)
    window.removeEventListener('mouseup', nudgeup[1], false)
    window.removeEventListener('mousemove', mousemove, false)
    window.removeEventListener('mouseup', mouseup, false)
    window.removeEventListener('keydown', keydown, false)
    window.removeEventListener('keyup', keyup, false)
  })

  var dragging = false
  function mousedown (e) {
    if (!node.enabled) return
    dragging = true
    el.classList.add('interplay-range-dragging')
  }

  function mouseup (e) {
    dragging = false
    el.classList.remove('interplay-range-dragging')
  }

  function keydown (e) {
    const key = vkey[e.keyCode]
    if (key === options.keys.down) {
      nudgedown[0]()
    }
    if (key === options.keys.up) {
      nudgedown[1]()
    }
  }

  function keyup (e) {
    const key = vkey[e.keyCode]
    if (key === options.keys.down) {
      nudgeup[0]()
    }
    if (key === options.keys.up) {
      nudgeup[1]()
    }
  }

  function mousemove (e) {
    if (!dragging) return

    const bounds = outerSlide.getBoundingClientRect()
    var value = (e.clientX - bounds.left) / bounds.width

    value = options.min + (options.max - options.min) * value
    value = clamp(value, options.min, options.max)
    node.value = options.step
      ? Math.round(value / options.step) * options.step
      : value
  }

  const nudgedown = [-1, +1].map(function (direction, i) {
    return function (e) {
      if (!node.enabled) return
      var value = node.value

      value += direction * (options.nudge || 0.1)
      value = clamp(value, options.min, options.max)
      node.value = value

      nudge[i].classList.add('interplay-range-nudge-active')
    }
  })

  const nudgeup = [-1, +1].map(function (direction, i) {
    return function (e) {
      nudge[i].classList.remove('interplay-range-nudge-active')
    }
  })

  updateSlider(node.value)
  function updateSlider (value) {
    const progress = (value - options.min) / (options.max - options.min)
    innerSlide.style.width = (progress * 100) + '%'
    valueLabel.innerHTML = value
  }

  return el
}

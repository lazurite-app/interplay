const escape = require('escape-html')
const clamp = require('clamp')
const domify = require('domify')
const css = require('defaultcss')
const path = require('path')
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
  const innerSlide = el.querySelector('.interplay-range-slider-inner')
  const outerSlide = el.querySelector('.interplay-range-slider')
  const nudge = [
    el.querySelector('.interplay-range-nudge-left'),
    el.querySelector('.interplay-range-nudge-right')
  ]

  innerLabel.innerHTML =
  outerLabel.innerHTML = escape(options.label)

  const nudgeLabels = nudge.map(function (nudge) {
    return nudge.querySelector('label')
  })

  nudgeLabels[0].innerHTML = options.keys.down || '&#9664;'
  nudgeLabels[1].innerHTML = options.keys.up || '&#9654;'

  node.on('change', function (next, prev) {
    const progress = (next - options.min) / (options.max - options.min)
    innerSlide.style.width = (progress * 100) + '%'
  }).on('init', function () {
    outerSlide.addEventListener('mousedown', mousedown, false)
    window.addEventListener('mousemove', mousemove, false)
    window.addEventListener('mouseup', mouseup, false)
  }).on('stop', function () {
    outerSlide.removeEventListener('mousedown', mousedown, false)
    window.removeEventListener('mousemove', mousemove, false)
    window.removeEventListener('mouseup', mouseup, false)
  })

  var dragging = false
  function mousedown (e) {
    dragging = true
    el.classList.add('interplay-range-dragging')
  }

  function mouseup (e) {
    dragging = false
    el.classList.remove('interplay-range-dragging')
  }

  function mousemove (e) {
    if (!dragging) return

    const bounds = outerSlide.getBoundingClientRect()
    const progress = clamp((e.clientX - bounds.left) / bounds.width, 0, 1)

    node.value = options.min + (options.max - options.min) * progress
  }

  return el
}

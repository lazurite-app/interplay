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

  this.nodes = []

  this.el = document.createElement('div')
  this.el.classList.add('interplay-root')
}

const domify = require('domify')
const path = require('path')
const fs = require('fs')

module.exports = InterplayBang

const html = fs.readFileSync(
  path.join(__dirname, 'index.html')
, 'utf8')

function InterplayBang (node) {
  const el = domify(html)

  node.input.manual = true
  node.input.keyboard = true

  node.on('change', function (next, prev) {
    console.log('was:', prev)
    console.log('now:', next)
  }).on('init', function () {
    node.addEventListener('mousemove', mousemove, false)
  }).on('stop', function () {
    node.removeEventListener('mousemove', mousemove, false)
  })

  function mousemove () {
    console.log('mouse moving')
  }

  return el
}

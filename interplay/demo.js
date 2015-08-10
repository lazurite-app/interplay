const IP = require('./')
const Bang = require('interplay-bang')
const Range = require('interplay-range')

const gui = IP().attach()

gui.add('bang1', Bang, { label: 'Test Bang #1', keys: { toggle: 'K', button: 'J' } })
gui.add('bang2', Bang, { label: 'Test Bang #2', keys: { toggle: 'H', button: 'G' } })
gui.add('bang3', Bang, { label: 'Test Bang #3' })

gui.add('range1', Range, {
  label: 'Test Range #1',
  value: 0,
  nudge: 1,
  step: 1,
  min: -10,
  max: +10,
  keys: {
    up: 'Q',
    down: 'A'
  }
})

gui.add('bang4', Bang, { label: 'Test Bang #4' })
gui.add('bang5', Bang, { label: 'Test Bang #5' })

const IP = require('./')
const Bang = require('interplay-bang')

const gui = IP().attach()

gui.add('test1', Bang, { value: true, label: 'Test Variable #1', keys: { toggle: 'J', button: 'K' } })
gui.add('test2', Bang, { value: false, label: 'Test Variable #2' })
gui.add('test3', Bang, { value: false, label: 'Test Variable #3' })
gui.add('test4', Bang, { value: true, label: 'Test Variable #4' })
gui.add('test5', Bang, { value: false, label: 'Test Variable #5' })

gui.data.test1

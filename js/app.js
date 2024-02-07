import './modules/button.js'
import { consoleGraphic } from './modules/console-log.js'
import './modules/dusk.js'

const inspector = new DomInspector({
  root: 'body',
  exclude: ['body', '.inspect-ignore'],
  theme: 'inspector'
})

inspector.enable()

document.querySelector('#inspect').addEventListener('change', () => {
  if (!document.querySelector('#inspect').checked) {
    inspector.disable()
  } else {
    inspector.enable()
  }
})

consoleGraphic()

import { consoleGraphic } from './modules/console-log.js'
import './modules/dusk.js'

const inspector = new DomInspector({
  root: 'body',
  exclude: ['body', '.inspect-ignore'],
  theme: 'inspector'
})

inspector.enable()

const inspectorSwitch = document.querySelector('#inspect')

inspectorSwitch.addEventListener('change', () => {
  if (!inspectorSwitch.checked) {
    inspector.disable()
  } else {
    inspector.enable()
  }
})

consoleGraphic()

import { consoleGraphic } from './modules/console-log.js'
import './modules/dusk.js'
const mediaQuery = window.matchMedia('(max-width: 480px)')

const inspector = new DomInspector({
  root: 'body',
  exclude: ['body', '.inspect-ignore']
})

inspector.enable()

const inspectorSwitch = document.querySelector('#inspect')

inspectorSwitch.addEventListener('change', !inspectorSwitch.checked ? inspector.disable() : inspector.enable())

if (mediaQuery.matches) {
  inspectorSwitch.checked = false
  inspector.disable()
}

consoleGraphic()

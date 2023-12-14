const el = document.querySelector('body')
const button = document.querySelector('#dusk')
const duskClass = ['bg-near-black', 'moon-gray']
const localVar = 'duskMode'
// const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

const duskModeToggle = () => {
  window.localStorage.setItem(localVar, button.checked)
  duskClass.map(v => el.classList.toggle(v, button.checked))
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.localStorage.getItem(localVar) === 'true') {
    duskClass.map(v => el.classList.add(v))
    button.checked = true
  }
})

if (button) {
  button.addEventListener('change', duskModeToggle)
}

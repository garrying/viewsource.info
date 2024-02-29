const el = document.querySelector('body')
const button = document.querySelector('#dusk')
const duskClass = ['bg-background-dusk']
const localVar = 'duskMode'

const starField = (apply) => {
  if (apply === true) {
    const container = document.getElementById('title-content')

    for (let i = 0; i < 20; i++) {
      const randomLeft = Math.floor(Math.random() * 95)
      const randomTop = Math.floor(Math.random() * 95)

      const newDiv = document.createElement('div')
      newDiv.className = 'star bg-white br-100'
      newDiv.style.left = randomLeft + '%'
      newDiv.style.top = randomTop + '%'

      container.appendChild(newDiv)
    }
  } else {
    const stars = document.querySelectorAll('.star')

    stars.forEach(function (star) {
      star.parentNode.removeChild(star)
    })
  }
}

const duskModeToggle = () => {
  window.localStorage.setItem(localVar, button.checked)
  duskClass.map(v => el.classList.toggle(v, button.checked))
  starField(button.checked)
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.localStorage.getItem(localVar) === 'true') {
    starField(true)
    duskClass.map(v => el.classList.add(v))
    button.checked = true
  }
})

if (button) {
  button.addEventListener('change', duskModeToggle)
}

document.querySelector('#title-image').addEventListener('click', () => {
  if (button.checked !== true) {
    button.checked = true
    duskModeToggle()
  } else {
    button.checked = false
    duskModeToggle()
  }
})

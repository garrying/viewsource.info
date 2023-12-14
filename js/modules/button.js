const button = document.querySelector('#button')
const paragraph = document.querySelector('.button-text')

const updateButton = () => {
  if (button.value === 'Start machine') {
    button.value = 'Stop machine'
    paragraph.textContent = 'The machine has started!'
  } else {
    button.value = 'Start machine'
    paragraph.textContent = 'The machine is stopped.'
  }
}

if (button) {
  button.addEventListener('click', updateButton)
}

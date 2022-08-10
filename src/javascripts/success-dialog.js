import { doubleRaf } from './utils'

const dialog = document.getElementById('success-dialog')
let timeout = null

const show = () => {
  if (!dialog) return
  if (timeout) clearTimeout(timeout)
  dialog.style.display = 'block'
  doubleRaf(() => {
    dialog.classList.add('show')
  })
}

const hide = () => {
  if (!dialog) return
  if (timeout) clearTimeout(timeout)
  dialog.classList.remove('show')
  timeout = setTimeout(() => {
    dialog.style.display = 'none'
  }, 400)
}

if (dialog) {
  const overlay = dialog.querySelector('.dialog__overlay')
  const close = dialog.querySelector('.dialog__close')
  close.addEventListener('click', hide)
  overlay.addEventListener('click', hide)
}

export default {
  show,
  hide,
}

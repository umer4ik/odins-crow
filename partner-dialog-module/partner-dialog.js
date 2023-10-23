;(() => {
  const getDialog = () => document.getElementById('partner-dialog')
  const doubleRaf = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn))
  let timeout = null
  const hide = () => {
    const dialog = getDialog()
    if (!dialog) return
    if (timeout) clearTimeout(timeout)
    dialog.classList.remove('show')
    timeout = setTimeout(() => {
      dialog.style.display = 'none'
    }, 400)
  }
  const show = ({
    variant,
    img,
    name,
    content,
  }) => {
    const dialog = getDialog()
    if (!dialog) return
    const scrollContainer = dialog.querySelector('.dialog__partner-description')
    const contentEl = dialog.querySelector('.dialog__partner-lines-bg')
    const nameEl = dialog.querySelector('.dialog__partner-name')
    const imgEl = dialog.querySelector('.dialog__partner-face img')
    if (timeout) clearTimeout(timeout)
    dialog.style.display = 'block'
    dialog.classList.remove('dialog--variant-1')
    dialog.classList.remove('dialog--variant-2')
    dialog.classList.add(`dialog--variant-${variant}`)
    contentEl.innerHTML = content
    nameEl.textContent = name
    imgEl.src = img
    doubleRaf(() => {
      scrollContainer.scrollTop = 0
      dialog.classList.add('show')
    })
  }

  const addListeners = () => {
    const dialog = getDialog()
    if (!dialog) return
    const overlay = dialog.querySelector('.dialog__overlay')
    const close = dialog.querySelector('.dialog__close')
    close.addEventListener('click', hide)
    overlay.addEventListener('click', hide)
  }
  addListeners()
  window.showPartnerDialog = show
}
)();

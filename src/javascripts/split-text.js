const createSpan = (text, className) => {
  const span = document.createElement('span')
  span.className = className
  if (text === ' ') {
    span.innerHTML = '&nbsp;'
    span.className = `${className} space`
  } else {
    span.textContent = text
  }
  return span
}

const splitText = ({
  elements,
  className = 'split-text',
  visibleCharClassName = 'split-text__visible',
  invisibleCharClassName = 'split-text__invisible',
  charContainerClassName = 'split-text__char-container',
}) => {
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i]
    const text = element.textContent
    element.classList.add(className)
    const chars = text.split('')
    const spans = chars.map((char) => {
      const visible = createSpan(char, visibleCharClassName)
      const invisible = createSpan(char, invisibleCharClassName)
      const charContainer = createSpan('', charContainerClassName)
      charContainer.appendChild(visible)
      charContainer.appendChild(invisible)
      return charContainer
    }).reduce((acc, container) => {
      acc.appendChild(container)
      return acc
    }, document.createDocumentFragment())
    // eslint-disable-next-line no-param-reassign
    element.textContent = ''
    element.appendChild(spans)
  }
}

export default splitText

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const easing = 'cubicBezier(0.547, 0, 0.158, 1)'

export const all = (promises) => () => Promise.all(promises.map((x) => x()))

export const loadImages = () => new Promise((resolve) => {
  const images = document.querySelectorAll('img')
  let loaded = 0
  const checkDone = () => {
    if (loaded === images.length) {
      resolve()
    }
  }
  images.forEach((img) => {
    if (img.complete) {
      loaded += 1
      checkDone()
    } else {
      img.addEventListener('load', () => {
        loaded += 1
        checkDone()
      })
    }
  })
})

export const doubleRaf = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn))

export default {
  delay,
  easing,
  loadImages,
  all,
  doubleRaf,
}

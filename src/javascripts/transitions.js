import anime from 'animejs'
import { easing } from './utils'

export const showCurtain = () => new Promise((resolve) => {
  anime({
    targets: '.curtain',
    translateY: ['100%', 0],
    easing,
    duration: 1000,
    complete: resolve,
  })
  anime({
    targets: '.main-container',
    translateY: [0, '-300px'],
    easing,
    delay: 0,
    duration: 1000,
  })
})

export const hideCurtain = () => new Promise((resolve) => {
  anime({
    targets: '.curtain',
    translateY: [0, '-100%'],
    easing,
    duration: 600,
    complete: resolve,
  })
  document.querySelector('.main-container').style.transform = 'translateY(0)'
})

export default {
  showCurtain,
  hideCurtain,
}

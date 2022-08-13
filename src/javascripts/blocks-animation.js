import anime from 'animejs'
import { delay, easing } from './utils'

const lettersOptions = {
  translateY: ['100%', 0],
  easing,
}

export const animateIntroTitle = ({
  stagger = 100,
} = {}) => new Promise((resolve) => {
  anime({
    targets: '.intro-wrapper .intro__title .split-text__visible:not(.space)',
    duration: 800,
    complete: resolve,
    delay: anime.stagger(stagger),
    ...lettersOptions,
  })
})

export const animateIntroNumbers = () => new Promise((resolve) => {
  // Loading... animation
  anime({
    targets: '.counters__loading .split-text__visible:not(.space)',
    delay: anime.stagger(50),
    ...lettersOptions,
  })

  // draw lines
  anime({
    targets: '.intro--top .lines__line',
    duration: 2000,
    easing,
    delay: anime.stagger(75),
    scaleX: [0, 1],
  })

  // loading dots
  const loadingDots = anime({
    targets: [1, 2, 3].map((x) => `.counters__loading .split-text__char-container:nth-last-child(${x})`).join(', '),
    loop: true,
    delay: anime.stagger(50),
    easing,
    duration: 800,
    opacity: ['1', '.7', '1'],
  })

  delay(500).then(() => {
    anime({
      targets: '.counters__counter .split-text__visible',
      duration: 1000,
      delay: anime.stagger(100),
      translateY: ['100%', 0],
      easing,
      complete: () => {
        delay(400).then(() => {
          loadingDots.pause()
          resolve()
        })
      },
    })
  })

  anime({
    targets: '.preloader-text .split-text__visible:not(.space)',
    delay: anime.stagger(25),
    duration: 400,
    ...lettersOptions,
  })
})

export const animateIntroDescription = () => new Promise((resolve) => {
  anime({
    targets: '.intro__description',
    scaleY: [0, 1],
    duration: 600,
    easing,
    complete: resolve,
  })
})

export const animatePoster = () => new Promise((resolve) => {
  anime({
    targets: '.poster',
    translateY: ['20vh', 0],
    opacity: [0, 1],
    duration: 800,
    easing,
    complete: resolve,
  })
})

export const animateLinesCollapse = ({
  duration = 400,
  delayCoeff = 75,
} = {}) => new Promise((resolve) => {
  const offsets = [19, 34, 48, 58, 70, 80]
  let i = 2
  while (i <= 7) {
    anime({
      targets: `.intro--top .lines__line--${i}`,
      duration,
      easing,
      delay: delayCoeff * (i - 2),
      complete: i === 7 ? resolve : undefined,
      translateY: ['0', `calc(-${5.7 * (i - 1)}vh + ${offsets[i - 2]}px)`],
    })
    i += 1
  }
})

export const animateCollapse = () => new Promise((resolve) => {
  anime({
    targets: '.counters__line .split-text__visible:not(.space)',
    duration: 400,
    // delay: anime.stagger(25),
    easing,
    translateY: [0, '-100%'],
  })
  delay(200).then(animateLinesCollapse)
  delay(700).then(resolve)
})

export default {}

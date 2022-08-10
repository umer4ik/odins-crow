import anime from 'animejs'
import $ from 'jquery'
import {
  all,
  delay,
  easing,
  loadImages,
} from './utils'

const lettersOptions = {
  translateY: ['100%', 0],
  easing,
}

const animateIntroTitle = () => {
  anime({
    targets: '.intro-wrapper .intro__title .split-text__visible:not(.space)',
    duration: 800,
    delay: anime.stagger(100),
    ...lettersOptions,
  })
}

const animateIntroNumbers = () => new Promise((resolve) => {
  // Loading... animation
  anime({
    targets: '.counters__loading .split-text__visible:not(.space)',
    delay: anime.stagger(50),
    ...lettersOptions,
  })

  // draw lines
  const linesTl = anime.timeline({
    duration: 1000,
    delay: anime.stagger(75),
    easing,
  })

  const lines = document.querySelectorAll('.intro--top .lines__line')
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    linesTl.add({
      targets: line,
      scaleX: [0, 1],
    }, i === 0 ? '+=250' : '-=800')
  }

  // loading dots
  const loadingDots = anime({
    targets: [1, 2, 3].map((x) => `.counters__loading .split-text__char-container:nth-last-child(${x})`).join(', '),
    loop: true,
    delay: anime.stagger(50),
    easing,
    duration: 800,
    opacity: ['1', '.7', '1'],
  })

  // counters animation 1.1, 1.2, ...
  const countersTl = anime.timeline({
    duration: 400,
    delay: anime.stagger(75),
    complete: () => {
      delay(400).then(() => {
        loadingDots.pause()
        resolve()
      })
    },
    ...lettersOptions,
  })
  const counters = document.querySelectorAll('.counters__counter')
  for (let i = 0; i < counters.length; i += 1) {
    const counter = counters[i]
    countersTl.add({
      targets: counter.querySelectorAll('.split-text__visible:not(.space)'),
      translateY: ['100%', 0],
    }, i === 0 ? '+=450' : '-=200') // first animation waits for 100ms; other animations start earlier for 250ms
  }

  anime({
    targets: '.preloader-text .split-text__visible:not(.space)',
    delay: anime.stagger(25),
    duration: 400,
    ...lettersOptions,
  })
})

const animateLinesCollapse = () => new Promise((resolve) => {
  anime({
    targets: '.counters__line .split-text__visible:not(.space)',
    duration: 400,
    // delay: anime.stagger(25),
    easing,
    translateY: [0, '-100%'],
  })
  delay(200).then(() => {
  // 1 line
    anime({
      targets: '.intro--top .lines__line--2',
      duration: 400,
      easing,
      translateY: ['0', 'calc(-5.7vh + 19px)'],
    })

    // 2 line
    anime({
      targets: '.intro--top .lines__line--3',
      duration: 400,
      delay: 75,
      easing,
      translateY: ['0', `calc(-${5.7 * 2}vh + 34px)`],
    })

    // 3 line
    anime({
      targets: '.intro--top .lines__line--4',
      duration: 400,
      delay: 150,
      easing,
      translateY: ['0', `calc(-${5.7 * 3}vh + 48px)`],
    })

    // 4 line
    anime({
      targets: '.intro--top .lines__line--5',
      duration: 400,
      delay: 225,
      easing,
      translateY: ['0', `calc(-${5.7 * 4}vh + 58px)`],
    })

    // 5 line
    anime({
      targets: '.intro--top .lines__line--6',
      duration: 400,
      delay: 300,
      easing,
      translateY: ['0', `calc(-${5.7 * 5}vh + 70px)`],
    })

    // 6 line
    anime({
      targets: '.intro--top .lines__line--7',
      duration: 400,
      delay: 375,
      easing,
      translateY: ['0', `calc(-${5.7 * 6}vh + 80px)`],
    })
  })
  delay(700).then(resolve)
})

const animateIntroDescription = () => new Promise((resolve) => {
  anime({
    targets: '.intro__description',
    scaleY: [0, 1],
    duration: 600,
    easing,
    complete: resolve,
  })
})

const animatePoster = () => new Promise((resolve) => {
  anime({
    targets: '.poster',
    translateY: ['20vh', 0],
    opacity: [0, 1],
    duration: 800,
    easing,
    complete: resolve,
  })
})

const makeHeaderActive = () => new Promise((resolve) => {
  $('.header').addClass('ready')
  resolve()
})

const preloader = () => new Promise((resolve) => {
  window.scrollTo(0, 0)
  Promise.all([
    animateIntroNumbers(),
    loadImages(),
  ])
    .then(animateLinesCollapse)
    .then(animateIntroTitle)
    .then(animateIntroDescription)
    .then(all([animatePoster, makeHeaderActive]))
    .then(resolve)
})

export default preloader

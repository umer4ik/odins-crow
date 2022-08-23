import {
  animateIntroDescription,
  animateIntroNumbers,
  animateIntroTitle,
  animateCollapse,
  animatePoster,
} from './blocks-animation'
import {
  all,
  delay,
  loadImages,
} from './utils'

const makeHeaderActive = () => new Promise((resolve) => {
  document.querySelector('.header').classList.add('ready')
  resolve()
})

const preloader = () => new Promise((resolve) => {
  delay(100).then(() => window.scrollTo(0, 0))
  Promise.all([
    animateIntroNumbers(),
    loadImages(),
  ])
    .then(animateCollapse)
    .then(animateIntroDescription)
    .then(all([animatePoster, makeHeaderActive]))
    .then(resolve)
  delay(2500).then(() => animateIntroTitle({ stagger: 25 }))
})

export default preloader

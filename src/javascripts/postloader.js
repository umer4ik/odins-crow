import {
  animateIntroDescription,
  animateIntroTitle,
  animateLinesCollapse,
  animatePoster,
} from './blocks-animation'
import initSplitText from './init-split-text'
import { all, delay } from './utils'

const postloader = () => new Promise((resolve) => {
  initSplitText()
  const counters = document.querySelector('.counters')
  if (counters) {
    counters.style.display = 'none'
  } else {
    resolve()
    return
  }
  Promise.all([
    animateLinesCollapse({
      duration: 600,
      delayCoeff: 25,
    }),
    animateIntroTitle({
      stagger: 10,
    }),
  ])
  delay(500)
    .then(all([animateIntroDescription, animatePoster]))
    .then(resolve)
})

export default postloader

import LocomotiveScroll from 'locomotive-scroll'
import $ from 'jquery'
import anime from 'animejs'
import splitText from './split-text'

window.jQuery = $
window.$ = $

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isHomePage = () => document.body.dataset.page === 'home'
const isReferralPartnersPage = () => document.body.dataset.page === 'referral-partners'
let scroll = null

function destroyScroll() {
  if (scroll) {
    scroll.destroy()
    scroll = null
    $('.time-block, .structures-block, [data-scroll-section]').removeAttr('style')
  }
}

const initScroll = () => {
  if (scroll) {
    destroyScroll()
  }
  scroll = new LocomotiveScroll({
    el: document.querySelector('#js-scroll'),
    smooth: true,
    tablet: {
      smooth: true,
    },
    smartphone: {
      smooth: false,
    },
  })
  let prevY = 0
  const getDirection = (y) => {
    let direction
    if (y > prevY) {
      direction = 'down'
    } else if (y < prevY) {
      direction = 'up'
    } else {
      direction = 'freeze'
    }
    prevY = y
    return direction
  }
  let totalLength
  if (isHomePage()) {
    totalLength = $('#ellipse path').get(0).getTotalLength()
    $('#ellipse path').css('stroke-dasharray', totalLength)
    $('#ellipse path').css('stroke-dashoffset', totalLength)
  }

  const lerp = (progress, speedCoefficient = 4, bottomThreshold = 33.3333, total = 100) => {
    const p = total - (total - bottomThreshold) * (progress * speedCoefficient)
    return p < bottomThreshold ? bottomThreshold : p
  }

  $('.intro__description svg').on('click', () => {
    if (scroll) {
      scroll.scrollTo('#poster', { offset: -64 })
    }
  })

  scroll.on('scroll', (instance) => {
    // hide header
    const direction = getDirection(instance.delta.y)
    if (direction === 'down' && instance.delta.y > 100) {
      $('.header').addClass('js-hidden')
    } else if (direction === 'up' && instance.delta.y < 300) {
      $('.header').removeClass('js-hidden')
    }
    if (isHomePage()) {
      const target1 = instance.currentElements['time-trigger']
      if (target1 && target1.el) {
        // handle scroll of block 1.4 on home page
        if ($(target1.el).hasClass('time-trigger')) {
          const { progress } = target1
          const width = lerp(progress, 4, 33.33333)
          $('.time-block--1').css('min-width', `calc(${width}% - 20px)`)
          if (progress > 0.25) {
            const width2 = lerp(progress - 0.25)
            $('.time-block--2').css('min-width', `calc(${width2}% - 20px)`)
          }
          if (progress > 0.5) {
            const width3 = lerp(progress - 0.5, 8, 33.33333, 50)
            $('.time-block--3').css('min-width', `calc(${width3}% - 20px)`)
          }
          if (progress > 0.75) {
            const length = lerp(progress - 0.75, 4, 0, totalLength)
            $('#ellipse path').css('stroke-dashoffset', `${length}px`)
          }
        }
      }
      const target2 = instance.currentElements['structures-trigger']
      if (target2 && target2.el) {
        $('.structures-block').css('opacity', 1)
        const { progress } = target2
        if (progress > 0 && progress < 0.33) {
          $('.structures__text-block--1').addClass('show')
          $('.structures__text-block--2').removeClass('show')
          $('.structures__numbers-box').css('transform', 'translateY(0)')
        } else if (progress >= 0.33 && progress < 0.66) {
          $('.structures__text-block--1').removeClass('show')
          $('.structures__text-block--2').addClass('show')
          $('.structures__text-block--3').removeClass('show')
          $('.structures__numbers-box').css('transform', 'translateY(-33.33%)')
        } else if (progress >= 0.66) {
          $('.structures__text-block--2').removeClass('show')
          $('.structures__text-block--3').addClass('show')
          $('.structures__numbers-box').css('transform', 'translateY(-66.66%)')
        }
      } else if (target1) {
        $('.structures-block').css('opacity', 0)
      }
    }
    if (isReferralPartnersPage()) {
      const target1 = instance.currentElements['how-it-works']
      if (target1 && target1.el) {
        const { progress } = target1
        $('.how-it-works__block--2').toggleClass('show', progress > 0.25)
        $('.how-it-works__block--3').toggleClass('show', progress > 0.5)
        $('.how-it-works__block--4').toggleClass('show', progress > 0.75)
      }
    }
    const elements = instance.currentElements
    if (Object.keys(elements).some((key) => key.startsWith('img'))) {
      Object.values(elements).forEach((x) => !x.el.classList.contains('zoom-out') && x.el.classList.add('zoom-out'))
    }
    console.log(elements)
    if (elements['away-title']) {
      animateAwayTitle()
    }
  })
  // scroll.on('call', (value, way, object) => {
  //   console.log(value, way, object)
  // })
}

const initNewsletterForm = () => {
  $('#newsletter-email-input').on('input', (e) => {
    if (e.target.value) {
      $('#newsletter-email-label').addClass('hide')
    } else {
      $('#newsletter-email-label').removeClass('hide')
    }
  })
}

const initJoinForm = () => {
  const requiredFields = [
    'fullName',
    'phone',
    'email',
    'streetAddress',
    'city',
    'country',
    'zipCode',
    'agreement',
  ]
  $('#join-form').on('submit', (e) => {
    e.preventDefault()
    $('#join-form input').each((_, el) => {
      if ((!el.value || !el.checked) && requiredFields.includes(el.name)) {
        $(el).addClass('error')
      }
    })
  })
  const onInputChange = (e) => {
    if (requiredFields.includes(e.currentTarget.name)) {
      if (e.currentTarget.value) {
        $(e.currentTarget).removeClass('error')
      } else {
        $(e.currentTarget).addClass('error')
      }
    }
  }
  $('#join-form input').on('input', onInputChange)
  $('#join-form input').on('change', onInputChange)
}

const initBurger = () => {
  $('.header__burger').on('click', () => {
    $('.header').toggleClass('active')
  })
  $(window).on('resize', () => {
    if ($(window).width() > 768) {
      $('.header').removeClass('active')
    }
  })
}

const initSplitText = () => {
  splitText({
    elements: document.querySelectorAll('.intro__title, .counters__counter, .counters__loading, .preloader__text'),
  })
}
const easing = 'cubicBezier(0.165, 0.84, 0.44, 1)'

const lettersOptions = {
  translateY: ['100%', 0],
  easing,
}

const animateIntroTitle = () => {
  anime({
    targets: '.intro-wrapper .intro__title .split-text__visible:not(.space)',
    duration: 1000,
    delay: anime.stagger(100),
    ...lettersOptions,
  })
}

let awayTitleAnimated = false
const animateAwayTitle = () => {
  if (awayTitleAnimated) return
  awayTitleAnimated = true
  anime({
    targets: '.away-title .split-text__visible:not(.space)',
    duration: 1000,
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

  const lines = document.querySelectorAll('.preloader .lines__line')
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
      delay(400).then(() => resolve(loadingDots))
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
    targets: '.preloader__text .split-text__visible:not(.space)',
    delay: anime.stagger(25),
    duration: 400,
    ...lettersOptions,
  })
})

const init = (skipScroll) => {
  initNewsletterForm()
  initJoinForm()
  if (skipScroll) return
  if ($(window).width() > 1024) {
    initScroll()
  } else {
    destroyScroll()
  }
  initBurger()
}

const preloading = () => new Promise((resolve) => {
  const images = document.querySelectorAll('img')
  let loaded = 0
  let animated = false
  const checkDone = (loadingDots) => {
    if (loaded === images.length && animated) {
      resolve(loadingDots)
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
  animateIntroNumbers().then((loadingDots) => {
    animated = true
    checkDone(loadingDots)
  })
})

const postloading = () => new Promise((resolve) => {
  // 1 line
  anime({
    targets: '.preloader .lines__line--2',
    duration: 1500,
    easing,
    translateY: ['0', 'calc(-5.7vh + 18px)'],
  })
  anime({
    targets: '.counters__line--1',
    duration: 1500,
    easing,
    height: '16px',
    translateY: ['0', 'calc(-5.7vh + 18px)'],
    opacity: 0,
  })
  // 2 line
  anime({
    targets: '.preloader .lines__line--3',
    duration: 1500,
    easing,
    translateY: ['0', `calc(-${5.7 * 2}vh + 34px)`],
  })
  anime({
    targets: '.counters__line--2',
    duration: 1500,
    easing,
    height: '16px',
    translateY: ['0', 'calc(-5.7vh + 21px)'],
    opacity: 0,
  })
  // 3 line
  anime({
    targets: '.preloader .lines__line--4',
    duration: 1500,
    easing,
    translateY: ['0', `calc(-${5.7 * 3}vh + 48px)`],
  })
  anime({
    targets: '.counters__line--3',
    duration: 1500,
    easing,
    height: '10px',
    translateY: ['0', 'calc(-5.7vh + 26px)'],
    opacity: 0,
  })
  // 4 line
  anime({
    targets: '.preloader .lines__line--5',
    duration: 1500,
    easing,
    translateY: ['0', `calc(-${5.7 * 4}vh + 58px)`],
  })
  anime({
    targets: '.counters__line--4',
    duration: 1500,
    easing,
    height: '14px',
    translateY: ['0', 'calc(-5.7vh + 33px)'],
    opacity: 0,
  })
  // 5 line
  anime({
    targets: '.preloader .lines__line--6',
    duration: 1500,
    easing,
    translateY: ['0', `calc(-${5.7 * 5}vh + 70px)`],
  })
  anime({
    targets: '.counters__line--5',
    duration: 1500,
    easing,
    height: '10px',
    translateY: ['0', 'calc(-5.7vh + 43px)'],
    opacity: 0,
  })
  // 6 line
  anime({
    targets: '.preloader .lines__line--7',
    duration: 1500,
    easing,
    translateY: ['0', `calc(-${5.7 * 6}vh + 80px)`],
  })
  anime({
    targets: '.counters__line--6',
    duration: 1500,
    easing,
    height: '0',
    translateY: ['0', 'calc(-5.7vh + 54px)'],
    opacity: 0,
    complete: resolve,
  })
})

const hidePreloader = () => new Promise((resolve) => {
  animateIntroTitle()
  anime({
    targets: '.preloader',
    duration: 1000,
    easing,
    opacity: [1, 0],
    complete: () => {
      $('.preloader').addClass('hide')
      resolve()
    },
  })
  $('.header').addClass('ready')
})

const preloader = () => preloading()
  .then((loadingDots) => {
    loadingDots.pause()
    return postloading()
  }).then(hidePreloader)

$(() => {
  initSplitText()
  preloader().then(() => {
  // hidePreloader().then(() => {
    console.log('Images are loaded and preloader finished')
    $(window).on('resize', init)
    init()
  })
})

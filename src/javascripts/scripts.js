import LocomotiveScroll from 'locomotive-scroll'
import $ from 'jquery'
import anime from 'animejs'
import preloader from './preloader'
import {
  delay,
  easing,
  getPageHTML,
  lerp,
} from './utils'
import successDialog from './success-dialog'
import router from './router'
import { hideCurtain, showCurtain } from './transitions'
import initSplitText from './init-split-text'
import postloader from './postloader'

window.showSuccessDialog = successDialog.show

window.jQuery = $
window.$ = $

const odinsCrow = {
  scroll: null,
  destroyScroll: () => {
    odinsCrow.scroll.destroy()
    $('[data-scroll-section]').removeAttr('style')
  },
}
window.odinsCrow = odinsCrow

const isHomePage = () => document.body.dataset.page === 'home'
const isReferralPartnersPage = () => document.body.dataset.page === 'referral-partners'
const is404Page = () => document.body.dataset.page === '404'

const lettersOptions = {
  translateY: ['100%', 0],
  easing,
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

const moveHowItWorksBlock = ({
  progress,
  selector,
  start,
  end,
}) => {
  if (progress >= start && progress <= end) {
    const transform = lerp(progress - start, 4, 0, 100)
    $(selector).css('transform', `translateX(${transform}%)`)
  } else if (progress < start) {
    $(selector).css('transform', 'translateX(100%)')
  } else if (progress > end) {
    $(selector).css('transform', 'translateX(0)')
  }
}

$(document.body).on('click', '.intro__description svg', () => {
  if (odinsCrow.scroll) {
    odinsCrow.scroll.scrollTo('#poster', { offset: -64 })
  }
})

const initScroll = () => {
  const isSmallScreen = () => $(window).width() < 1024
  const scroll = new LocomotiveScroll({
    el: document.querySelector('#js-scroll'),
    smooth: true,
    tablet: {
      smooth: true,
    },
    smartphone: {
      smooth: false,
    },
  })
  odinsCrow.scroll = scroll
  let totalLength
  let ellipseAnimation = null
  const resetEllipse = () => {
    if (isHomePage() && !isSmallScreen()) {
      totalLength = $('#ellipse path').get(0).getTotalLength()
      $('#ellipse path').css('stroke-dasharray', totalLength)
      $('#ellipse path').css('stroke-dashoffset', totalLength)
    }
  }
  resetEllipse()
  let resizeTimeout
  $(window).on('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      scroll.update()
    }, 600)
  })

  scroll.on('scroll', (instance) => {
    const sm = isSmallScreen()
    const elements = instance.currentElements
    if (Object.keys(elements).some((key) => key.startsWith('img'))) {
      Object.values(elements).forEach((x) => !x.el.classList.contains('zoom-out') && x.el.classList.add('zoom-out'))
    }
    if (sm) return
    if (elements['away-title']) {
      animateAwayTitle()
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
          if (progress > 0.66) {
            // const length = lerp(progress - 0.75, 4, 0, totalLength)
            // $('#ellipse path').css('stroke-dashoffset', `${length}px`)
            if (!ellipseAnimation) {
              ellipseAnimation = anime({
                targets: '#ellipse path',
                strokeDashoffset: [totalLength, 0],
                easing,
                duration: 1000,
              })
            }
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
        // to translateX 0
        moveHowItWorksBlock({
          progress,
          selector: '.how-it-works__block--2',
          start: 0,
          end: 0.3,
        })

        moveHowItWorksBlock({
          progress,
          selector: '.how-it-works__block--3',
          start: 0.3,
          end: 0.6,
        })

        moveHowItWorksBlock({
          progress,
          selector: '.how-it-works__block--4',
          start: 0.6,
          end: 0.9,
        })
        $('.how-it-works__block--2').toggleClass('show', progress > 0.15)
        $('.how-it-works__block--3').toggleClass('show', progress > 0.45)
        $('.how-it-works__block--4').toggleClass('show', progress > 0.75)
      }
    }
  })
}

const destroyScroll = () => {
  awayTitleAnimated = false
  window.scrollTo(0, 0)
  odinsCrow.scroll.destroy()
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
  $(document.body).on('submit', '#join-form', (e) => {
    e.preventDefault()
    let invalid = false
    $('#join-form input').each((_, el) => {
      if (requiredFields.includes(el.name)) {
        if ((el.type === 'checkbox' && !el.checked) || (['text', 'email', 'tel'].includes(el.type) && !el.value)) {
          invalid = true
          $(el).addClass('error')
        }
      }
    })
    if (!invalid) successDialog.show()
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
  $(document.body).on('input', '#join-form input', onInputChange)
  $(document.body).on('change', '#join-form input', onInputChange)
}

const initBurger = () => {
  $('.header__burger').on('click', () => {
    $('.header').toggleClass('active')
  })
  $('.mobile-menu__nav-link').on('click', () => {
    $('.header').removeClass('active')
  })
  $(window).on('resize', () => {
    if ($(window).width() >= 1024) {
      $('.header').removeClass('active')
    }
  })
}

const init = (skipScroll) => {
  initNewsletterForm()
  initJoinForm()
  if (skipScroll) return
  initScroll()
  $('body').addClass('ready')
  initBurger()
}

$(() => {
  initSplitText()

  if (is404Page()) {
    $('.header').addClass('ready')
    $('body').removeClass('preloading')
    $(window).on('resize', init)
    init()
  } else {
    $('body').addClass('preloading')
  }
  preloader().then(() => {
    $('body').removeClass('preloading')
    $(window).on('resize', init)
    init()
  })
  router.init({
    before: async (path) => {
      document.body.classList.add('navigation-in-progress')
      const promises = [showCurtain()]
      if (!router.pagesCache[path]) {
        promises.unshift(getPageHTML(path))
      }
      const [result] = await Promise.all(promises)
      destroyScroll()
      if (!router.pagesCache[path]) {
        router.pagesCache[path] = result
      }
    },
    after: async (path) => {
      const pageHTML = router.pagesCache[path]
      document.querySelector('.main-container').innerHTML = pageHTML
      hideCurtain()
      await postloader()
      await delay(100)
      initScroll()
      document.body.classList.remove('navigation-in-progress')
    },
  })
})

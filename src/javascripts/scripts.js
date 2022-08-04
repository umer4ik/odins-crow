import LocomotiveScroll from 'locomotive-scroll'
import $ from 'jquery'

window.jQuery = $
window.$ = $

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

  scroll.on('scroll', (instance) => {
    // hide header
    const direction = getDirection(instance.delta.y)
    if (direction === 'down' && instance.delta.y > 100) {
      $('.header').addClass('js-hidden')
    } else if (direction === 'up' && instance.delta.y < 300) {
      $('.header').removeClass('js-hidden')
    }
    if (isHomePage()) {
      const target1 = instance.currentElements.el0
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
      const target2 = instance.currentElements.el1
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
      const target1 = instance.currentElements.el0
      if (target1 && target1.el) {
        const { progress } = target1
        // const transform1 = lerp(progress, 4, 0, 100)
        // $('.how-it-works__block--2').css('transform', `translate(${transform1}%, 0)`)
        // const transform2 = lerp(progress - 0.33, 4, 0, 100)
        // $('.how-it-works__block--3').css('transform', `translate(${transform2}%, 0)`)
        // const transform3 = lerp(progress - 0.66, 4, 0, 100)
        // $('.how-it-works__block--4').css('transform', `translate(${transform3}%, 0)`)
        $('.how-it-works__block--2').toggleClass('show', progress > 0.25)
        $('.how-it-works__block--3').toggleClass('show', progress > 0.5)
        $('.how-it-works__block--4').toggleClass('show', progress > 0.75)
      }
    }
  })
  scroll.on('call', (value, way, object) => {
    console.log(value, way, object)
  })
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

$(() => {
  $(window).on('resize', init)
  init()
})

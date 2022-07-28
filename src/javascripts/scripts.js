import LocomotiveScroll from 'locomotive-scroll'
import $ from 'jquery'

window.jQuery = $
window.$ = $

const isHomePage = () => document.body.dataset.page === 'home'

$(() => {
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
        console.log(progress)
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

    // const progress = instance.scroll.y / instance.limit.y
    // console.log(progress)
  })
  scroll.on('call', (value, way, object) => {
    console.log(value, way, object)
  })
})

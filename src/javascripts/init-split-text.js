import splitText from './split-text'

const initSplitText = () => {
  splitText({
    elements: document.querySelectorAll('.intro__title:not(.intro__title--404), .counters__loading, .preloader-text, .intro-description-split-text'),
  })
  splitText({
    elements: document.querySelectorAll('.counters__counter'),
    isWord: true,
  })
}
export default initSplitText

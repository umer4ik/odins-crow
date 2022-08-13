const isInternalLink = (link) => link.getAttribute('data-internal') !== null
const isCurrentPage = (href) => new URL(href, window.location.origin).pathname
  === window.location.pathname

const router = {
  init({
    before,
    after,
  }) {
    this.before = before
    this.after = after
    window.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (!link) return
      if (isCurrentPage(link.href)) {
        e.preventDefault()
        return
      }
      if (link && isInternalLink(link)) {
        e.preventDefault()
        const href = e.target.getAttribute('href')
        router.navigate(href, { page: link.dataset.page })
      }
    })
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, { skipPopState: true })
    })
  },
  async navigate(path, { skipPopState, page } = {}) {
    this.blockTransition = true
    if (!skipPopState) {
      window.history.pushState({}, '', path)
    }
    if (page) {
      document.body.dataset.page = page
    }
    if (this.before) {
      await this.before(path, { page })
    }
    if (this.after) {
      await this.after(path, { page })
    }
    this.blockTransition = false
    return Promise.resolve()
  },
  before: null,
  blockTransition: false,
  pagesCache: {},
}

export default router

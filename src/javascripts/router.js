const router = {
  init: () => {},
  navigate: async (path) => {
    if (this.beforeNavigate) {
      await this.beforeNavigate()
    }
    window.history.pushState({}, '', path)
    return Promise.resolve()
  },
}

export default router

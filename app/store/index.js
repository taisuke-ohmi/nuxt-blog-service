export const state = () => ({
  isLoggedIn: false,
  user: null
})

export const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  user: (state) => state.user
}

export const mutations = {
  setUser(state, { user }) {
    state.user = user
    state.isLoggedIn = true
  }
}

export const actions = {
  async login({ commit }, { id }) {
    const token = process.env.FIREBASE_TOKEN
    const user = await this.$axios.$get(`/users/${id}.json?auth=${token}`)
    if (!user.id) throw new Error('Invalid user')
    commit('setUser', { user })
  },
  async register({ commit }, { id }) {
    const token = process.env.FIREBASE_TOKEN
    const payload = {}
    payload[id] = { id }
    await this.$axios.$patch(`/users.json?auth=${token}`, payload)
    const user = await this.$axios.$get(`/users/${id}.json?auth=${token}`)
    if (!user.id) throw new Error('Invalid user')
    commit('setUser', { user })
  }
}

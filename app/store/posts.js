import moment from '~/plugins/moment'

export const state = () => ({
  posts: []
})

export const getters = {
  posts: (state) => state.posts
}

export const mutations = {
  addPost(state, { post }) {
    state.posts.push(post)
  },
  updatePost(state, { post }) {
    state.posts = state.posts.map((p) => (p.id === post.id ? post : p))
  },
  clearPosts(state) {
    state.posts = []
  }
}

export const actions = {
  async publishPost({ commit }, { payload }) {
    const token = process.env.FIREBASE_TOKEN
    const user = await this.$axios.$get(`/users/${payload.user.id}.json?auth=${token}`)
    const post_id = (await this.$axios.$post(`/posts.json?auth=${token}`, payload)).name
    const created_at = moment().format()
    const post = { id: post_id, ...payload, created_at }
    const putData = { id: post_id, ...payload, created_at }
    delete putData.user
    await this.$axios.$put(`/users/${user.id}/posts.json?auth=${token}`, [
      ...(user.posts || []),
      putData
    ])
    commit('addPost', { post })
  }
}

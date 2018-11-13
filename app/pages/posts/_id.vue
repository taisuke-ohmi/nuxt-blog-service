<template>
  <section class="container posts-page">
    <div style="flex: 1">
      <el-card v-if="post">
        <div slot="header" class="clearfix">
          <h2>{{post.title}}</h2>
          <small>by {{post.user.id}}</small>
        </div>
        <p>{{post.body}}</p>
        <no-ssr>
          <p class="text-right">
            <el-button :disabled="!isLoggedIn" type="warning" v-if="isLiked" @click="unlike" round>
              <span class="el-icon-star-on"></span>
              <span>{{post.likes.length}}</span>
            </el-button>
            <el-button :disabled="!isLoggedIn" type="warning" v-else @click="like" round>
              <span class="el-icon-star-off"></span>
              <span>{{post.likes.length}}</span>
            </el-button>
          </p>
        </no-ssr>
        <p class="text-right">
          {{post.created_at | time}}
        </p>
      </el-card>
      <p>
        <nuxt-link to="/posts">&lt; 投稿一覧へ戻る</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script>
import moment from '~/plugins/moment'
import { mapGetters, mapActions } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
  async asyncData({ store, route, error }) {
    const { id } = route.params
    if (store.getters['posts/posts'].find(p => p.id === id)) {
      return
    }
    try {
      await store.dispatch('posts/fetchPost', { id })
      if (!(store.getters['posts/posts'].find(p => p.id === this.$route.params.id))) {
        throw new Error('post not found')
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  computed: {
    post() {
      return this.posts.find(p => p.id === this.$route.params.id)
    },
    isLiked() {
      if (!this.user) return false
      return this.post.likes.find(l => l.user_id === this.user.id)
    },
    ...mapGetters(['user', 'isLoggedIn']),
    ...mapGetters('posts', ['posts'])
  },
  methods: {
    like() {
      if (!this.isLoggedIn) {
        return
      }
      const likePayLoad = { user: this.user, post: this.post }
      this.addLikeToPost(cloneDeep(likePayLoad))
      this.addLikeToUser(cloneDeep(likePayLoad))
    },
    unlike() {
      if (!this.isLoggedIn) {
        return
      }
      // いいね取り消し処理を実装
    },
    ...mapActions(['addLikeToUser']),
    ...mapActions('posts', ['addLikeToPost'])
  },
  filters: {
    time(val) {
      return moment(val).format('YYYY/MM/DD HH:mm:ss')
    }
  }
}
</script>

<style>
.posts-page .el-table__row {
  cursor: pointer;
}
</style>

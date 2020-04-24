import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('token'),
    user: null
  },
  mutations: {
    [LOGIN] (state) {
      state.pending = true
    },
    [LOGIN_SUCCESS] (state) {
      state.isLoggedIn = true
      state.pending = false
    },
    [LOGOUT] (state) {
      state.isLoggedIn = false
    }
  },
  actions: {
    login ({ commit, dispatch }, creds) {
      commit(LOGIN)
      axios.post(`${process.env.VUE_APP_BASE_API_URL}/api/token/`, creds,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          localStorage.setItem('token', response.data.access)
          dispatch('grabUser')
          commit(LOGIN_SUCCESS)
        })
        .catch(err => {
          console.log('error:', err)
          commit(LOGOUT)
        })
    },
    register ({ commit, dispatch }, creds) {
      axios.post(`${process.env.VUE_APP_BASE_API_URL}/users/register/`, creds,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('User created!!!')
        })
        .catch(err => {
          console.log('error:', err)
        })
    },
    logout ({ commit }) {
      localStorage.removeItem('token')
      commit(LOGOUT)
    },
    grabUser ({ commit }) {
      axios.get(`${process.env.VUE_APP_BASE_API_URL}/users/me/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(resp => {
          this.state.user = { ...resp.data[0] }
        })
        .catch(e => {
          console.log(`error: ${e}`)
        })
    }
  },

  getters: {
    isLoggedIn: state => {
      return state.isLoggedIn
    },
    getUser: state => {
      return state.user
    }
  }
})

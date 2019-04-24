import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    primary: '#46a0f5',
    // secondary: '#b0bec5',
    accent: '#525252',
    // error: '#b71c1c'
  }
})

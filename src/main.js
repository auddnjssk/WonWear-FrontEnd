import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import utils from './components/js/utils.js'; // 공통함수 사용을 위해 this.$함수명(변수)
import '@assets/tailwind.css'

import store from './store';  // Vuex 스토어 임포트
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

// utils 플러그인 설치
app.use(utils);
app.use(pinia);

// 전역 프로퍼티에 googleUser 추가 / 사용법 : this.$googleUser
app.config.globalProperties.$googleUser = null;
app.config.globalProperties.$googleUserName = null;
app.config.globalProperties.$googleToken = null;
app.config.globalProperties.$leftOn = null;
app.config.globalProperties.$accessToken = '';

// 라우터 사용
app.use(router);

// Vuex 스토어 등록
app.use(store);  // Vue 애플리케이션에 Vuex 스토어 등록

// 앱 마운트
app.mount('#app');

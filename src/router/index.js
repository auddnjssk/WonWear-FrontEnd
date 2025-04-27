// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
// import { useAuthStore }     from '@store/auth.js';
// import * as utils from "@js/utils.js";

import MainPage              from '@components/MainPage.vue';
import ProductPage           from '@components/ProductPage.vue';
import DetailsPage           from '@components/DetailsPage.vue';
import LoginMain             from '@components/LoginMain.vue';
import UserEdit              from '@components/UserEdit.vue';

// requiresAuth는 해당 화면이 인증이 필요한 화면인지 T/F
const routes = [
  {
    path: '/',
    name: 'mainPage',
    component: MainPage,
  },
  {
    path: '/productPage/:main/:sub',
    name: 'productPage',
    component: ProductPage,
  },
  {
    path: '/detailsPage/:itemsId',
    name: 'detailsPage',
    component: DetailsPage,
  },  
  {
    path: '/userEdit',
    name: 'UserEdit',
    component: UserEdit,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginMain,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 라우터 변경 시 Vuex 상태 업데이트
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   const accessToken = localStorage.getItem('accessToken');
//   console.log("accessToken",!accessToken);

//   if (to.meta.requiresAuth && !accessToken) {
//     // requiresAuth가 true이고, 토큰이 없으면 로그인 페이지로 리다이렉트
//     utils.showAlert('error',"로그인 상태가 아닙니다. 재 로그인 해주세요.",next,"/");
//     authStore.setAccessToken("");

//   } else {
//     // 그 외의 경우는 다음 라우트로 진행
//     next();
//   }

// });

export default router;

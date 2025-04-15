// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import PdfAsImage           from '@components/PdfAsImage.vue';
import FormManagement       from '@components/SideMenu/FormManagement.vue';
import SideCalender         from '@components/SideMenu/SideCalender.vue';
import CustomerManagement   from '@components/SideMenu/CustomerManagement.vue';
import ManualTransmit       from '@components/SideMenu/ManualTransmit.vue';
import MailFormManagemnet   from '@components/SideMenu/MailFormManagemnet.vue';
import FormAdd              from '@components/SideMenu/FormAdd.vue';
import GoogleOAuthCallback  from '@components/GoogleOAuthCallback.vue';
import KakaoOAuthCallback   from '@components/KakaoOAuthCallback.vue';
import PDFForm              from '@components/SideMenu/formManagementComp/PdfForm.vue';
import { useAuthStore }     from '@store/auth.js';



import * as utils from "@js/utils.js";


// requiresAuth는 해당 화면이 인증이 필요한 화면인지 T/F
const routes = [
  {
    path: '/',
    name: 'formManagement',
    component: FormManagement,
  },
  {
    path: '/formManagement',
    name: 'FormManagement',
    component: FormManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/mailFormManagemnet',
    name: 'MailFormManagemnet',
    component: MailFormManagemnet,
    meta: { requiresAuth: true },
  },
  {
    path: '/sideCalender',
    name: 'SideCalender',
    component: SideCalender,
    meta: { requiresAuth: true },
  },
  {
    path: '/customerManagement',
    name: 'CustomerManagement',
    component: CustomerManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/manualTransmit',
    name: 'ManualTransmit',
    component: ManualTransmit,
    meta: { requiresAuth: true },
  },
  {
    path: '/formAdd',
    name: 'FormAdd',
    component: FormAdd,
    meta: { requiresAuth: true },
  },
  {
    path: '/pdfAsImage',
    name: 'PdfAsImage',
    component: PdfAsImage,
    meta: { requiresAuth: true },
  },

  {
    path: '/googleOauth',
    name: '/googleOauth',
    component: GoogleOAuthCallback,
  },
  {
    path: '/kakaoOauth',
    name: '/kakaoOauth',
    component: KakaoOAuthCallback,
  },

  

  {
    path: '/PDFForm',
    name: '/PDFForm',
    component: PDFForm,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 라우터 변경 시 Vuex 상태 업데이트
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const accessToken = localStorage.getItem('accessToken');
  console.log("accessToken",!accessToken);

  if (to.meta.requiresAuth && !accessToken) {
    // requiresAuth가 true이고, 토큰이 없으면 로그인 페이지로 리다이렉트
    utils.showAlert('error',"로그인 상태가 아닙니다. 재 로그인 해주세요.",next,"/");
    authStore.setAccessToken("");

  } else {
    // 그 외의 경우는 다음 라우트로 진행
    next();
  }

});

export default router;

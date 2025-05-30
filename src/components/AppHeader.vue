<template>
  <header
  :class="[{ 'h-[120px]': isShrunk, 'h-[180px]': !isShrunk },
    'fixed top-0 left-0 w-full bg-white/90 flex flex-col transition-all duration-300 z-[1000] border-b' ]">

    <div class="flex items-center justify-between w-full flex-[2]">
      <div class="flex items-center justify-center h-full">
        <img
          @click="logoClick"
          class="inline-block align-middle h-[80%] w-[80px] cursor-pointer"
          :src="backgroundImage"
          alt="background"
        />
      </div>
      <div class="inline-block align-middle">
        <a @click="orderListClick" v-if="loginStat" class=" mx-1 text-black text-sm cursor-pointer">주문 목록</a>
        <a @click="menuEditClick" v-if="loginStat" class="mx-1 text-black text-sm cursor-pointer">메뉴/아이템 설정</a>
        <a @click="logoutClick" v-if="loginStat" class="mx-1 text-black text-sm cursor-pointer">로그아웃</a>
        <a @click="loginClick" v-else class="mx-1 text-black text-sm cursor-pointer">로그인</a>
        <a @click="userEditClick" v-if="loginStat" class="mx-1 text-black text-sm cursor-pointer">정보수정</a>
        <a v-else class="mx-1 text-black text-sm">회원가입</a>
        <a @click="myPageClick" class="mx-1 text-black text-sm cursor-pointer">마이페이지</a>
        <a @click="cartClick" class="mx-1 text-black text-sm cursor-pointer">장바구니</a>
      </div>
    </div>

    <div class="flex items-center justify-center w-full flex-[1]">
      <div
        v-for="(parent) in categoryList.filter(c => c.parent_cate_no === null)" 
        :key="parent.cate_no" 
        class="relative text-black mx-1 cursor-pointer"
        @mouseenter="hasChild(parent.cate_no) ? hoverCategory = parent.cate_no : hoverCategory = null"
        @mouseleave="hoverCategory = null"
      >
        <span data-type="main" class="text-sm" @click="menuClick(parent.cate_no)">{{ parent.cate_name }}</span>
        <transition  name="fade-slide">
          <ul v-if="hoverCategory === parent.cate_no && hasChild(parent.cate_no)"
            class="absolute top-full left-0 bg-white border border-gray-300 list-none py-2 px-0 m-0 w-[150px] rounded shadow-lg z-10"
          >
            <li
              v-for="child in categoryList.filter(c => c.parent_cate_no === parent.cate_no)" 
              :key="child.cate_no"
              data-type="sub"
              @click="menuClick(child.cate_no)"
              class="text-sm px-4 py-2 bg-white hover:bg-gray-200"
            >
              {{ child.cate_name }}
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </header>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import WONWEARLogo from '@assets/WONWEARLogo.png';
import utils from '@js/utils.js';
import { useAuthStore } from '@store/auth.js';
import '@assets/headerStyle.css';

const backgroundImage = WONWEARLogo;
const hoverCategory = ref();
const menuList = ref([]);
const categoryList = ref([]);
const isShrunk = ref(false);
const loginStat = ref(null);
const oAuthYn = ref(null);
const adminYn = ref(null);
const custStat = ref();
const authStore = useAuthStore();
authStore.syncWithLocalStorage();
const router = useRouter();

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

const fetchItems = async () => {
  const result = await utils.aSyncGetApi('/category', '');
  console.log("categoryList",result.result);
  categoryList.value = result.result;
  menuList.value = result.result;
};

const hasChild = async (cateNo) => {
  return categoryList.value.some(c => c.parent_cate_no === cateNo);
};

const menuClick = async (cateNo) => {

  const findVal = categoryList.value.find(c => c.cate_no == cateNo);
  
  if(findVal.parent_cate_no){
    const parentVal = categoryList.value.find(c => c.cate_no == findVal.parent_cate_no);
    localStorage.setItem('meinMenu',parentVal.cate_name);
    localStorage.setItem('subMenu',findVal.cate_name);

  }else{
    localStorage.setItem('meinMenu',findVal.cate_name);
    localStorage.setItem('subMenu',null);
  }

  router.push(`/productPage/${cateNo}`);
};

const logoClick      = () => router.push('/');
const loginClick     = () => router.push('/login');
const logoutClick    = () => authStore.clearAccessToken();
const userEditClick  = () => router.push('/userEdit');
const myPageClick    = () => router.push('/myPage');
const menuEditClick  = () => router.push('/categoryEdit');
const cartClick      = () => router.push('/cartList');
const orderListClick = () => router.push('/orderListPage');
const handleScroll = () => isShrunk.value = window.scrollY > 50;

watch(() => authStore.accessToken, (newToken) => {
  adminYn.value = localStorage.getItem('adminYn');
  loginStat.value = newToken ? true : null;
  if (newToken) router.push('/');
});

const accessTokenChk = () => {
  if (code) oAuthYn.value = true;
  if (window.location.pathname.indexOf('cust') > 0) {
    custStat.value = true;
    loginStat.value = null;
  }
  loginStat.value = authStore.accessToken ? true : null;
};

onMounted(() => {
  fetchItems();
  accessTokenChk();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.2s ease;
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>

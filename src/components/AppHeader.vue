<template>
  <header :class="[{ 'h-[120px] fixed': isShrunk }, 'top-0 left-0 w-full bg-white flex flex-col transition-all duration-300 z-[1000]']">
    <div class="flex items-center justify-between w-full h-full">
      <div class="flex items-center justify-center h-full">
        <img
          @click="logoClick"
          class="inline-block align-middle h-[100px] w-[100px] cursor-pointer"
          :src="backgroundImage"
          alt="background"
        />
      </div>
      <div class="inline-block align-middle">
        <a @click="orderListClick" v-if="loginStat" class="mx-1 text-black text-base cursor-pointer">주문 목록</a>
        <a @click="menuEditClick" v-if="loginStat" class="mx-1 text-black text-base cursor-pointer">메뉴/아이템 설정</a>
        <a @click="logoutClick" v-if="loginStat" class="mx-1 text-black text-base cursor-pointer">로그아웃</a>
        <a @click="loginClick" v-else class="mx-1 text-black text-base cursor-pointer">로그인</a>
        <a @click="userEditClick" v-if="loginStat" class="mx-1 text-black text-base cursor-pointer">정보수정</a>
        <a v-else class="mx-1 text-black text-base">회원가입</a>
        <a @click="myPageClick" class="mx-1 text-black text-base cursor-pointer">마이페이지</a>
        <a @click="cartClick" class="mx-1 text-black text-base cursor-pointer">장바구니</a>
      </div>
    </div>

    <div class="flex items-center justify-center h-full">
      <div
        v-for="(menu,index) in menuList"
        :key="menu.mainmenu_id"
        class="relative h-[30px] text-black mx-1 cursor-pointer"
        @mouseenter="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, true)"
        @mouseleave="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, false)"
      >
        <span data-type="main" class="text-base" @click="menuClick(index)">{{ menu.mainmenu_name }}</span>
        <transition name="fade-slide">
          <ul
            v-if="menu.subYn === 'Y' && menu.subMenuList && activeDropdownId === menu.mainmenu_id"
            class="absolute top-full left-0 bg-[#ebebeb] list-none py-2 px-0 m-0 w-[150px] rounded shadow-lg z-10"
          >
            <li
              v-for="sub in menu.subMenuList"
              :key="sub.mainmenu_id"
              data-type="sub"
              @click="menuClick(menu.mainmenu_id)"
              class="px-4 py-2 hover:bg-gray-200"
            >
              {{ sub.submenu_name }}
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </header>
  <hr />
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import WONWEARLogo from '@assets/WONWEARLogo.png';
import utils from '@js/utils.js';
import { useAuthStore } from '@store/auth.js';
import '@assets/headerStyle.css';

const backgroundImage = WONWEARLogo;
const activeDropdownId = ref(null);
const menuList = ref([]);
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
  const result = await utils.aSyncGetApi('/menu', '');
  menuList.value = result.result;
};

const showDropdown = (menuId, show) => {
  activeDropdownId.value = show ? menuId : null;
};

const menuClick = async (mainmenuId) => {
  const type = event.target.dataset.type;


  let sub = '';
  let main = '';

  if (type === 'main') {
    main = event.target.textContent.trim();
  } else if (type === 'sub') {
    const menuIndex = menuList.value.findIndex(menuList => menuList.mainmenu_id == mainmenuId);
    main = menuList.value[menuIndex].mainmenu_name;
    sub = event.target.textContent.trim();
  }

  console.log("main",main);
  router.push(`/productPage/${main}/${sub}`);
};

const logoClick      = () => router.push('/');
const loginClick     = () => router.push('/login');
const logoutClick    = () => authStore.clearAccessToken();
const userEditClick  = () => router.push('/userEdit');
const myPageClick    = () => router.push('/myPage');
const menuEditClick  = () => router.push('/menuEdit');
const cartClick      = () => router.push('/cartList');
const orderListClick = () => router.push('/orderListPage');

const handleScroll = () => {
  isShrunk.value = window.scrollY > 50;
};

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

<template>
  <header :class="{ shrink: isShrunk }">

    <div class="topFixed">
      <div class="centerFixed">
        <img @click="logoClick" class="mainLogo" :src="backgroundImage" alt="background" />
      </div>
      <div class="topFixed-items">
        <!-- 로그아웃 정보수정 -->
        <a @click = "logoutClick" v-if="loginStat">로그아웃</a> 
        <a @click = "loginClick"  v-else>로그인</a> 
        <a @click = "userEditClick"  v-if="loginStat">정보수정</a> 
        <a v-else>회원가입</a> 
        <a>마이페이지</a>
        <a>장바구니</a>
      </div>
    </div>

    <div class="bottomFixed">
      <div 
        v-for="menu in menuList" 
        :key="menu.mainmenu_id"
        class="menu-item" 
        @mouseenter="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, true)"
        @mouseleave="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, false)"
      >
        <span data-type="main" @click="menuClick">{{ menu.mainmenu_name }}</span>

        <transition  v-if="menu.subYn === 'Y' && menu.subMenuList && activeDropdownId === menu.mainmenu_id"
          name="fade-slide">
          <ul class="dropdown">
            <li v-for="sub in menu.subMenuList" :key="sub.mainmenu_id" data-type="sub" @click="menuClick"> {{ sub.submenu_name }}</li>
          </ul>
        </transition>
      </div>
    </div>
  </header>

  <hr>

</template>

<script >
import { ref, onMounted, onUnmounted,reactive,watch} from 'vue';
import WONWEARLogo from '@assets/WONWEARLogo.png';
import { useAuthStore } from '@store/auth.js';
import { useRouter } from 'vue-router'; // useRouter 훅 임포트
import utils from '@js/utils.js'
import '@assets/headerStyle.css'  // 스타일 파일 임포트

export default {
  name: 'AppHeader',
  setup() {

    const backgroundImage = WONWEARLogo;
    const activeDropdownId = ref(null);
    const dropdownMap = reactive({});

    const menuList = ref([]);    

    const isShrunk = ref(false)
    const router = useRouter();
    // 로그인체크 변수
    const loginStat = ref(null); 
    const oAuthYn = ref(null); 
    
    const custStat = ref();
    
    const authStore = useAuthStore();
    authStore.syncWithLocalStorage();
   

    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get('code');

    const fetchItems = async() => {
      const result = await utils.aSyncGetApi('/menu', '');
      menuList.value = result.result;
      console.log("menuList.value",menuList.value);
    }

    const showDropdown = (menuId, show) => {
      activeDropdownId.value = show ? menuId : null;
    }
    
    const menuClick = async(event) => {
      const type = event.target.dataset.type;
      const mainSpan = event.target.closest('.dropdown')?.previousElementSibling;

      let sub  = '';
      let main = '';

      if (type === "main") {
        main = event.target.textContent.trim();
      }else if (type === "sub"){
        main = mainSpan?.innerText.trim() || '';
        sub = event.target.textContent.trim();
      }

      router.push(`/productPage/${main}/${sub}`);
    };


    const logoClick = () => {
      router.push('/'); 
    };
    const loginClick = () => {
      router.push('/login'); 
    };

    const logoutClick = () => {
      authStore.clearAccessToken();
    };
    const userEditClick = () => {
      router.push('/userEdit'); 
    };
    
    


    const handleScroll = () => {
      isShrunk.value = window.scrollY > 50 // 50px 이상 스크롤 시 줄어듦
    }

    watch(() => authStore.accessToken, (newToken) => {
        console.log("AppVue Watch !!! ",newToken);
        if (newToken) {
          loginStat.value = true;
          router.push('/'); 
        } else {
          loginStat.value = null;
          console.log('LeftMenu closed');
        }
      }
    );
    // 새로고침을 하더라도 토큰이 유효하면 로그인 유지
    const accessTokenChk = () => {

      console.log("authStore.accessToken",code);

      // 코드가 존재하면 팝업
      if(code){
        oAuthYn.value = true;

      }
      if(window.location.pathname.indexOf("cust") > 0){
        custStat.value = true;
        loginStat.value = null;
      }

      if (authStore.accessToken) loginStat.value = true;
      else  loginStat.value = null;
    }

    onMounted(() => {
      fetchItems();
      accessTokenChk();

      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      backgroundImage,
      menuClick,
      logoClick,
      menuList,
      showDropdown,
      dropdownMap,
      activeDropdownId,
      loginClick,
      accessTokenChk,
      code,
      loginStat,
      accessToken: authStore.accessToken,
      custStat,
      logoutClick,
      userEditClick,
    };
  },
};
</script>

<style scoped>

.topFixed-items a{
  cursor: pointer;
}

</style>
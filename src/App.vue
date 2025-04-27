<template>
  <div id="app-div">
    <!-- <div class="oAuthLogin">
      <router-view />
    </div> -->

    <!-- <div class="login" v-if="custStat">
      <Header/>
    </div> -->
    <AppHeader/>
    <div class="main-div" v-if="loginStat && !custStat">
     
      <div class="main">
        <router-view/>
      </div>
    </div>

    <AppFooter/>
    
  </div>
</template>

<script>
import { ref ,watch , onMounted  } from 'vue'; // Composition API에서 ref를 임포트
import { useAuthStore } from '@store/auth.js';
import AppHeader from '@components/AppHeader.vue';
import AppFooter from '@components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
  setup() {
    const loginStat = ref(null); 
    const oAuthYn = ref(null); 
    
    const custStat = ref();
    
    const authStore = useAuthStore();
    authStore.syncWithLocalStorage();
   

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    //localStorage 의 AccessToken 값 변화 감지
    watch(
      () => authStore.accessToken,
      (newToken) => {
        console.log("AppVue Watch !!! ",newToken);
        if (newToken) {
          loginStat.value = true;
          console.log('LeftMenu opened');
        } else {
          loginStat.value = null;
          console.log('LeftMenu closed');
        }
      }
    );

    
    window.addEventListener("message", (event) => {
        if(event.data.accessToken){
          console.log("📩 팝업에서 받은 메시지:");
          authStore.setAccessToken(event.data.accessToken);

        }
    });


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

    onMounted(() =>{
      accessTokenChk();
    })

    return {
      loginStat,
      accessToken: authStore.accessToken,
      custStat,
      oAuthYn
    };
  }
};
</script>

<style scoped>
.app-div {
  display: flex; 
  height: 100%; /* 화면 전체 높이를 차지 */
}

.main-div{
  display: flex;
  height: 100%;
  padding-bottom: 120px;
}
.main {
  flex: 1; 
  width: 100%; 
  border: 5px;
  background-color: #ffffff;
  box-sizing: border-box;
}
</style>

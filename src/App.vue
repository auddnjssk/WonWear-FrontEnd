<template>
  <div id="app-div">
    <!-- <div class="oAuthLogin">
      <router-view />
    </div> -->

    <!-- <div class="login" v-if="custStat">
      <Header/>
    </div> -->
    <AppHeader/>
    <div class="main-div" >
     
      <div class="main">
        <router-view :key="$route.fullPath" />
      </div>
    </div>

    <AppFooter/>
    
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppHeader from '@components/AppHeader.vue';
import AppFooter from '@components/AppFooter.vue';
import { useAuthStore } from '@store/auth.js';
import { useRouter } from 'vue-router';

const loginStat = ref(null);
const authStore = useAuthStore();
const router = useRouter();


watch(() => authStore.accessToken, (newToken) => {
  loginStat.value = newToken ? true : null;
  if (newToken) router.push('/');
});

</script>

<style scoped>
.app-div {
  display: flex; 
  height: 100%; /* 화면 전체 높이를 차지 */
}

.main-div{
  display: flex;
  height: 100%;
  padding: 100px;
}
.main {
  flex: 1; 
  width: 100%; 
  border: 5px;
  background-color: #ffffff;
  box-sizing: border-box;
}
</style>

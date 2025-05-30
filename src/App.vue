<template>
  <div id="app-div">
    <AppHeader />
    <div class="main-div" :style="{ paddingTop: '180px' }">
      <div class="main">
        <router-view :key="$route.fullPath" />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { watch} from 'vue';
import AppHeader from '@components/AppHeader.vue';
import AppFooter from '@components/AppFooter.vue';
import { useAuthStore } from '@store/auth.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

watch(() => authStore.accessToken, (newToken) => {
  if (newToken) router.push('/');
});
</script>

<style scoped>
.main-div {
  display: flex;
  height: 100%;
  padding-left: 50px;
  padding-right: 50px;
}

.main {
  flex: 1;
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
}
</style>

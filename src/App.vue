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

<script>
import AppHeader from '@components/AppHeader.vue';
import AppFooter from '@components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
  setup() {

    return {
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

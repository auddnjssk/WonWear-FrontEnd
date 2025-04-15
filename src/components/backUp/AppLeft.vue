<template>
  <div class="container">
    <!-- 레프트바 영역 -->
    <div class="left-sidebar">
      <div class="left-Profile">
        <img @click="cckck" v-if="profileImage" :src="profileImage" />
        <a>{{ profileName }}</a>
      </div>
      <nav class="sidebar-links">
        <div class="category">
          <router-link to="/formManagement">양식관리</router-link>
        </div>
        <div class="category">
          <router-link to="/mailFormManagemnet">메일 양식관리</router-link>
        </div>
        <div class="category">
          <router-link to="/contract-create">계약서 작성</router-link>
        </div>
        <div class="category">
          <router-link to="/customerManagement">고객 목록</router-link>
        </div>
        <div class="category">
          <router-link to="/manualTransmit">수동 전송</router-link>
        </div>
        <div class="category">
          <router-link to="/sideCalender">캘린더</router-link>
        </div>
        <div class="category">
          <router-link to="/myPage">마이페이지</router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'AppLeft',
  setup() {
    const profileImage = ref('');
    const profileName = ref('');

    const fetchProfileData = () => {
      // 로컬 스토리지에서 JWT 토큰을 가져오기 (이미 로그인된 경우 사용)
      const token = localStorage.getItem('google_token'); // 토큰 저장 경로는 필요에 맞게 조정

      if (token) {
        try {
          console.log("token!!");
          // JWT 디코딩 및 UTF-8 문자열 처리
          const base64Payload = token.split('.')[1]; // 'token'을 사용하여 payload 추출
          const decodedPayload = decodeURIComponent(escape(atob(base64Payload)));
          const decodedToken = JSON.parse(decodedPayload);
                
          profileImage.value = decodedToken.picture || '';
          profileName.value = decodedToken.name || '';
          console.log('User info fetched from token:', decodedToken);
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      } else {
        console.warn('No token found. User may not be logged in.');
      }
    };

    onMounted(() => {
      fetchProfileData();
    });

    return {
      profileImage,
      profileName
    };
  },
  methods:{
    cckck(){
      console.log("1111",document.cookie);
    },
  }
};
</script>

<style>
.container {
  display: flex;
}

.left-sidebar {
    position: fixed;
    top: 0px; /* 헤더 높이 고려 */
    left: 0;
    width: 15%;
    height: calc(100vh - 60px); /* 헤더를 제외한 높이 */
    background-color: #333;
    color: #fff;
    padding: 15px;
    display: flex;
    height: 100%;
    flex-direction: column;
  }

.left-Profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
}

.left-Profile img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.sidebar-links a {
    color: #fff;
    text-decoration: none;
    margin: 10px 0;
    transition: color 0.3s;
  }
  
.sidebar-links a:hover {
  color: #00bcd4;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
}
.category{
  margin: 20px;
}
.category-item {
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 5px;
}
.category-item.active {
  background-color: #4070f4;
  color: white;
}
</style>

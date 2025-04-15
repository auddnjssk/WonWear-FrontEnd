<template>
  <div class="container">
    <!-- 메인 콘텐츠 영역 -->
    <div class="main-content">
      <h1>메인 페이지에 오신 것을 환영합니다!</h1>
      <p>이곳은 예제 페이지로, CSS 스타일을 활용한 간단한 예시입니다.</p>
      <div class="field">
        <button @click = "kakaoLogin">카카오 연동하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import '@assets/globStyles.css';
import utils from '../js/utils.js'; 


export default {
  name: 'MyPage',
  data() {
    return {
      isCategoryOpen: true
    };
  },
  mounted() {
    // 카카오 SDK 초기화
    window.Kakao.init(process.env.VUE_APP_KAKAO_JSAPP_KEY); // 카카오 Developers에서 발급받은 자바스크립트 키로 초기화
  },
  methods: {
    kakaoLogin() {
      // 카카오 로그인 함수 호출
      window.Kakao.Auth.login({
        success: authObj => {
          // Access Token 획득 후 사용자 정보를 가져옴
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: res => {
              console.log("emaiol =>"+res.kakao_account.email); // 사용자 정보 출력

              // 여기에 백엔드 서버로 사용자 정보를 전송해서 기존 계정과 연동하도록 처리
              const userData = {
                kakaoId: res.id,
                email: res.kakao_account.email
              };
              
              utils.methods.aSyncPostApi(encodeURIComponent("/kakao/connect"),userData).then(response => {
                console.log(authObj+"계정 연동 완료:", response.data);
              }).catch(error => {
                  console.error("연동 중 오류 발생:", error);
                });
              },
            fail: error => {
              console.error("사용자 정보 가져오기 실패:", error);
            }
          });
        },
        fail: err => {
          console.error("카카오 로그인 실패:", err);
        }
      });
    }

  }
};
</script>

<style scoped>
.container {
  display: flex;
}

.left-sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 15px;
}

.sidebar-links .category {
  margin-bottom: 10px;
}

.category-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-weight: bold;
}

.category-items {
  margin-top: 10px;
}

.main-content {
  flex-grow: 1;
  padding: 15px;
}
</style>

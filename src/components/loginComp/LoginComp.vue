<template>
  <section class="main-page-center">
    <div class="form login">
      <div class="form-content">
        <header>wonWear</header>
        <form action="#" @submit.prevent="restGet">
          <div class="field input-field">
            <input id="loginId" ref="loginIdRef" type="text" placeholder="아이디" class="input" />
          </div>

          <div class="field input-field">
            <input id="loginPw" ref="loginPwRef" type="password" placeholder="비밀번호" class="password" />
            <i class='bx bx-hide eye-icon'></i>
          </div>

          <div class="form-link">
            <a href="#" class="forgot-pass">비밀번호 잊음?</a>
          </div>

          <div class="field button-field">
            <button type="submit" @click="loginClick">로그인!</button>
          </div>
        </form>

        <div class="form-link">
          <span>아직 계정없음? <a @click="loginOrSignUpFn('sign')" class="link signup-link">회원가입</a></span>
        </div>
      </div>

      <div class="line"></div>
      <!-- 소셜 로그인 -->
      <div class="social-login">
        <div class="social-icons">
          <div class="icon naver" @click="TestFn">T</div>
          <div class="icon kakao" @click="openKakaoAuthPopup"></div>
          <div class="icon google" @click="openGoogleAuthPopup" >
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/36px.svg" alt="Facebook" />
          </div>
          <div class="icon facebook"></div>
          <div class="icon apple"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
// import '@assets/loginStyles.css'  // 스타일 파일 임포트
import * as utils from "@js/utils.js";
import * as googleLogin from '@js/googleLogin.js'; 
import * as kakaoLogin from '@js/kakaoLogin.js'; 
import { useAuthStore } from '@store/auth.js';

export default {
  name: 'LoginComp',
  props: {
    // 부모로부터 전달받은 함수
    loginOrSignUpFn: {
      type: Function,
      required: true
    }
  },

  setup() {
    // const router = useRouter();
    
    const authStore = useAuthStore();

    const loginIdRef = ref(null);
    const loginPwRef = ref(null);
    //const router = useRouter();
        
    const loginClick = async () => {
        const user = {
          userId: loginIdRef.value.value,
          passWord: loginPwRef.value.value
        };

        // 로그인 API 호출
        await utils.aSyncPostApi("/login", user)
        .then(response => {
          
          if(response){
            if(response.message == "loginSuccess"){
              
              console.log("response.accessToken",response.accessToken);

              authStore.setAccessToken(response.accessToken);
            
              //router.push('/formManagement'); 

            }else if((response.message == "loginFailed")){
              utils.showAlert('error',"로그인 실패임 ㅋㅋ");
            }
          }
        }
      )

    };
    const TestFn = () =>{
      authStore.clearAccessToken();
      console.log("TestFn");
    };

    const apiTest = () =>{
      
      utils.aSyncGetApi("/issueToken","");

      console.log("utils");
    };

    const openKakaoAuthPopup = () => {
      
      kakaoLogin.openKakaoAuthPopup();

    };
    const openGoogleAuthPopup = () => {
      googleLogin.openGoogleAuthPopup();
    };

    return {
      loginIdRef,
      loginPwRef,
      openGoogleAuthPopup,
      openKakaoAuthPopup,
      loginClick,
      TestFn,
      apiTest
      
    };
  },
};
</script>

<style scoped>
/* 소셜 로그인 */
.social-login {
  margin-top: 20px;
}

.social-login p {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.social-icons {
  display: flex;
  justify-content: center;
}

.icon {
  width: 40px;
  height: 40px;
  margin: 0 5px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}

.icon.naver {
  background-color: #03c75a;
}

.icon.kakao {
  background-color: #fee500;
}

.icon.google {
  background-color: white;
}

.icon.facebook {
  background-color: #1877f2;
}

.icon.apple {
  background-color: #000;
}
</style>

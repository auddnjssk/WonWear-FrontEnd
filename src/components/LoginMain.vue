<template>
  <section >
    <LoginComp 
      v-if = "loginOrSignUp === 'login'"
      :loginOrSignUpFn = "loginOrSignUpFn"
    />
    <SignupComp 
      v-if = "loginOrSignUp === 'sign'"
      :loginOrSignUpFn = "loginOrSignUpFn"
    />
  </section>
</template>

<script>
import { ref  } from 'vue';
import '@assets/loginStyles.css'  // 스타일 파일 임포트

import LoginComp from '@components/loginComp/LoginComp.vue'; 
import SignupComp from '@components/loginComp/SignupComp.vue'; 

export default {
  name: 'LoginMain',
  components: {
    LoginComp,
    SignupComp
  },
  setup() {
    const loginOrSignUp = ref("login");

    const loginOrSignUpFn = (stat) => {
      console.log("부모창");
      loginOrSignUp.value = stat;
    }
    return {
      loginOrSignUpFn,
      loginOrSignUp

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

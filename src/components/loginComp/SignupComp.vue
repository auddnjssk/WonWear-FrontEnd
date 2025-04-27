<template>
  <section class="container forms">
    <div class="form login">
      <div class="form-content">
        <header>eSignify</header>
        <form action="#" @submit.prevent="restGet">

          <div class="field input-field">
            <input id="signUpId" ref="signUpIdRef" type="text" placeholder="아이디" class="input" />
          </div>
          <div class="field input-field">
            <input id="signUpPw" ref="signUpPwRef" type="password" placeholder="비밀번호" class="password" />
            <i class='bx bx-hide eye-icon'></i>
          </div>
          <div class="field input-field">
            <input id="signUpCnfmPw" ref="signUpCnfmPwRef" type="password" placeholder="비밀번호 확인" class="password" />
            <i class='bx bx-hide eye-icon'></i>
          </div>
          <div class="field input-field">
            <input id="signUpNm" ref="signUpNmRef" type="text" placeholder="이름" class="input" />
            <i class='bx bx-hide eye-icon'></i>
          </div>
          <div class="field input-field">
            <input id="signUpBusiNm" ref="signUpBusiNmRef" type="text" placeholder="사업장이름" class="input" />
            <i class='bx bx-hide eye-icon'></i>
          </div>
          <div class="field button-field">
            <button type="submit" @click="signUpClick">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
// import '@assets/loginStyles.css'  // 스타일 파일 임포트
import * as utils from "@js/utils.js";

import { ref } from 'vue';



export default {
  name: 'SignupComp',
  props: {
    // 부모로부터 전달받은 함수
    loginOrSignUpFn: {
      type: Function,
      required: true
    }
  },

  setup() {

    const signUpIdRef = ref(null);
    const signUpPwRef = ref(null);
    const signUpCnfmPwRef = ref(null);
    const signUpNmRef = ref(null);
    const signUpBusiNmRef = ref(null);
        
    const signUpClick = async () => {
      try {

        if(utils.isEmpty(signUpIdRef.value.value) || utils.isEmpty(signUpPwRef.value.value) || utils.isEmpty(signUpCnfmPwRef.value.value)
         || utils.isEmpty(signUpNmRef.value.value) || utils.isEmpty(signUpBusiNmRef.value.value)){
          utils.showAlert('error',"값이 비었습니다.");

          return;
        }
        const user = {
          signUpId     : signUpIdRef.value.value,
          signUpPw     : signUpPwRef.value.value,
          signUpCnfmPw : signUpCnfmPwRef.value.value,
          signUpNm     : signUpNmRef.value.value,
          signUpBusiNm : signUpBusiNmRef.value.value,
        };


        console.log("user",user);

        // 로그인 API 호출
        const responseData = await utils.aSyncPostApi("/signUp", user);

        console.log("LoginMain response =>", responseData);

      } catch (error) {
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.',error);
      }
    };

    return {
      signUpIdRef,
      signUpPwRef,
      signUpCnfmPwRef,
      signUpNmRef,
      signUpBusiNmRef,
      signUpClick

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
  background-color:white;
}

.icon.facebook {
  background-color: #1877f2;
}

.icon.apple {
  background-color: #000;
}
</style>
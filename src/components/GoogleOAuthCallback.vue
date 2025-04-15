<template>
  <div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import * as utils from "@js/utils.js";
    

export default {
  setup() {
    const callOauth = () => {

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      console.log("code",code);
      utils.aSyncGetApi("/oauth/google","code="+code)
        .then(response => {
          console.log("kakao Login Response =>",response)
          console.log("window.opener",response);
          if(response.message == "googleLoginSuccess"){
            // 현재 창이 팝업인지 확인
            
            if (window.opener) {
              // 부모창으로 전달
              window.opener.postMessage({ accessToken: response.result}, "*");
              window.close();
            }
          }
      })
    }
    onMounted(() =>{
      callOauth();
    })

    return{
      callOauth,
    }
  },
};
</script>

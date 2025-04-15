// import { useAuthStore } from '@store/auth.js';
// const authStore = useAuthStore();

function openKakaoAuthPopup() {

  let key = process.env.VUE_APP_KAKAO_JSAPP_KEY;
    // 카카오 로그인 팝업을 띄운다
    const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize' +
        '?client_id='+ key +  // 카카오 앱 클라이언트 ID
        '&redirect_uri=http://localhost:8080/kakaoOauth'+// 인증 후 리디렉션될 URI
        '&response_type=code';  // 인증 코드 발급 방식

    //  Opener 사용할수있게 noOpener는 디폴트로 false(독립적인 팝업 false) , 
    window.open(kakaoAuthUrl, '카카오 로그인', 'width=600,height=600','noopener=false');
}

export { openKakaoAuthPopup};

export default {
  openKakaoAuthPopup,

};
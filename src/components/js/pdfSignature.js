export function openGoogleAuthPopup() {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${process.env.VUE_APP_GOOGLE_CLIENT_ID}` +
  `&redirect_uri=http://localhost:8081/oauth/google` +
  `&response_type=code` +
  `&scope=${encodeURIComponent("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.appdata")}` +
  `&access_type=offline` +
  `&prompt=consent`;

  // 팝업 열기
  const popup = window.open(
    googleAuthUrl,
    'googleAuthPopup',
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );

  // 팝업 메시지 수신
  const checkPopup = setInterval(() => {
    if (popup && popup.closed) {
      clearInterval(checkPopup);
    }
  }, 500);

  // 메시지 이벤트 리스너 추가
  window.addEventListener('message', (event) => {
    // 로그인 성공 처리
    if (event.data?.code) {
      console.log('Authorization Code:', event.data.code);
      alert('로그인 성공!');
      // 팝업 닫기
      popup.close();
      clearInterval(checkPopup);
    }
  });
}
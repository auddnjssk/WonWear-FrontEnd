
function openGoogleAuthPopup() {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${process.env.VUE_APP_GOOGLE_CLIENT_ID}` +
  `&redirect_uri=http://localhost:8080/googleOauth` +
  `&response_type=code` +
  `&scope=${encodeURIComponent("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.appdata openid")}` +
  `&access_type=offline` +
  `&prompt=consent`;

  
  // 팝업 열기
  window.open(
    googleAuthUrl,
    "googleAuthPopup",
    "width=500,height=600,scrollbars=yes,resizable=yes"
  );

}

export { openGoogleAuthPopup};

export default {
  openGoogleAuthPopup,

};
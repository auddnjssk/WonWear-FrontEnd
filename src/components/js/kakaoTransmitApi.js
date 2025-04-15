import qs from 'qs';

const axios = require('axios');


export  async function sendKakaoMessage(accessToken) {
    console.log("카톡전송==>"+accessToken);
    try {
      // `template_object`는 문자열로 변환되어야 합니다.
      const templateObject = {
        object_type: 'text',
        text: '안녕하세요! 카카오톡 메시지입니다.',
      };
  
      const requestBody = qs.stringify({
        template_object: JSON.stringify(templateObject),  // JSON 문자열로 변환해서 전달해야 합니다.
      });
  
      const response = await axios.post(
        'https://kapi.kakao.com/v2/api/talk/memo/default/send',
        requestBody,  // URL 인코딩된 데이터를 본문에 전달
        {
          headers: {
            Authorization: `Bearer ${this.$accessToken}`, // 발급받은 Access Token 사용
            'Content-Type': 'application/x-www-form-urlencoded', // 올바른 Content-Type 설정
          },
        }
      );
  
      console.log('카카오톡 메시지 전송 성공:', response.data);
    } catch (error) {
      console.error('카카오톡 메시지 전송 실패:', error.response ? error.response.data : error.message);
    }
}
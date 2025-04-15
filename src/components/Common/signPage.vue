<template>
    <div>
      <button @click="sendSignatureLink">서명 링크 전송</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      sendSignatureLink() {
        const contractId = 123; // 계약서 고유 ID
        const customerId = 456; // 고객 ID
        const signatureURL = 'file:///C:/Users/User/Documents/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1%20%EB%B0%9B%EC%9D%80%20%ED%8C%8C%EC%9D%BC/%EA%B7%B8%EB%8C%80%EC%99%80%20%EC%9A%B0%EB%A6%BC%20%EA%B3%84%EC%95%BD%EC%84%9C-%EA%B9%80%EC%9C%A0%EB%B9%88%20(1).pdf'
        //const signatureURL = `http://localhost:8080/signature?contractId=${contractId}&customerId=${customerId}`;
        
        console.log("서명 페이지 URL:", signatureURL);
        // 여기에 SMS, 이메일, 카카오톡 등을 통해 URL 전송 로직 추가
      }
    }
  };
  </script>
  
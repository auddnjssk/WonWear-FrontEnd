import axios from 'axios';
import AlertPop from '@components/Pop/AlertPop.vue'; 
import inputPop from '@components/Pop/InputPop.vue'; 
import { createApp } from 'vue';
import { useAuthStore } from '@store/auth.js';

let popupInstance      = null; // 현재 팝업 인스턴스를 저장
let inputPopupInstance = null; // 현재 인풋 팝업 인스턴스를 저장

/**
 * 동기 GetApi 호출 함수
 * @param {'/~'} requestUrl 
 * @param {a=b&c=d} values 
 * @returns 
 */
async function aSyncGetApi (requestUrl,values){
  try{
    const response = await axios.get('/api'+requestUrl+'?'+values,{
      headers:{
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if(response.data.statusCode == "3001"){
      const authStore = useAuthStore();
      this.showAlert('error',response.data.message);
      authStore.clearAccessToken();
    }


    return response.data; // 성공한 경우 데이터를 반환
  }catch(error){
    this.showAlert('error',error.response.data);
  }

}

async function  aSyncPostApi (requestUrl, values,action){

  // 디폴트는 post
  if(isEmpty(action)) action = "post";

  console.log(action,"action",values);

  try {
    if(action == "post"){
      const response = await axios.post('/api' + decodeURIComponent(requestUrl), values, {
        headers:{
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true // 쿠키를 서버와 함께 전송하기 위해 사용
      });

      if(response.data.statusCode == "3001"){
        const authStore = useAuthStore();
        this.showAlert('error',response.data.message);
        authStore.clearAccessToken();
      }

      return response.data; // 성공한 경우 데이터를 반환
    }

    if(action == "put"){
      const response = await axios.put('/api' + decodeURIComponent(requestUrl), values, {
        headers:{
          'Content-Type': 'application/json',
        },
        withCredentials: true // 쿠키를 서버와 함께 전송하기 위해 사용
      });

      if(response.data.statusCode == "3001"){
        const authStore = useAuthStore();
        this.showAlert('error',response.data.message);
        authStore.clearAccessToken();
      }
      
      return response.data; // 성공한 경우 데이터를 반환
    }

    if(action == "delete"){
      const response = await axios.delete('/api' + decodeURIComponent(requestUrl), values, {
        headers:{
          'Content-Type': 'application/json',
        },
        withCredentials: true // 쿠키를 서버와 함께 전송하기 위해 사용
      });
      
      if(response.data.statusCode == "3001"){
        const authStore = useAuthStore();
        this.showAlert('error',response.data.message);
        authStore.clearAccessToken();
      }

      return response.data; // 성공한 경우 데이터를 반환
    }

  } catch (error) {
    this.showAlert('error',"에러발생!");
  }
}
async function  aSyncPostFileApi (requestUrl, values){

  console.log("action",values);

  const response = await axios.post('/api' + decodeURIComponent(requestUrl), values, {
    headers:{
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
    },
    withCredentials: true // 쿠키를 서버와 함께 전송하기 위해 사용
  });

  console.log("response",response);
}

function getPrototypeOf(chkObject){
  const itemType = Object.prototype.toString.call(chkObject);

  // 특정 타입인 경우 처리
  if (itemType === '[object Object]') {
    console.log('이것은 객체입니다.');
  } else if (itemType === '[object String]') {
    console.log('이것은 문자열입니다.');
  } else if (itemType === '[object Number]') {
    return "number"
  } else if (itemType === '[object Array]') {
    console.log('이것은 배열입니다.');
  } else {
    console.log('다른 타입입니다.');
  }
}

/**
 * DateFormating
 * @param {*} date 
 * @returns 
 */
function dateFormmat(date){
  const newDate = new Date(date);
  // 자릿수를 위해 padStart 추가
  const formattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')} ${newDate
    .getHours()
    .toString()
    .padStart(2, '0')}:${newDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
  return formattedDate;

}

/**
 * 공통 팝업창 Open
 * @param {alert || confirm || error } stat 
 * @param {*} message 
 * @param {function} callBack 
 */

function showAlert(stat,message,callBack,cbArgument) {

  // 동적으로 DOM 컨테이너 생성
  const container = document.createElement('div');

  document.body.appendChild(container);
  
  const app = createApp(AlertPop, 
    { message , stat , removePopup , callBack , cbArgument}
  );

  popupInstance = {
    app, 
    AlertPop, 
  };
  // DOM에 마운트
  app.mount(container);
}

/**
 * 인풋 팝업창 Open
 * @param {String} message 
 * @param {String} placeholder
 * @param {function} callBack
 * @param {Argument} cbArgument  
 */

function showInputPop(message,placeholder,callBack,cbArgument) {

  // 동적으로 DOM 컨테이너 생성
  const container = document.createElement('div');

  document.body.appendChild(container);
  
  const app = createApp(inputPop, 
    { message , placeholder , removeInputPopup , callBack , cbArgument}
  );
  inputPopupInstance = {
    app, 
    inputPop, 
  };
  // DOM에 마운트
  app.mount(container);
}

function removePopup(){
console.log("removePopup",popupInstance);
  if (popupInstance) {
    const { app, container } = popupInstance;


    app.unmount();

    // DOM 컨테이너가 유효한지 확인
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
    // 인스턴스 초기화
    popupInstance = null;
  }

}
function removeInputPopup(){
    if (inputPopupInstance) {
      const { app, container } = inputPopupInstance;
      app.unmount();
      // DOM 컨테이너가 유효한지 확인
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
      // 인스턴스 초기화
      inputPopupInstance = null;
    }
  
  }

// deleteCookie 함수를 Vuex store 내부 methods로 정의
function deleteCookie(name) {
    console.log("name",name);
    document.cookie = name + '=; Max-Age=-99999999;';
}

/**
 * Null인지 체크하는 함수
 * @param {*} value 
 * @returns true or false
 */
function isEmpty(value) {
  if(value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') || // 빈 문자열 체크
    (Array.isArray(value) && value.length === 0) || // 빈 배열 체크
    (typeof value === 'object' && value !== null && Object.keys(value).length === 0) // 빈 객체 체크)
  ) return true;
  else false;
}

/**
 * 
 * @param {Base64} dataURL 
 * @returns Base64 -> Blob
 */
const dataURLToBlob = (dataURL) => {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
};


// IOS인지 체크
const deviceChk = () =>{
  /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// 이미지파일 업로드
const uploadImageToServer = async (blob,fileName,dir) => {
  console.log("uploadImageToServer",localStorage.getItem('accessToken'));
  
  const formData = new FormData();
  formData.append("image", blob, fileName+".png");
  formData.append("dir", dir);
  
  try {
    const response = await fetch("/api/imageUpload", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    
      console.log("업로드 성공:", response.json());
  } catch (error) {
    console.error("업로드 실패:", error);
  }
};

export { aSyncGetApi , aSyncPostApi , getPrototypeOf ,dateFormmat, showAlert, removePopup,removeInputPopup ,deleteCookie ,isEmpty ,dataURLToBlob ,uploadImageToServer,showInputPop,deviceChk,aSyncPostFileApi};

export default {
  uploadImageToServer,
  aSyncGetApi,
  aSyncPostApi,
  getPrototypeOf,
  dateFormmat,
  showAlert,
  removePopup,
  removeInputPopup,
  deleteCookie,
  isEmpty,
  dataURLToBlob,
  showInputPop,
  deviceChk,
  aSyncPostFileApi
};
<template>
  <!-- 레프트바 영역 -->
  <div id="nav-bar">
    <input id="nav-toggle" type="checkbox" />
    <div id="nav-header">
      <a id="nav-title" href="https://codepen.io" target="_blank">eSignyfy</a>
      <label @click = "fnWideTf()" for="nav-toggle"><span id="nav-toggle-burger"></span></label>
      <hr /> 
    </div>
    <div id="nav-content">
      <div
         class="nav-button"
        :class="{ active: activeButton === '/formManagement' }"
        @click="navigate('/formManagement')">
        <div class = "wideT-div" v-if = "wideTf">
          <span class="inline-span">입력 추가  &nbsp;</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-file-earmark-code" viewBox="0 0 16 16">
            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
            <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708m-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708"/>
          </svg>
        </div>
        <svg v-if = "!wideTf" xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-file-earmark-code" viewBox="0 0 16 16">
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
          <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708m-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708"/>
        </svg>
      </div>


      <div
        class="nav-button"
        :class="{ active: activeButton === '/formAdd' }"
        @click="navigate('/formAdd')">
        <div class = "wideT-div" v-if = "wideTf">
          <span class="inline-span">양식 추가 &nbsp;</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
            <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
          </svg>
        </div>
        <svg v-if = "!wideTf" xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
          <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/>
          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
        </svg>
          
      </div>

      <div
        class="nav-button"
        :class="{ active: activeButton === '/manualTransmit' }"
        @click="navigate('/manualTransmit')">
        <div class = "wideT-div" v-if = "wideTf">
          <span class="inline-span">수동 전송 &nbsp;</span>
          <svg v-if = "wideTf" xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
          </svg>
        </div>
        <svg v-if = "!wideTf" xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
        </svg>
          
      </div>




      <!-- <div
        class="nav-button"
        :class="{ active: activeButton === '/mailFormManagemnet' }"
        @click="navigate('/mailFormManagemnet')"
      >
        <i class="fas fa-palette" /><span>메일 양식관리</span>
      </div>
      <div
        class="nav-button"
        :class="{ active: activeButton === '/customerManagement' }"
        @click="navigate('/customerManagement')"
      >
        <i class="fas fa-palette" /><span>고객 목록</span>
      </div> -->
      <!-- <div
        class="nav-button"
        :class="{ active: activeButton === '/sideCalender' }"
        @click="navigate('/sideCalender')"
      >
        <i class="fas fa-palette" /><span>캘린더</span>
      </div>
      <hr />
      <div
        class="nav-button"
        :class="{ active: activeButton === '/myPage' }"
        @click="navigate('/myPage')"
      >
        <i class="fas fa-palette" /><span>마이페이지</span>
      </div>

      <div class="nav-button"
        :class="{ active: activeButton === '/PDFForm' }"
        @click="navigate('/PDFForm')">
        <i class="fas fa-heart" /><span>pdfform테스트</span>
      </div>
      <div class="nav-button">
        <i class="fas fa-chart-line" /><span>Trending</span>
      </div>
      <div class="nav-button">
        <i class="fas fa-fire" /><span>Challenges</span>
      </div>
      <div class="nav-button">
        <i class="fas fa-magic" /><span>Spark</span>
      </div>
      <hr /> -->
      <!-- <div class="nav-button">
        <i class="fas fa-gem"  @click ="fnTest"/><span @click ="fnTest">local AT 삭제</span>
      </div> -->
      <div id="nav-content-highlight"></div>
    </div>
    <input id="nav-footer-toggle" type="checkbox" />
    <div id="nav-footer">
      <div id="nav-footer-heading">
        <!-- <div id="nav-footer-avatar">
          <img
          :src="userPic"
          />
        </div> -->
        <div id="nav-footer-iconbox">
          <div id = "nav-footer-iconbox-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-gear" viewBox="0 0 16 16">
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
            </svg>
          </div>
          <div id = "nav-footer-iconbox-icon">
            <svg @click="logoutClick" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>
          </div>
        </div>
        <!-- <label for="nav-footer-toggle">

        </label> -->
      </div>
      <!-- <div id="nav-footer-content">
        <lorem
          >ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.</lorem
        >
      </div> -->
    </div>
  </div>

  <!-- ---------------- 모바일 부분 ---------------- -->
  <div id="nav-mobile-bar">
    <div id="nav-content">
      <div
         class="nav-button"
        :class="{ active: activeButton === '/formManagement' }"
        @click="navigate('/formManagement')">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-file-earmark-code" viewBox="0 0 16 16">
            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
            <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708m-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708"/>
          </svg>
      </div>


      <div
        class="nav-button"
        :class="{ active: activeButton === '/formAdd' }"
        @click="navigate('/formAdd')">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
            <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
          </svg>
      </div>

      <div
        class="nav-button"
        :class="{ active: activeButton === '/manualTransmit' }"
        @click="navigate('/manualTransmit')">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
          </svg>
      </div>

      <div id = "nav-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-person-gear" viewBox="0 0 16 16">
          <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
        </svg>
      </div>
      <div id = "nav-button">
        <svg @click="logoutClick" xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
        </svg>
      </div>

      
    </div>
  </div>
</template>

<script>
import { ref ,computed, onMounted} from 'vue'; // Composition API의 ref 임포트
import '@assets/leftStyles.css';
import { useStore } from 'vuex'; // useStore 훅을 통해 Vuex 스토어 접근
import { useRouter } from 'vue-router'; // useRouter 훅 임포트
import { useAuthStore } from '@store/auth.js';
import * as utils from "@js/utils.js";

export default {
  name: 'AppLeft',
  setup() {
    
    // 현재 활성화된 버튼을 추적하는 ref
    const activeButton = ref('');
    const userNm = ref('');
    const userPic = ref('');
    const store = useStore(); // Vuex 스토어에 접근
    const router = useRouter();
    const authStore = useAuthStore();
    const wideTf = ref(true);

    // navigate 함수는 클릭된 버튼에 맞게 활성화 상태를 변경하고 라우터를 이동
    const navigate = (route) => {
      activeButton.value = route; // 클릭된 버튼을 활성화 상태로 설정
      // Vue Router를 사용하여 라우팅
      router.push(route); 
    };

    // mobile일때
    const mountFn = () => {

      if(window.innerWidth <= 768){
        const navToggle = document.querySelector('#nav-toggle');

        console.log("navToggle",navToggle.checked);
        if (navToggle) {
          wideTf.value = false;
          navToggle.checked = true;
        }
      }
      
      // px
      userNm.value  = computed(() => store.state.userName);
      userPic.value = computed(() => store.state.userPicture);
    }

    const fnWideTf = () => {

      // 푸터도 Check
      const toggle = document.getElementById("nav-footer-toggle");
      toggle.checked = !toggle.checked;

      // = true;
      console.log("wideTf.value",document.getElementById('nav-toggle').checked);
      wideTf.value = !wideTf.value; 

    }
    const logoutClick = () => {

      authStore.clearAccessToken();
      utils.showAlert('alert',"로그아웃 되었습니다");
      //router.push('/'); 

    }

    onMounted( ()=>{
      mountFn();

    })
    // 컴포넌트의 return으로 필요한 상태와 함수를 반환
    return {
      activeButton,
      logoutClick,
      navigate,
      userNm,
      userPic,
      wideTf,
      fnWideTf
    };
  },
};
</script>

<style scoped>
#nav-bar {
  display: flex;
  flex-direction: column;
  /* 스타일 설정 추가 */
}

.wideT-div{
  height : 100%;
  display: flex;
  align-items: center;          /* 수직 중앙 정렬 */
  justify-content: center;      /* 수평 중앙 정렬 */
}
.inline-span {
  display: inline-block;        /* span을 inline-block으로 설정 */
  vertical-align: middle;       /* 텍스트와 아이콘이 수직으로 맞춰지도록 설정 */
}
</style>

<template>
<!-- 팝업 -->
    <div class="popup-overlay">
      <div class="popup">
        <h3>고객추가</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>고객명</th>
              <th>전화번호</th> 
              <th>카카오 ID</th> 
              <th>구글 ID</th>
              <th>플래너</th>
              <th>예약 날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td contenteditable="true" id = "CUST_NM"></td>
              <td contenteditable="true" id = "CUST_TEL" @input="formatPhoneNumber"></td>
              <td contenteditable="true" id = "CUST_KAID"></td>
              <td contenteditable="true" id = "CUST_GOOID"></td>
              <td contenteditable="true" id = "PLANNER_NM"></td>
              <td contenteditable="true" id = "RESV_DT"></td>
            </tr>
          </tbody>
        </table>
        <button @click="savePopup">저장</button>
        <button @click="closePopup">닫기</button>
      </div>
    </div>
</template>

<script>
import supabase  from '../js/supabase.js'; // main.js 또는 별도 파일에서 `supabase` 가져오기

export default {
  
  name: 'CustAddPop',
  setup(){
    
  },
  props: {
    
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Popup Title'
    },
    message: {
      type: String,
      default: 'This is a message in the popup.'
    }
  },
  methods: {
    closePopup() {
      this.$emit('fn_custAddPop', false); // 부모 컴포넌트로 팝업 닫기 이벤트 전달
    },
    savePopup() {

      const telNo = document.getElementById('CUST_TEL').innerText;
      

      if(telNo.length != 13) {
        alert("전화번호 형식이 틀렸습니다."); 
        return;
      }
      this.custAdd();
      
    
    },
    async custAdd (){
      const telNo = document.getElementById('CUST_TEL').innerText;

      const custInfo = {
        CUST_CD: document.getElementById('CUST_NM').innerText +telNo.substring(4,13).replace("-","")  ,
        CUST_NM: document.getElementById('CUST_NM').innerText,
        CUST_TEL: document.getElementById('CUST_TEL').innerText,
        CUST_KAID: document.getElementById('CUST_KAID').innerText,
        CUST_GOOID: document.getElementById('CUST_GOOID').innerText,
        PLANNER_NM: document.getElementById('PLANNER_NM').innerText,
        RESV_DT: document.getElementById('RESV_DT').innerText,
        USER_ID : "auddnjssk"
        
      };

      try {
          const { data, error } = await supabase
            .from('T_CUSTOMER_INFO')
            .insert([
              { CUST_CD: document.getElementById('CUST_NM').innerText +telNo.substring(4,13).replace("-","")  ,
        CUST_NM: document.getElementById('CUST_NM').innerText,
        CUST_TEL: document.getElementById('CUST_TEL').innerText,
        CUST_KAID: document.getElementById('CUST_KAID').innerText,
        CUST_GOOID: document.getElementById('CUST_GOOID').innerText,
        PLANNER_NM: document.getElementById('PLANNER_NM').innerText,
        
        USER_ID : "auddnjssk"}
            ]);

          if (error) {
            console.error("Insert Error:", error);
          } else {
            alert("저장되었습니다");
            this.$emit('fn_custAddPop', "save", custInfo); // 부모 컴포넌트로 팝업 닫기 이벤트 전달
            console.log("Insert Success:", data);
          }
      } catch (error) {
        alert("실패함"+error);
        console.error("Unexpected error:", error);
      }

    },
    formatPhoneNumber(event) {
    const target = event.target;
    let input = target.innerText.replace(/\D/g, ''); // 숫자만 남김

    if (input.startsWith('010')) {
      // 입력이 010으로 시작하면 010-0000-0000 형태로 포맷팅
      if (input.length > 3 && input.length <= 7) {
        input = input.replace(/(\d{3})(\d+)/, '$1-$2');
      } else if (input.length > 7) {
        input = input.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
      }
    } else {
      // 그 외는 기본 포맷팅 (필요 시 다른 형식 적용 가능)
      if (input.length > 3 && input.length <= 6) {
        input = input.replace(/(\d{3})(\d+)/, '$1-$2');
      } else if (input.length > 6) {
        input = input.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
      }
    }

    // 포맷팅한 값을 적용
    target.innerText = input;

    // 커서 위치 조정
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  }
}
</script>

<style>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
button {
  margin-top: 10px;
}
</style>
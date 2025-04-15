<template>
    <!-- 메인 콘텐츠 영역 -->
    <div class="main-page">
      <ProgressBar :currentStep="currentStep" :steps="steps" />
      <!-- 컨앞츠 -->
      <div class="contents">
        <!-- Modal 컴포넌트 사용 -->
        <!-- <ManualTransmitPop
          v-if="!showList && Object.keys(selectedRow).length > 0"
          :isVisible="showPopup"
          :selectedRow="selectedRow"
        /> -->
        <div v-if="showList">
          <!-- 테이블 형식으로 데이터 출력 -->
          <table v-if="paginatedData.length" class="data-table">
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
              <tr @click="trClick(item)" v-for="item in paginatedData" :key="item.FORM_ID">
                <td class="td" contenteditable="true">{{ item.CUST_NM }}</td>
                <td class="td" contenteditable="true">{{ item.CUST_TEL }}</td>
                <td class="td" contenteditable="true">{{ item.CUST_KAID }}</td>
                <td class="td" contenteditable="true">{{ item.CUST_GOOID }}</td>
                <td class="td" contenteditable="true">{{ item.PLANNER_NM }}</td>
                <td class="td" contenteditable="true">{{ item.RESV_DT }}</td>
              </tr>
            </tbody>
          </table>
          <div class="div-paging">
            <button @click="prevPage" :disabled="currentPage === 1">이전</button>
            <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
            <p>페이지 {{ currentPage }} / {{ totalPages }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import supabase from '@components/js/supabase.js';
  import ProgressBar from '@components/Common/ProgressBar.vue';
  
  export default {
    name: 'ItemList',
    props: {
      sendDataToParent: {
        type: Function,
        required: true, // 부모로부터 함수를 전달받아야 함
      },
    },
    data() {
      return {
        currentStep: 1, // 현재 단계
        steps: ['고객 선택', '계약서', '메일 양식', '미리 보기'], // 단계 이름
        items: [],
        showList: true,
        showPopup: false,
        selectedRow: {},
        currentPage: 1,
        itemsPerPage: 20,
      };
    },
    computed: {
      paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.items.length / this.itemsPerPage);
      },
    },
    components: {
      ProgressBar,
    },
    methods: {
      async fetchItems() {
        try {
          const { data, error } = await supabase.from('T_CUSTOMER_INFO').select('*');
          if (error) console.error('데이터 조회 중 오류:', error);
          else this.items = data;
        } catch (error) {
          console.error('예기치 않은 오류:', error);
        }
      },
      prevStep() {
        if (this.currentStep > 0) this.currentStep--;
      },
      nextStep() {
        if (this.currentStep < this.steps.length - 1) this.currentStep++;
      },
      trClick(item) {
        this.sendDataToParent(item,1,"next");
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
    },
    mounted() {
      this.fetchItems();
    },
  };
  </script>
  
  
  <style scoped>
  .main-page {
    flex: 0 0 85%;
    width: 100%;
    height: 100%;
  }
  .contents {
    padding: 10px;
    width: 100%;
    height: auto;
  }
  .titleCon {
    display: flex;
    align-items: center;
    font-size: 35px;
    width: 100%;
    height: 10%;
  }
  .title {
    width: 100%;
  }
  .addBtn {
    width: 120px;
    height: 50px;
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  .data-table th,
  .data-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
  }
  .data-table tbody tr:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
  .div-paging {
    text-align: center;
    margin-top: 10px;
  }
  .div-paging button {
    margin: 0 5px;
  }
  </style>
  
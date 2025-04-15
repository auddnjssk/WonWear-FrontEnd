<template>
  <!-- 팝업 -->
  <div v-if="Object.keys(selectedRow).length > 0">
    <div>
      <h3>고객추가</h3>
      <!-- Content -->
      <div class="contents">
        <div>고객명: {{ selectedRow.CUST_NM }}</div>
        <div>전화번호: {{ selectedRow.CUST_TEL }}</div>
        <!-- 추가 정보는 필요에 따라 표시 가능 -->
        <div class="list-div" v-if="showList">
          <!-- Table-like Header -->
          <div class="list-header">
            <div class="list-header-item"> PDF 양식</div>
          </div>
          <!-- Table-like Rows -->
          <div
            class="list-item"
            v-for="item in paginatedData"
            :key="item.FORM_ID"
            @click="listClick(item)"
          >
            <div class="list-item-value">{{ item.FORM_TITLE }}</div>
          </div>
        </div>
        <div class="div-paging">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          <p>Page {{ currentPage }} of {{ totalPages }}</p>
        </div>
      </div>
      <button @click="savePopup">저장</button>
      <button @click="closePopup">닫기</button>
    </div>
  </div>
</template>

<script>
import utils from '@components/js/utils.js';
import supabase from '@components/js/supabase.js';

export default {
  name: 'CustAddPop',
  props: {
    selectedRow: {
      type: Object,
      default: () => ({}), // 기본값으로 빈 객체 설정
    },
  },
  data() {
    return {
      items: [],
      showList: true,
      showEditor: false,
      currentPage: 1,
      itemsPerPage: 20,
      selectForm: [],
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
  methods: {
    async fetchItems() {
      try {
        const { data, error } = await supabase.from('T_FORM').select('*');
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('data==>', data);
          this.items = data;
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    },
    listClick(item) {
      try {
        console.log('부모==>', this.selectedRow);
        console.log('item==>', item);
        const JsonData = {
          // 고객정보
          CUST_CD: this.selectedRow.CUST_CD,
          CUST_GOOID: this.selectedRow.CUST_GOOID,
          CUST_KAID: this.selectedRow.CUST_KAID,
          CUST_NM: this.selectedRow.CUST_NM,
          CUST_TEL: this.selectedRow.CUST_TEL,
          PLANNER_NM: this.selectedRow.PLANNER_NM,
          RESV_DT: this.selectedRow.RESV_DT,
          USER_ID: this.selectedRow.USER_ID,
          // 폼 정보
          FORM_DETAIL: item.FORM_DETAIL,
          FORM_ID: item.FORM_ID,
          FORM_TITLE: item.FORM_TITLE,
        };

        utils.methods.aSyncPostApi('/google/sendMail', JsonData);
      } catch (error) {
        console.error('There was an error during listClick:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    formAdd() {
      this.showEditor = !this.showEditor;
      this.showList = !this.showList;
    },
    closePopup() {
      this.$emit('close'); // 부모 컴포넌트로 팝업 닫기 이벤트 전달
    },
    savePopup() {
      console.log('selectedRow:', this.selectedRow); // 부모로부터 전달받은 데이터 확인
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  mounted() {
    this.fetchItems();
  },
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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

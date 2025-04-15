<template>
  <div class="main-page">
    <header class="glb-fixed-header">
      <a>양식 리스트</a>
      <div class="glb-header-right-div">
        <button 
          class="glb-button" 
          style="width: 60px;"
          @click="deleteForm()"
        >삭제
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="glb-contents">
      <!-- 목록 -->
      <div class="glb-list-div">
        <div class="glb-list-header">
          <div class="list-header-item">PDF 양식 제목</div>
        </div>
        <div 
          class="list-item" 
          v-for="item in paginatedData" 
          :key="item.form_id" 
          @click="listClick(item.form_id)"
        >
          <div class="list-item-value">{{ item.form_title }}</div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="div-paging">
        <button 
          class="glb-button-small" 
          @click="prevPage" 
          :disabled="currentPage === 1"
        >
          이전
        </button>
        <span
          class="paging-span"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </span>
        <button 
          class="glb-button-small" 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
        >
          다음
        </button>
      </div>
    </div>
    <!-- ContentEnd -->
  </div>
</template>

<script>
import { ref, computed, onMounted, defineComponent , toRefs } from 'vue';
import * as utils from "@js/utils.js";

export default defineComponent({
  name: 'FormManagement',
  props: {
    listNeditFn: {
        type: Function,
        required: true,
      },
  },
  setup(props) {
    const { listNeditFn } = toRefs(props);

    // State 관리
    const currentPage = ref(1);
    const itemsPerPage = ref(18);
    const tableName = ref('t_form');
    const returnUrl = ref('/formManagement');
    const isPopupVisible = ref(false);
    const items = ref([]);
    const content = ref('');
    const formId = ref();
    

    // 데이터 가져오기
    const fetchItems = async () => {

      console.log("fetchItems!!",(navigator.userAgent));

      utils.aSyncGetApi("/formManagement")
        .then((response) => {
          console.log("fetch ! response",response);
          items.value = response.result;
        });
    };

    // 페이징처리
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      console.log(items.value , end);
      return items.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(items.value.length / itemsPerPage.value);
    });

    // Methods ------------------------------------
    const toggleForm = () => {
      fetchItems();
    };

    const goToPage = (page) => {
      currentPage.value = page;
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    const listClick = async (form_id) => {
      listNeditFn.value(form_id);
    };

    onMounted(() => {
      fetchItems();
    });

    return {
      currentPage,
      itemsPerPage,
      tableName,
      returnUrl,
      isPopupVisible,
      items,
      content,
      fetchItems,
      paginatedData,
      totalPages,
      toggleForm,
      goToPage,
      prevPage,
      nextPage,
      listClick,
      formId
    };
  },
});
</script>
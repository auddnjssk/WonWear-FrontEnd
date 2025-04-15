<template>
  <div class="main-page">
    <!-- title -->
    <div class="glb-titleCon">
      <div class="title">계약서 미리보기 및 수정</div>
      <button 
        class="glb-button-title" 
        @click="generatePdf"
        v-if="showEditor"
      >
        PDF 미리보기
      </button>
      <button 
        class="glb-button-title" 
        @click="toggleForm"
      >
        {{ showEditor ? '목록으로 가기' : '양식 추가' }}
      </button>
    </div>
    <!-- titleEnd -->

    <!-- Content -->
    <div class="glb-contents">
      <!-- CKEditor -->
      <CKEditor 
        v-if="showEditor" 
        ref="cKEditorRef" 
        :formId="formId.value"
        :toggleForm="toggleForm"
      />
      
      <!-- 목록 -->
      <div class="glb-list-div" v-if="showList">
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
import { ref, computed, onMounted, nextTick ,defineComponent } from 'vue';
//import supabase from '../js/supabase.js'; // Supabase 연결
import CKEditor from '@/components/SideMenu/formManagementComp/PdfForm.vue';
import * as utils from "@js/utils.js";

export default defineComponent({
  name: 'FormManagement',
  components: {
    CKEditor,
  },
  setup() {
    // State 관리
    const cKEditorRef = ref(null); // 자식 컴포넌트 참조
    const currentPage = ref(1);
    const itemsPerPage = ref(18);
    const tableName = ref('t_form');
    const returnUrl = ref('/formManagement');
    const isPopupVisible = ref(false);
    const items = ref([]);
    const showList = ref(true);
    const showEditor = ref(false);
    const content = ref('');
    const formId = ref();

    // 페이징처리
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return items.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(items.value.length / itemsPerPage.value);
    });

    // Methods ------------------------------------
    const toggleForm = () => {
      fetchItems();
      showEditor.value = !showEditor.value;
      showList.value = !showList.value;
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
      
      formId.value = form_id;
      
      toggleForm();

      await nextTick(); // 자식 컴포넌트 DOM 업데이트 대기

      cKEditorRef.value.setHeight(formId);

      // // 자식 컴포넌트의 메서드 호출
      // if (cKEditorRef.value && cKEditorRef.value.formIdInput) {
      //   cKEditorRef.value.formIdInput(form_id, tableName.value);
      // }
    };

    onMounted(() => {
      fetchItems();
    });

    return {
      cKEditorRef, // 자식 컴포넌트 참조 반환
      currentPage,
      itemsPerPage,
      tableName,
      returnUrl,
      isPopupVisible,
      items,
      showList,
      showEditor,
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

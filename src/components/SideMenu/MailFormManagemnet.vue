<template>
  <div class="main-page">
    <!-- title -->
    <div class="glb-titleCon">
      <div class="title">메일 양식 관리</div>  
      <button class="glb-button-title" @click="formAdd">
        {{ showEditor ? '목록으로 가기' : '양식 추가' }}
        </button>
    </div>
    <!-- titleEnd -->

    <!-- Content -->
    <div class="glb-contents">
      <CKEditor 
        v-if="showEditor" 
        ref="childRef" 
        :tableName = "tableName"/>
      <!-- 목록 -->
      <div class="glb-list-div" v-if="showList">
        <div class="glb-list-header">
          <div class="list-header-item">메일 양식 제목</div>
        </div>
        <div class="list-item" v-for="item in paginatedData" :key="item.form_id" @click="listClick(item.form_id)">
          <div class="list-item-value">{{ item.form_title }}</div>
        </div>
      </div>

      <div class="div-paging">
        <button class ="glb-button-small" @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span
          class = "paging-span"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)">
          {{ page }}
        </span>
        <button class ="glb-button-small" @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>
    <!-- ContentEnd -->
  </div>
</template>

<script>
import '@assets/globStyles.css'
import { ref, onMounted, nextTick } from 'vue';
import supabase from '../js/supabase.js'; // Assuming you import supabase
import CKEditor from '@common/CKEditor.vue'; // Assuming you import CKEditor component

export default {
  name: 'MailFormManagemnet',
  components: {
    CKEditor
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 18,
      tableName : "t_mail_form",
    };
  },
  setup() {
    const items = ref([]);
    const showList = ref(true);
    const showEditor = ref(false);

    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('t_mail_form')
          .select('*');
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          items.value = data;
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    const formAdd = () => {
      showEditor.value = !showEditor.value;
      showList.value = !showList.value;
    };

    onMounted(() => {
      fetchItems();
    });

    return {
      items,
      formAdd,
      showList,
      showEditor
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
    goToPage(page) {
      this.currentPage = page; // 선택된 페이지로 이동
      console.log(`Moved to page: ${page}`);
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
    async listClick(FORM_ID) {
      this.formAdd();
      await nextTick();

      if (this.$refs.childRef && this.$refs.childRef.formIdInput) {
        this.$refs.childRef.formIdInput(FORM_ID,this.tableName);
      } else {
        console.warn("CKEditor reference is not available or formIdInput method is undefined.");
      }
    }
  }
};
</script>
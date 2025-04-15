<template>
  <!-- Main content area -->
  <div class="main-page">

        <!-- Menu title -->
        <div class="titleCon">
      <div class="title">메일 양식 관리</div>  
      <button class="addBtn" @click="formAdd">
        {{ showEditor ? '목록으로 가기' : '양식 추가' }}
      </button>    
    </div>

    <hr style="width: 100%;" />ㅍ
    <!-- Content -->
    <div class="contents">
      <CKEditor v-if="showEditor" ref="childRef" :tableName="tableName" />
      <div class="list-div" v-if="showList">
        <!-- Table-like Header -->
        <div class="list-header">
          <div class="list-header-item">메일양식 제목</div>
        </div>
        <!-- Table-like Rows -->
        <div class="list-item" v-for="item in paginatedData" :key="item.FORM_ID" @click="listClick(item.FORM_ID)">
          <div class="list-item-value">{{ item.FORM_TITLE }}</div>
        </div>
      </div>
      <div class="div-paging">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import supabase from '../js/supabase.js'; // Assuming you import supabase
import CKEditor from '../SideMenu/formManagement/CKEditor.vue'; // Assuming you import CKEditor component

export default {
  name: 'ItemList',
  components: {
    CKEditor
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 20,
      tableName : "T_MAIL_FORM",
    };
  },
  setup() {
    const items = ref([]);
    const showList = ref(true);
    const showEditor = ref(false);

    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('T_MAIL_FORM')
          .select('*');
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('fetchItems:',data);
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

<style>
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
.list-div {
  padding: 10px;
  width: 100%;
  height: auto;
}
.list-header {
  display: flex;
  font-weight: bold;
  background-color: #ccc;
  padding: 5px;
}
.list-header-item {
  flex: 1;
  padding: 5px;
  text-align: center;
}
.list-item {
  display: flex;
  padding: 5px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.list-item-value {
  flex: 1;
  padding: 5px;
  text-align: center;
}
.div-paging {
  text-align: center;
  margin-top: 10px;
}
.div-paging button {
  margin: 0 5px;
}
</style>

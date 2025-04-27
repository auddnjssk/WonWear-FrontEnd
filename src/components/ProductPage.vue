<template>
  <div class="ProductPage">
    <div class = "menuLine">
      <a>HOME ></a>
      <a>{{ mainMenu }} ></a>
      <a>{{ subMenu }} </a>
       
    </div>

    <!-- ProductPage Content -->
    <div class="glb-contents">
      <div class = "exposeCont">
          <!-- <a>new 5%</a> -->
          <div class = "tripleImage"
            v-for = "items in itemsList"
            :key="items.items_id"
            @click="itemClick(items.items_id)">
            <div class = "exposeImagesCont">
              <img class="exposeImages" :src="`http://localhost:8082/Chumbnail/${items.items_id}.jpg`"  alt="background" />
              <a>{{ items.item_name }}</a>
              <hr>
              <a>{{ items.item_price }} {{ items.item_addinfo }}</a>
            </div>
          </div>
      </div>
    </div>
      
    <!-- ProductPage ContentEnd -->
  </div>
</template>

<script>
import '@assets/globStyles.css'
import { ref, onMounted, nextTick } from 'vue';
import { useRoute , useRouter } from 'vue-router';
import utils from '@js/utils.js'

export default {
  name: 'ProductPage',
  components: {
  },
  data() {
  },
  setup() {

    const route = useRoute();
    const router = useRouter();

    const backgroundImage = 'https://placehold.co/1000x400?text=Background'
    const items = ref([]);
    const showList = ref(true);
    const showEditor = ref(false);
    const mainMenu = route.params.main;
    const subMenu = route.params.sub;

    const itemsList = ref([]);  
    
    const fetchItems = async () => {
      console.log("mainMenu!!",mainMenu);
      console.log("subMenu!!",subMenu);
      const result = await utils.aSyncGetApi('/items',"main=" +mainMenu + "&sub=" + subMenu);
      console.log("result.result!!",result.result);
      itemsList.value = result.result;


    };

    const itemClick = (items_id) => {
      router.push(`/detailsPage/${items_id}`);


    }

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
      showEditor,
      backgroundImage,
      useRoute,
      mainMenu ,
      subMenu,
      itemsList,
      itemClick,
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

<style scoped>
.exposeCont {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}

.tripleImage {
  cursor: pointer;
  flex: 0 0 calc(33.333% - 20px);
  box-sizing: border-box;
  background: #eee;
  padding: 20px;
  text-align: center;
}

.exposeImagesCont {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.exposeImagesCont img {
  width: 100%;
  height: 400px;
  margin-bottom: 10px;
}

.exposeImagesCont a {
  color: black;
}

.exposeImagesCont hr {
  border: none;
  border-top: 2px solid #ccc;
  margin: 5px 0;
  width: 80%;
}


</style>
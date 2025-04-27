<template>
  <div class="main-page">

    <!-- Main Content -->
    <div class="glb-contents">

      <div class = "exposeCont">
          <!-- <a>new 5%</a> -->
          <div class = "tripleImage">
            <div class = "exposeImagesCont">
              <img class="exposeImages" :src="backgroundImage" alt="background" />
              <a>상품명</a>
              <hr>
              <a>63,000원</a>
            </div>
            <div class = "exposeImagesCont">
              <img class="exposeImages" :src="backgroundImage" alt="background" />
              <a>상품명</a>
              <hr>
              <a>63,000원</a>
            </div>            <div class = "exposeImagesCont">
              <img class="exposeImages" :src="backgroundImage" alt="background" />
              <a>상품명</a>
              <hr>
              <a>63,000원</a>
            </div>
          </div>
      </div>

    </div>
      
    <!-- Main ContentEnd -->
  </div>
</template>

<script>
import '@assets/globStyles.css'
import { ref, onMounted, nextTick } from 'vue';

export default {
  name: 'MainPage',
  components: {
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 18,
      tableName : "t_mail_form",
    };
  },
  setup() {
    
    const backgroundImage = 'https://placehold.co/1000x400?text=Background'
    const items = ref([]);
    const showList = ref(true);
    const showEditor = ref(false);

    // const fetchItems = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('t_mail_form')
    //       .select('*');
    //     if (error) {
    //       console.error('Error fetching data:', error);
    //     } else {
    //       items.value = data;
    //     }
    //   } catch (error) {
    //     console.error('Unexpected error:', error);
    //   }
    // };

    const formAdd = () => {
      showEditor.value = !showEditor.value;
      showList.value = !showList.value;
    };

    onMounted(() => {
      //fetchItems();
    });

    return {
      items,
      formAdd,
      showList,
      showEditor,
      backgroundImage
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

.quadraImage {
  padding-top: 100px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.quadraImage img{
  flex: 1;
  height: 100px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 8px;
}
.exposeCont{
  padding-top: 100px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.tripleImage{
  display: flex;
  width: 100%;
}
.exposeImagesCont{
  padding-top: 100px;
  flex: 1; /* 자동으로 같은 너비 차지 */
  color: white;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  flex-direction: column; /*세로로 정렬*/
}
.exposeImagesCont a{
 color: black; 
}

.exposeImagesCont hr{
  border: none;
  border-top: 2px solid #ccc; /* 선 두께 및 색상 지정 */
  margin: 5px 0;              /* 위아래 간격 */
  width: 80%;

}



.exposeImagesCont .exposeImages{
  padding-top: 100px;
  flex: 1; /* 자동으로 같은 너비 차지 */
  color: white;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
}


</style>
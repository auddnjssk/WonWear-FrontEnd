<template>
  <div class="ProductPage">
    <div class = "menuLine">
      <a>HOME ></a>
      <a>{{ mainMenu }} ></a>
      <a>{{ subMenu }} </a>
      <!-- 어드민 YN 추가해야됨 -->
       <button @click = "addItem()">아이템추가</button>
    </div>

    <!-- ProductPage Content -->
    <div class="glb-contents">
      <div class = "exposeCont">
          <!-- <a>new 5%</a> -->
          <div class = "tripleImage"
            v-for = "items in itemsList"
            :key="items.item_id"
            @click="itemClick(items.item_id)">
            <div class = "exposeImagesCont">
              <img class="exposeImages" 
                @error="handleImageError" 
                :src="`http://localhost:8082/Chumbnail/${items.item_id}_1.png`"   
                alt="background" />
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

<script setup>
  import '@assets/globStyles.css'
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import utils from '@js/utils.js';

  const route = useRoute();
  const router = useRouter();


  const itemsList = ref([]);

  // const showList = ref(true);
  // const showEditor = ref(false);

  const mainMenu = route.params.main;
  const subMenu = route.params.sub;

  // 페이지네이션 상태
  // const currentPage = ref(1);
  // const itemsPerPage = 10;

  // const paginatedData = computed(() => {
  //   const start = (currentPage.value - 1) * itemsPerPage;
  //   const end = start + itemsPerPage;
  //   return itemsList.value.slice(start, end);
  // });

  // const totalPages = computed(() => {
  //   return Math.ceil(itemsList.value.length / itemsPerPage);
  // });

  // // ref를 통한 자식 컴포넌트 접근
  // const childRef = ref(null);
  // const tableName = ref(''); // 필요한 경우 설정

  // // 페이지 이동 함수
  // const goToPage = (page) => {
  //   currentPage.value = page;
  // };

  // const prevPage = () => {
  //   if (currentPage.value > 1) {
  //     currentPage.value--;
  //   }
  // };

  // const nextPage = () => {
  //   if (currentPage.value < totalPages.value) {
  //     currentPage.value++;
  //   }
  // };

  const handleImageError = (event) => {

    const extensions = ['jpg', 'jpeg', 'png'];
    const currentSrc = event.target.src;
    const baseName    = currentSrc.substring(0, currentSrc.lastIndexOf('.'));
    const currentExt  = currentSrc.substring(currentSrc.lastIndexOf('.') + 1);
    const nextIndex   = extensions.indexOf(currentExt.toLowerCase()) + 1;

    if (nextIndex < extensions.length) {
      event.target.src = `${baseName}.${extensions[nextIndex]}`;
    } else {
      event.target.src = 'http://localhost:8082/Chumbnail/default.png'; // 기본 이미지
    }
  }

  const addItem = () => {
    router.push(`/addItem/${mainMenu}/${subMenu}`);
  };


  // API 호출
  const fetchItems = async () => {
    const result = await utils.aSyncGetApi('/items', `main=${mainMenu}&sub=${subMenu}`);
    itemsList.value = result.result;
    console.log("itemsList.value",itemsList.value);
  };

  // 목록 아이템 클릭 → 상세 페이지로 이동
  const itemClick = (items_id) => {
    router.push(`/detailsPage/${items_id}`);
  };

  onMounted(() => {
    fetchItems();
  });
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
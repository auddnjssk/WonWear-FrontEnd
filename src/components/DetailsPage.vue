<template>
  <div class="ProductPage">
    <!-- ProductPage Content -->
    <div class="glb-contents">
      <div class = "chumbnail">
        <div class = "chumbnail-content">
          <img style ="width: 100%;" class="exposeImages" :src="`http://localhost:8082/Chumbnail/${itemsId}.jpg`"  alt="background" />
        </div>
        <div class = "chumbnail-content">
          <a>{{itemName}}</a>
              
          <hr>
          
          <a>소비자가 : {{itemPriceFomt}}</a>
          
          <hr>
          
          <a>판매가 : {{itemPriceFomt}}</a>
          
          <hr style="width:100%">
          <a>색상 : </a>
          <select v-model="selectedColor" id="colorCombo">
            <option disabled value="">색상을 선택하세요</option>
            <option v-for="color in itemColor" :key="color" :value="color.item_detail">
              {{ color.item_detail }}
            </option>
          </select>

          <br>
          <hr style="width:100%">
          <a>사이즈 : </a>
          <select v-model="selectedSize" id="colorCombo">
            <option disabled value="">색상을 선택하세요</option>
            <option v-for="size in itemSize" :key="size" :value="size.item_detail">
              {{ size.item_detail }}
            </option>
          </select>
          <br>
          <hr style="width:100%">

          <a>(최소주문수량 1개 이상)</a> <br>
          <a>위 옵션선택 박스를 선택하시면 아래에 상품이 추가됩니다.</a>

          <hr>
          
          <!-- 선택된 색상과 사이즈 출력 -->
          <div class="quantity-div" v-for="(selectItem, index) in selectedItem" :key="index">
            <div class="quantity-title">
              <a>{{itemName}}</a><br>
              <a>{{ selectItem.color }} - {{ selectItem.size }}</a>
            </div>
            <div class="quantity">
              <input type="number" v-model.number="selectItem.quantity" min="1" style="width: 60px; margin: 5px;"/>
              <button @click="removeItem(index)" style="background: #ccc; border: none; padding: 4px 8px; cursor: pointer;">X</button>
            </div>
          </div>

          <hr>
          <a style="margin: 10px;">TOTAL : {{totalPrice}}</a>
          
          <div>
            <div class="Buy-Button-Div"> 
              <button class="Buy-Button" style="width:100%; background: #333; color:white" @click="buyButton()" >BUT IT NOW</button>
            </div>
            <div class="Buy-Button-Div">
              <button class="Buy-Button">ADD TO CART</button>
              <button class="Buy-Button">WISH LIST</button>
            </div>
          </div>
        </div>

      </div>

      <hr>
      <!-- 본문  -->
      
      <div>
        <a>PRODUCT DETAIL</a>
        <img 
          style ="width: 100%;" 
          class="exposeImages" 
          v-for = 'itemImage in itemsList'
          :key='itemImage.key'
          :src=itemImage.src  
          alt="background" />
          
      </div>
    </div>
    <!-- ProductPage ContentEnd -->
  </div>
</template>

<script>
import '@assets/globStyles.css'
import { ref, onMounted, nextTick,watch } from 'vue';
import { useRoute , useRouter } from 'vue-router';
import utils from '@js/utils.js'

export default {
  name: 'DetailsPage',
  components: {
  },
  data() {
  },
  setup() {
    
    const route = useRoute();
    const router = useRouter();

    const itemName = ref(null);
    const itemPrice = ref(null);
    const itemSize = ref([]);
    const itemColor = ref([]);
    const itemPriceFomt = ref(null);
    
    // 콤보에 선택된 값
    let selectedItemDelete = false;

    // 콤보에 선택된 값
    const selectedColor = ref("");
    const selectedSize  = ref("");
    const selectedItem  = ref([]);

    const showList = ref(true);
    const showEditor = ref(false);

    const itemsId = route.params.itemsId;
    const itemsList = ref([]);
    
    const totalPrice = ref(0);

    const fetchItems = async () => {

      const result = await utils.aSyncGetApi('/itemDetail',"itemsId=" +itemsId);
      const imageNumber = result.result[0].image_number;
      itemName.value    = result.result[0].item_name;
      itemPrice.value   = result.result[0].item_price;
      // 000,000 포매팅
      itemPriceFomt.value   = itemPrice.value.toLocaleString();
      itemSize.value = result.result[0].items_size;
      itemColor.value = result.result[0].items_color;

      console.log("itemsList.value",itemSize.value);
      console.log("itemsList.value",itemColor.value);

      for(let i=1 ; i <= imageNumber ; i++){
        console.log(i);
        const val = {
          key : i ,
          src : 'http://localhost:8082/itemDetails/' + itemsId+'_' + i + '.jpg',

        }
        itemsList.value.push(val);
      }
    };
    
    // 색상과 사이즈가 모두 선택되었을 때 발생할 이벤트
    watch([selectedColor, selectedSize], ([newColor, newSize] ) => {
      if (newColor && newSize) {
        // 이미 선택된 색상과 사이즈가 존재하는지 체크
        const existingItem = selectedItem.value.find(item => item.color === newColor && item.size === newSize);

        if (!existingItem) {
        const val = {
          color: newColor,
          size: newSize,
          quantity:1
        };
        selectedItem.value.push(val);

        console.log("selectedItem.value",selectedItem.value);

      }
        console.log(`선택된 색상: ${newColor}, 선택된 사이즈: ${newSize}` , selectedItem.value);
        // 예: 서버에 요청하거나 다른 동작을 실행
      }
    });
    watch(
      () => selectedItem.value, // selectedItem.value 배열을 감지
      (newItems, oldItems) => {
        console.log("newItems",selectedItem.value.length);
        console.log(utils.getPrototypeOf(newItems),`Item at`,oldItems);
        
        if(selectedItem.value.length > 0){
        
          totalPrice.value = null;
          // selectedItem의 내용이 변경될 때마다 실행됩니다.
          selectedItem.value.forEach((item) => {
            totalPrice.value = totalPrice.value + (itemPrice.value* item.quantity);
          });
          totalPrice.value   = totalPrice.value.toLocaleString();
        }else{
          totalPrice.value = 0
        }
      },
      { deep: true } // 배열 내 객체 속성까지 감지하려면 deep 옵션을 true로 설정해야 합니다.
    );
    const itemClick = (items_id) => {
      router.push(`/productPage/${items_id}`);
    }
    const buyButton = () => {
      console.log("selectedItem.value",selectedItem.value)
    }
    const removeItem = (idx) =>{
      selectedItemDelete = true;
      console.log("removeItem",selectedItem.value[idx])
      selectedItem.value.splice(idx, 1);
    }
    const formAdd = () => {
      showEditor.value = !showEditor.value;
      showList.value = !showList.value;
    };

    onMounted(() => {
      fetchItems();
    });
    return {
      formAdd,
      showList,
      showEditor,
      useRoute,
      itemsList,
      itemClick,
      itemsId,
      itemName,
      itemSize,
      itemColor, 
      selectedColor,
      selectedSize,
      itemPrice,
      selectedItem,
      totalPrice,
      buyButton,
      itemPriceFomt,
      removeItem,
      selectedItemDelete,
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
.chumbnail {
  display: flex;
  gap: 20px;
  width: 100%;
}
.chumbnail-content {
  flex: 1; /* 각각 50% */
  padding: 20px;
  box-sizing: border-box;
}

.Buy-Button-Div {
  padding : 2px;
  display: flex;
  box-sizing: border-box;
}

.Buy-Button-Div .Buy-Button{
  height : 40px;
  flex: 1; /* 각각 50% */
  box-sizing: border-box;
}
.quantity-div{
  display: flex;
  width: 100%;
}
.quantity-div .quantity-title{
  flex: 7; /* 각각 50% */
}
.quantity-div .quantity{
  flex: 3; /* 각각 50% */
}



</style>
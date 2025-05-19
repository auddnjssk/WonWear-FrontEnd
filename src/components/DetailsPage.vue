<template>
  <div class="ProductPage">
    <div class="glb-contents">
      <div class="chumbnail">
        <div class = "chumbnail-content">
          <div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              style="display: none;"
            />
            <img class="exposeImages" 
                style ="width: 100%;"
                @error="handleImageError" 
                :src="mainImageSrc"   
                alt="background" />
          </div>
          <div class="fiveImage">
            <div class="fiveImage-content">
              <!-- 이미지가 있는 곳 -->
              <div class="image-wrapper" v-for="(index) in image_number" :key="index">
                <img class="image" 
                  :src="`http://localhost:8082/Chumbnail/${itemsId}_${index}.png`"
                  @click="fiveImageClick(index)"   
                  alt="thumbnail" />
              </div>

              <!-- 이미지가 부족할 경우 빈 박스로 채움 -->
              <div
                class="image-wrapper empty"
                v-for="n in 5 - image_number"
                :key="'empty-' + n"
              />             
            </div>
            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
              <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>
          </div>

        </div>
        <div class="chumbnail-content">
          <a>{{ itemName }}</a>
          <hr>
          <a>소비자가 &ensp;: {{ itemPriceFomt }}</a>
          <hr>
          <a>판매가 &ensp;&ensp;&ensp;: {{ itemPriceFomt }}</a>
          <hr style="width:100%">
          <a>색상 &ensp;&ensp;&ensp;&ensp;&ensp;: </a>
          <select v-model="selectedColor">
            <option disabled value="">색상을 선택하세요</option>
            <option v-for="color in itemColor" :key="color.item_detail" :value="color.item_detail">
              {{ color.item_detail }}
            </option>
          </select>
          <br>
          <hr style="width:100%">
          <a>사이즈 &ensp;&ensp;&ensp;: </a>
          <select v-model="selectedSize">
            <option disabled value="">사이즈를 선택하세요</option>
            <option v-for="size in itemSize" :key="size.item_detail" :value="size.item_detail">
              {{ size.item_detail }}
            </option>
          </select>
          <br>
          <hr style="width:100%">

          <a>(최소주문수량 1개 이상)</a> <br>
          <a>위 옵션선택 박스를 선택하시면 아래에 상품이 추가됩니다.</a>
          <hr>

          <div class="quantity-div" v-for="(selectItem, index) in selectedItem" :key="index">
            <div class="quantity-title">
              <a>{{ itemName }}</a><br>
              <a>{{ selectItem.color }} - {{ selectItem.size }}</a>
            </div>
            <div class="quantity">
              <input type="number" v-model.number="selectItem.quantity" :key="index" min="1" style="width: 60px; margin: 5px;"/>
              <button @click="removeItem(index)" style="background: #ccc; border: none; padding: 4px 8px; cursor: pointer;">X</button>
            </div>
          </div>

          <hr>
          <a style="margin: 10px;">TOTAL : {{ totalPrice }}</a>

          <div>
            <div class="Buy-Button-Div">
              <button class="Buy-Button" style="width:100%; background: #333; color:white" @click="buyButton">BUY IT NOW</button>
            </div>
            <div class="Buy-Button-Div">
              <button @click = "addCart" class="Buy-Button">ADD TO CART</button>
              <button @click = "addWishList" class="Buy-Button">WISH LIST</button>
            </div>
          </div>
        </div>
      </div>

      <hr>

      <div>
        <a>PRODUCT DETAIL</a>
        <img style="width: 100%;" class="exposeImages" v-for="itemImage in itemsList" :key="itemImage.key" :src="itemImage.src" alt="background" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import utils from '@js/utils.js';
import { useAuthStore } from '@store/auth.js';
import { useRouter } from 'vue-router'; // useRouter 훅 임포트

const route = useRoute();
const image_number = ref('');
const itemsId = route.params.itemsId;
const itemName = ref('');
const itemPrice = ref(0);
const itemPriceFomt = ref('');
const itemSize = ref([]);
const itemColor = ref([]);
const itemsList = ref([]);

const selectedQuantity = ref('1');
const selectedColor    = ref('');
const selectedSize     = ref('');
const selectedItem     = ref([]);
const totalPrice       = ref(0);
const mainImageSrc     = ref(`http://localhost:8082/Chumbnail/${itemsId}_1.png`)

// 로그인체크 변수
const loginStat = ref(null); 
const oAuthYn = ref(null); 
const adminYn = ref(null); 
const router = useRouter();
const custStat = ref();

const authStore = useAuthStore();
authStore.syncWithLocalStorage();
const urlParams = new URLSearchParams(window.location.search);

const code = urlParams.get('code');

const fetchItems = async () => {
  const result = await utils.aSyncGetApi('/itemDetail', `itemsId=${itemsId}`);
  console.log("result",result);
  const data = result.result[0];
  itemName.value      = data.item_name;
  itemPrice.value     = data.item_price;
  itemPriceFomt.value = itemPrice.value.toLocaleString();
  itemSize.value      = data.items_size;
  itemColor.value     = data.items_color;
  image_number.value  = data.image_number;

  for (let i = 1; i <= data.image_number; i++) {
    itemsList.value.push({ key: i, src: `http://localhost:8082/ItemDetails/${itemsId}_${i}.jpg` });
  }
};

const handleImageError = (event) => {
  const extensions = ['jpg', 'jpeg', 'png'];
  const currentSrc = event.target.src;
  const baseName = currentSrc.substring(0, currentSrc.lastIndexOf('.'));
  const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.') + 1);
  const nextIndex = extensions.indexOf(currentExt.toLowerCase()) + 1;
  if (nextIndex < extensions.length) {
    event.target.src = `${baseName}.${extensions[nextIndex]}`;
  } else {
    event.target.src = 'http://localhost:8082/Chumbnail/default.png';
  }
};
const fiveImageClick = (index) => { 

  mainImageSrc.value = 'http://localhost:8082/Chumbnail/'+itemsId+'_'+index+'.png';


  console.log(index);
};

const addCart = async() => {
  console.log("loginStat",loginStat.value);

  if(selectedItem.value.length < 1){
    utils.showAlert("alert","제품을 선택해주세요");
    return;
  }

  // 로그인 상태라면 장바구니 서버에 저장,
  if(loginStat.value){
    const result = await utils.aSyncPostApi('/cart',selectedItem.value);
    console.log("result",result);

  }else{ // 로그인 상태가 아니라면 세션스토리지에 저장
    console.log("로그아웃");

  }
  
};
const addWishList = async() => {
  console.log("selectItem",selectedItem.value);
  
  
};

watch([selectedColor, selectedSize], ([newColor, newSize]) => {
  if (newColor && newSize) {
    const exists = selectedItem.value.find(item => item.color === newColor && item.size === newSize);
    console.log("exists",itemSize.value );
    if (!exists) {
      const size  = itemSize.value.find(itemSize => itemSize.item_detail === newSize);
      const color = itemColor.value.find(itemColor => itemColor.item_detail === newColor);
      console.log(size,"exists",color );
      selectedItem.value.push({ 
        color: newColor,
        size: newSize, 
        quantity: selectedQuantity.value,
        items_detail_id1 : size.items_detail_id,
        items_detail_id2 : color.items_detail_id,
      });
    }
  }
});

watch(selectedItem, (newItems) => {
  let total = 0;
  console.log("newItems",newItems);
  selectedItem.value = newItems;
  newItems.forEach(item => total += item.quantity * itemPrice.value);
  totalPrice.value = total.toLocaleString();
}, { deep: true });

const removeItem = (index) => {
  selectedItem.value.splice(index, 1);
};

const buyButton = () => {
  console.log("구매 상품:", selectedItem.value);
};


watch(() => authStore.accessToken, (newToken) => {

    adminYn.value = localStorage.getItem('adminYn');

    if (newToken) {
      loginStat.value = true;
      router.push('/'); 
    } else {
      loginStat.value = null;
      console.log('LeftMenu closed');
    }
  }
);
// 새로고침을 하더라도 토큰이 유효하면 로그인 유지
const accessTokenChk = () => {

  // 코드가 존재하면 팝업
  if(code){
    oAuthYn.value = true;

  }
  if(window.location.pathname.indexOf("cust") > 0){
    custStat.value = true;
    loginStat.value = null;
  }

  if (authStore.accessToken) loginStat.value = true;
  else  loginStat.value = null;
}
onMounted(() => {
  fetchItems();
  accessTokenChk();
});
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
.fiveImage {
  width: 100%;
  overflow: hidden;
}

.fiveImage-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.image-wrapper {
  flex: 1; /* 5개면 1씩 균등 분할 */
  padding: 5px; /* 이미지 사이 여백 */
  box-sizing: border-box;
}

.image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}

.image:hover {
  transform: scale(1.05);
  border-color: #333;
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


.input {
  padding: 2px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s, box-shadow 0.3s;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}


</style>
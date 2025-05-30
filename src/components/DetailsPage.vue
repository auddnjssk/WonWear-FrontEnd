<template>
  <div class="w-full">
    <div class="px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-5">
        <!-- 썸네일 업로드 섹션 -->
        <div class="lg:w-1/2 w-full p-4">
          <div class="relative">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />
            <img class="exposeImages" 
                style ="width: 100%;"
                @error="handleImageError" 
                :src="mainImageSrc"   
                alt="background" />
          </div>

          <div class="mt-4">
            <div class="flex gap-2">
              <div
                v-for="(chumbnail, index) in chumbnailList"
                @click = "fiveImageClick(index)"
                :key="index"
                class="w-1/5 cursor-pointer"
              >
                <img
                  @error="handleImageError"
                  :src="chumbnail?.src"
                  class="w-full rounded border"
                  alt="thumbnail"
                />
              </div>
              <div
                v-for="n in 5 - image_number"
                :key="'empty-' + n"
                
                class="w-1/5 bg-gray-100 border rounded h-20"
              ></div>
            </div>

            <div class="mt-2 flex justify-between">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="bg-gray-200 px-4 py-1 rounded"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="bg-gray-200 px-4 py-1 rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- 상품 정보 입력 섹션 -->
        <div class="lg:w-1/2 w-full p-4 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-600">
          <div class="font-bold py-4">
            <span>상품이름 :</span>
            <a type="text"
              class="w-full mt-2 px-3 py-2 text-sm border rounded focus:ring focus:ring-blue-200 focus:border-blue-400" >
              {{  itemName }}
            </a>
          </div>

          <div class="border-t pt-4">
            <div class="space-y-3">
              <div>
                <span>소비자가 :</span>
                <a
                  type="text"
                  class="ml-2 px-3 py-2 text-sm border rounded focus:ring focus:ring-blue-200 focus:border-blue-400"
                >
                {{ itemPriceFomt }}
              </a>
              </div>
              <div>
                <span>판매가 :</span>
                <a
                  type="text"
                  class="ml-2 px-3 py-2 text-sm border rounded focus:ring focus:ring-blue-200 focus:border-blue-400"
                >
                {{ itemSalePriceFomt }}
                </a>
              </div>

              <div>
                <span>색상 :</span>
                <select
                  v-model="selectedColor"
                  class="ml-2 px-3 py-2 text-sm border rounded focus:ring focus:ring-blue-200 focus:border-blue-400"
                >
                  <option disabled value="">색상을 선택하세요</option>
                  <option
                    v-for="color in itemColor"
                    :key="color"
                    :value="color.item_detail"
                  >
                    {{ color.item_detail }}
                  </option>
                </select>
              </div>

              <div>
                <span>사이즈 :</span>
                <select
                  v-model="selectedSize"
                  class="ml-2 px-3 py-2 text-sm border rounded focus:ring focus:ring-blue-200 focus:border-blue-400"
                >
                  <option disabled value="">사이즈를 선택하세요</option>
                  <option
                    v-for="size in itemSize"
                    :key="size"
                    :value="size.item_detail"
                  >
                    {{ size.item_detail }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="border-t py-4 text-sm text-gray-600">
            <p>(최소주문수량 1개 이상)</p>
            <p>위 옵션선택 박스를 선택하시면 아래에 상품이 추가됩니다.</p>
          </div>

          <!-- 옵션 선택 항목 -->
          <div
            v-for="(selectItem, index) in selectedItem"
            :key="index"
            class="flex justify-between items-center border-b py-2"
          >
            <div>
              <p class="font-semibold">{{ itemName }}</p>
              <p>{{ selectItem.color }} - {{ selectItem.size }}</p>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="number"
                v-model.number="selectItem.quantity"
                min="1"
                class="w-16 border rounded px-2 py-1"
              />
              <button
                @click="removeItem(index)"
                class="bg-gray-300 px-2 rounded"
              >
                X
              </button>
            </div>
          </div>

          <div class="my-4 text-right font-bold">TOTAL: {{ totalPrice }}</div>
          <div class="w-full max-w-sm mx-auto space-y-2">
            <!-- BUY IT NOW 버튼 -->
            <button @click="saveButton" class="w-full bg-gray-800 text-white font-semibold py-3 text-sm hover:bg-gray-700 transition">
              BUY IT NOW
            </button>

            <!-- ADD TO CART & WISH LIST 버튼 그룹 -->
            <div class="flex w-full">
              <button @click="addCart" class="w-1/2 border text-sm py-3 font-semibold text-gray-700 hover:bg-gray-100">
                ADD TO CART
              </button>
              <button class="w-1/2 border border-l-0 text-sm py-3 font-semibold text-gray-700 hover:bg-gray-100">
                WISH LIST
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 상세 이미지 -->
      <div class="border-t mt-8 pt-4">
        <h3 class="text-lg font-semibold mb-4">PRODUCT DETAIL</h3>
        <img
          v-for="itemImage in itemsList"
          :key="itemImage.key"
          :src="itemImage.src"
          class="w-full mb-2 rounded"
          alt="detail"
        />
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
const itemSalePrice = ref(0);
const itemPriceFomt = ref(0);
const itemSalePriceFomt = ref(0);
const itemSize = ref([]);
const itemColor = ref([]);
const itemsList = ref([]);

const chumbnailList = ref([]);

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
  itemSalePrice.value = data.item_salePrice;
  itemSalePriceFomt.value = itemSalePrice.value.toLocaleString();
  itemSize.value      = data.items_size;
  itemColor.value     = data.items_color;
  image_number.value  = data.image_number;

  for (let i = 1; i <= data.image_number; i++) {
    chumbnailList.value.push({ key: i, src: `http://localhost:8082/Chumbnail/${itemsId}_${i}.jpg` });
  }

  console.log("chumbnailList.value",chumbnailList.value)
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
  const imageIndex = index+1;
  mainImageSrc.value = 'http://localhost:8082/Chumbnail/'+itemsId+'_'+imageIndex+'.png';
  console.log("index",mainImageSrc.value);

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
    sessionStorage.setItem('guestCart', JSON.stringify(selectedItem.value));
  }
  
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
        itemsId : itemsId,
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

// const buyButton = () => {
//   console.log("구매 상품:", selectedItem.value);
// };


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
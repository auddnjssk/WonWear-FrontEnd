<template>
  <div class="w-full">
    <div class="px-4 py-8">
      <div class="flex gap-5">
        <!-- 썸네일 업로드 섹션 -->
        <div class="w-1/2 p-4">
          <div class="relative">
            <button @click="chumbnailAdd" class="absolute top-0 left-0 bg-gray-200 rounded px-2">+</button>
            <button @click="removeChumbnail" class="absolute top-0 left-8 bg-gray-200 rounded px-2">X</button>
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
            <img @click="addChumbnail" class="w-full rounded cursor-pointer" :src="chumbnailList[selectedChumbnail-1]?.imageUrl" alt="background" />
          </div>

          <div class="mt-4">
            <div class="flex gap-2">
              <div v-for="(chumbnail, index) in paginatedChumbnail" :key="index" class="w-1/5">
                <img :src="chumbnail?.imageUrl" class="w-full rounded border" alt="thumbnail" />
              </div>
              <div v-for="n in 5 - paginatedChumbnail.length" :key="'empty-' + n" class="w-1/5 bg-gray-100 border rounded h-20"></div>
            </div>

            <div class="mt-2 flex justify-between">
              <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-200 px-4 py-1 rounded">Previous</button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-200 px-4 py-1 rounded">Next</button>
            </div>
          </div>
        </div>

        <!-- 상품 정보 입력 섹션 -->
        <div class="w-1/2 p-4 border-t-2 border-gray-600">
          <div class="font-bold py-4 flex items-center gap-4">
            <span class="whitespace-nowrap">상품이름 :</span>
            <input type="text" class="input flex-1" v-model="itemName" placeholder="입력하세요" />
          </div>


          <div class="border-t pt-4">
            <div class="space-y-3">
              <div><span>소비자가 :</span><input type="text" class="input ml-2" v-model="price" placeholder="입력하세요" /></div>
              <div><span>판매가 :</span><input type="text" class="input ml-2" v-model="salePrice" placeholder="입력하세요" /></div>

              <div>
                <span>색상 :</span>
                <select v-model="selectedColor" class="input ml-2">
                  <option disabled value="">색상을 선택하세요</option>
                  <option v-for="color in itemColor" :key="color" :value="color.item_detail">{{ color.item_detail }}</option>
                </select>
                <input type="text" class="input ml-2" v-model="colorRef" placeholder="입력하세요" />
                <button @click="colorAdd" class="bg-gray-200 px-2 rounded ml-1">+</button>
                <button @click="removeColor" class="bg-gray-200 px-2 rounded ml-1">X</button>
              </div>

              <div>
                <span>사이즈 :</span>
                <select v-model="selectedSize" class="input ml-2">
                  <option disabled value="">사이즈를 선택하세요</option>
                  <option v-for="size in itemSize" :key="size" :value="size.item_detail">{{ size.item_detail }}</option>
                </select>
                <input type="text" class="input ml-2" v-model="sizeRef" placeholder="입력하세요" />
                <button @click="sizeAdd" class="bg-gray-200 px-2 rounded ml-1">+</button>
                <button @click="removeSize" class="bg-gray-200 px-2 rounded ml-1">X</button>
              </div>
            </div>
          </div>

          <div class="border-t py-4 text-sm text-gray-600">
            <p>(최소주문수량 1개 이상)</p>
            <p>위 옵션선택 박스를 선택하시면 아래에 상품이 추가됩니다.</p>
          </div>

          <!-- 옵션 선택 항목 -->
          <div v-for="(selectItem, index) in selectedItem" :key="index" class="flex justify-between items-center border-b py-2">
            <div>
              <p class="font-semibold">{{ itemName }}</p>
              <p>{{ selectItem.color }} - {{ selectItem.size }}</p>
            </div>
            <div class="flex items-center gap-2">
              <input type="number" v-model.number="selectItem.quantity" min="1" class="w-16 border rounded px-2" />
              <button @click="removeItem(index)" class="bg-gray-300 px-2 rounded">X</button>
            </div>
          </div>

          <div class="my-4 text-right font-bold">TOTAL: {{ totalPrice }}</div>

          <button @click="saveButton" class="w-full bg-black text-white py-2 rounded">저장</button>
        </div>
      </div>

      <!-- 상세 이미지 -->
      <div class="border-t mt-8 pt-4">
        <h3 class="text-lg font-semibold mb-4">PRODUCT DETAIL</h3>
        <img v-for="itemImage in itemsList" :key="itemImage.key" :src="itemImage.src" class="w-full mb-2 rounded" alt="detail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import '@assets/globStyles.css';
import { ref } from 'vue';

import { useRoute } from 'vue-router';

import utils from '@js/utils.js'

  let currentPage = 1;
  // const itemsPerPage = 5;

  const route = useRoute();
  const cateNo = route.params.cateNo;


  const selectedSize  = ref("");
  const selectedColor = ref("");
  const selectedChumbnail = ref(1);
  
  
  const chumbnailList      = ref([]);
  const paginatedChumbnail = ref([]);

  const itemColor = ref([]);
  const colorRef  = ref("");
  const itemSize  = ref([]);
  const sizeRef   = ref("");
  const price     = ref("");
  const salePrice = ref("");
  const itemName  = ref("");
  const fileInput = ref(null);

  let seqn = 1;

  const paginatedImages = (pagingYn) => {

    if(chumbnailList.value.length % 6 == 0 && !pagingYn) ++currentPage;

    const start = (currentPage - 1) * 5;
    const end = start + 5;
    const val =  chumbnailList.value.slice(start, end);
    
    paginatedChumbnail.value = [];
    
    for(const file of val){
      paginatedChumbnail.value.push(file);
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      paginatedImages(true);
    }
  }
    // 다음 페이지로 이동
  const nextPage = () =>{
     currentPage++;
     paginatedImages(true);
  }

  const chumbnailAdd = () => {
    fileInput.value.click()
  }

  const handleFileChange = (event) => {

    const file = event.target.files[0];
    
    if (file) {
      // 예: 미리보기 URL 만들기
      const imageUrl = URL.createObjectURL(file);
      const val = {
        imageUrl : imageUrl,
        file : file,
        seqn : seqn++,
      }
      chumbnailList.value.push(val);

      paginatedImages();
    }
  }

  const colorAdd = () => {
    
    const val = {
      item_detail : colorRef.value
    }
    itemColor.value.push(val);

    colorRef.value = "";
  }
  const sizeAdd = () => {
    
    const val = {
      item_detail : sizeRef.value
    }
    itemSize.value.push(val);

    sizeRef.value = "";

  }
  const removeColor = () => {
    
    const index = itemColor.value.find(itemColor => itemColor.item_detail === selectedColor.value);
    itemColor.value.splice(index, 1);

  }
  const removeSize = () => {
    
    const index = itemSize.value.find(itemSize => itemSize.item_detail === selectedSize.value);
    itemSize.value.splice(index, 1);

  }

  const addChumbnail = () => {
    console.log("addChumbnail");
  }

  const saveButton = async() => {
    console.log("chumbnailList.value",chumbnailList.value);

    const val = {
      chumbnailList : chumbnailList.value.length,
      itemName      : itemName.value,
      price         : price.value,
      salePrice     : salePrice.value,
      itemColor     : itemColor.value,
      itemSize      : itemSize.value,
      cateNo      : cateNo,

    }
    const valChkResult = valChk(val);



    console.log("valChkResult",valChkResult);
    if(valChkResult===true){
        

      const result = await utils.aSyncPostApi('/itemDetail',val);

      if(result.statusCode === 200) {
        utils.showAlert("alert","정상처리 되었습니다.");
        console.log(result.result);

        const item_id = result.result[0].item_id;

        for(let i = 0 ; i < chumbnailList.value.length ; i++){
          utils.uploadImageToServer(chumbnailList.value[i].file,item_id+"_"+(i+1),"Chumbnail");
        }

        
      }
      else utils.showAlert("error",result.message);

    }else{
      utils.showAlert("alert",valChkResult);
    }
    
  }

  const valChk = (val) => {

    if(val.chumbnailList.length < 1) {
      return "이미지업로드를 해주세요."
    }else if(!val.itemName){
      return "상품명을 입력해 해주세요."
    }
    else if(!val.price){
      return "소비자가를 입력해 해주세요."
    }
    else if(!val.salePrice){
      return "판매가를 입력해 해주세요."
    }
    else if(val.itemColor.length < 1 ){
      return "색상을 입력해 해주세요."
    }
    else if(val.itemSize.length < 1 ){
      return "사이즈를 입력해 해주세요."
    } 
    
    return true;
  }

</script>

<style scoped>
.input {
  padding: 4px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}
.input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>
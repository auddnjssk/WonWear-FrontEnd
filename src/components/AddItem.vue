<template>
  <div class="ProductPage">
    <!-- ProductPage Content -->
    <div class="glb-contents">
      <div class = "chumbnail">
        <div class = "chumbnail-content">
          <div>
            <button @click="chumbnailAdd()" class ="miniAddButton">+</button>
            <button @click="removeChumbnail()" class ="miniXButton">X</button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              style="display: none;"
            />
            <img @click="addChumbnail()" style ="width: 100%;" class="exposeImages" :src="chumbnailList[selectedChumbnail-1]?.imageUrl"  alt="background" />
          </div>
          <div class="fiveImage">
            <div class="fiveImage-content">
              <!-- 이미지가 있는 곳 -->
              <div class="image-wrapper" v-for="(chumbnail, index) in paginatedChumbnail" :key="index">
                <img class="image" :src="chumbnail?.imageUrl" alt="thumbnail" />
              </div>

              <!-- 이미지가 부족할 경우 빈 박스로 채움 -->
              <div
                class="image-wrapper empty"
                v-for="n in 5 - paginatedChumbnail.length"
                :key="'empty-' + n"
              />
            </div>
            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
              <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>
          </div>
        </div>


        <div class = "chumbnail-content">
          <div style="border-top: 2px solid #5d5d5d; padding: 15px 0 15px; font-weight: bold;">
            <a > 상품이름 &ensp;: </a> <input type="text" class="input" v-model="itemName" placeholder="입력하세요" /> <br>
          </div>
          <div style="border-top: 1px solid #5d5d5d; padding: 15px 0 15px;">
            <a > 소비자가 &ensp;: </a> <input type="text" class="input" v-model="price" placeholder="입력하세요" /><br>
            <a>판매가 &ensp;&ensp;&ensp;: </a> <input type="text" class="input" v-model="salePrice" placeholder="입력하세요" /> <br>
      
            <a>색상 &ensp;&ensp;&ensp;&ensp;&ensp;: </a>  
            
            <select v-model="selectedColor" id="colorCombo">
              <option disabled value="">색상을 선택하세요</option>
              <option v-for="color in itemColor" :key="color" :value="color.item_detail">
                {{ color.item_detail }}
              </option>
            </select> 
            <input type="text" class="input" v-model="colorRef" placeholder="입력하세요" /> 
            <button @click="colorAdd()" class ="miniAddButton">+</button>
            <button @click="removeColor()" class ="miniXButton">X</button>

            <br>
            <a>사이즈 &ensp;&ensp;&ensp;: </a>
            <select v-model="selectedSize" id="colorCombo">
              <option disabled value="">사이즈를 선택하세요</option>
              <option v-for="size in itemSize" :key="size" :value="size.item_detail">
                {{ size.item_detail }}
              </option>
            </select> 
            <input type="text" class="input" v-model="sizeRef" placeholder="입력하세요" /> 
            <button @click="sizeAdd()" class ="miniAddButton">+</button>
            <button @click="removeSize()" class ="miniXButton">X</button>
          </div>    

          <div style="border-top: 1px solid #5d5d5d; padding: 15px 0 15px;">
            <a>(최소주문수량 1개 이상)</a> <br>
            <a>위 옵션선택 박스를 선택하시면 아래에 상품이 추가됩니다.</a>
          </div>
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
              <button class="Buy-Button" style="width:100%; background: #333; color:white" @click="saveButton()" >저장</button>
            </div>
          </div>
        </div>

      </div>

      <!-- 본문  -->
      
      <div style="border-top: 1px solid #e6e6e6;">
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

<script setup>
import '@assets/globStyles.css';
import { ref } from 'vue';

import { useRoute } from 'vue-router';

import utils from '@js/utils.js'

  let currentPage = 1;
  // const itemsPerPage = 5;

  const route = useRoute();
  const mainMenu = route.params.main;
  const subMenu = route.params.sub;


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
      mainMenu      : mainMenu,
      subMenu       : subMenu,

    }
    const valChkResult = valChk(val);



    console.log("valChkResult",valChkResult);
    if(valChkResult===true){
        

      const result = await utils.aSyncPostApi('/itemDetail',val);

      if(result.statusCode === 200) {
        utils.showAlert("alert","정상처리 되었습니다.");
        console.log(result.result);

        const items_id = result.result[0].items_id;

        console.log("chumbnailList.value[i]",items_id);

        for(let i = 0 ; i < chumbnailList.value.length ; i++){
          utils.uploadImageToServer(chumbnailList.value[i].file,items_id+"_"+(i+1),"Chumbnail");
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
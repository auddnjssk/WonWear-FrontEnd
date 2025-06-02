<template>
  <div class="ProductPage p-4">
    <div class="menuLine mb-2 text-gray-600">
      <a>HOME &gt; 장바구니</a>
    </div>
    <div class="subject text-center py-2 font-semibold text-lg">
      <a>장바구니</a>
    </div>

    <!-- ProductPage Content -->
    <div class="glb-contents">
      <div class="cart-table">
        <h3 class="mb-4 font-bold">일반상품 ({{ itemSize }})</h3>
        <table class="itemTable w-full border border-gray-300 border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-2"><input type="checkbox" v-model="allChecked" @change="toggleAll" /></th>
              <th class="border border-gray-300 p-2">이미지</th>
              <th class="border border-gray-300 p-2">상품정보</th>
              <th class="border border-gray-300 p-2">수량</th>
              <th class="border border-gray-300 p-2">상품구매금액</th>
              <th class="border border-gray-300 p-2">할인금액</th>
              <th class="border border-gray-300 p-2">적립금</th>
              <th class="border border-gray-300 p-2">배송구분</th>
              <th class="border border-gray-300 p-2">배송비</th>
              <th class="border border-gray-300 p-2">선택</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cartItem,index) in cartList" :key="index" class="even:bg-gray-50">
              <td class="border border-gray-300 text-center p-2">
                <input type="checkbox" v-model="cartItem.checked" @change="toggleAll" />
              </td>
              <td class="border border-gray-300 p-2">
                <img class="product-img w-20 h-20 object-cover" :src="`http://localhost:8082/Chumbnail/${cartItem.item_id}_1.png`" alt="상품" />
              </td>
              <td class="border border-gray-300 p-2">
                <div class="product-info">
                  <div class="font-semibold">{{ cartItem.itemName }} <span class="new text-red-500 font-bold">NEW</span></div>
                  <div class="option text-sm text-gray-600">[옵션: {{ cartItem.COLOR }} / {{ cartItem.SIZE }}]</div>
                </div>
              </td>
              <td class="border border-gray-300 p-2 text-center">
                <input type="number" v-model="cartItem.quantity" min="1" class="border border-gray-300 rounded px-2 py-1 w-16 text-center" />
                <button @click="changeQuantity" class="ml-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">변경</button>
              </td>
              <td class="border border-gray-300 p-2 text-right">{{ formatPrice(cartItem.itemPrice) }}  찍찍{{ formatPrice(cartItem.itemSalePrice) }}</td>
              <td class="border border-gray-300 p-2 text-center">-</td>
              <td class="border border-gray-300 p-2 text-center">-</td>
              <td class="border border-gray-300 p-2 text-center">기본배송</td>
              <td class="border border-gray-300 p-2 text-right">
                {{ formatPrice(cartItem.itemPrice) }}
                <br />
                <small class="text-xs text-gray-500">조건</small>
              </td>
              <td class="border border-gray-300 p-2 text-center space-y-2">
                <button class="w-full py-1 bg-gray-800 text-white rounded hover:bg-gray-900">관심상품등록</button>
                <button @click="removeItem(index)" class="w-full py-1 bg-red-600 text-white rounded hover:bg-red-700">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="total-box border border-gray-300 p-4 mt-4 text-right font-semibold">
          상품구매금액 {{ formatPrice(totalPrice) }} + 배송비 {{ formatPrice(deliveryFee) }} = 합계 :
          <strong>{{ formatPrice(totalPrice + deliveryFee) }}</strong>
        </div>
      </div>
    </div>
    <table class="delivery-info-table w-full border border-gray-300 mt-12 border-collapse font-sans text-sm">
      <tbody>
        <tr>
          <th class="bg-gray-100 w-36 text-left p-3 border border-gray-300">배송지 선택</th>
          <td colspan="3" class="p-3 border border-gray-300">
            <label class="mr-4"><input type="radio" name="addrType" value="new" v-model="selectedAddr"/> 새로운 배송지</label>
            <label class="mr-4"><input type="radio" name="addrType" value="recent" v-model="selectedAddr" checked /> 최근 배송지: 서명원</label>
            <button
              class="border border-gray-300 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              @click="showModal = true"
            >
              주소록보기
            </button>
          </td>
        </tr>
        <tr>
          <th class="bg-gray-100 text-left p-3 border border-gray-300"><span class="text-red-500 mr-1">*</span>받으시는 분</th>
          <td colspan="3" class="p-3 border border-gray-300">
            <input
              readonly
              v-model="receiverName"
              type="text"
              placeholder="이름 입력"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </td>
        </tr>
        <tr>
          <th class="bg-gray-100 text-left p-3 border border-gray-300"><span class="text-red-500 mr-1">*</span>주소</th>
          <td colspan="3" class="p-3 border border-gray-300">
            <div class="flex gap-2 mb-2">
              <input
                readonly
                v-model="postCodeVal"
                type="text"
                placeholder="우편번호"
                class="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              <button
                class="border border-gray-300 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                @click="postCode"
              >
                주소검색
              </button>
            </div>
            <input
              readonly
              v-model="address1"
              type="text"
              placeholder="기본주소"
              class="w-full mb-2 border border-gray-300 rounded px-3 py-2"
            />
            <input
              v-model="address2"
              type="text"
              placeholder="나머지 주소"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </td>
        </tr>
        <tr>
          <th class="bg-gray-100 text-left p-3 border border-gray-300"><span class="text-red-500 mr-1">*</span>휴대전화</th>
          <td colspan="3" class="p-3 border border-gray-300">
            <div class="flex gap-2">
              <select v-model="receiverPN1" class="border border-gray-300 rounded px-2 py-2 w-1/4">
                <option>010</option>
                <option>011</option>
                <option>016</option>
              </select>
              <input
                v-model="receiverPN2"
                type="text"
                placeholder="1234"
                class="border border-gray-300 rounded px-2 py-2 w-1/4"
              />
              <input
                v-model="receiverPN3"
                type="text"
                placeholder="5678"
                class="border border-gray-300 rounded px-2 py-2 w-1/4"
              />
            </div>
          </td>
        </tr>
        <tr>
          <th class="bg-gray-100 text-left p-3 border border-gray-300">이메일</th>
          <td colspan="3" class="p-3 border border-gray-300">
            <div class="flex items-center gap-2">
              <input v-model="email1" type="text" class="border border-gray-300 rounded px-2 py-1" />
              @
              <input :readonly="emailReadonly" v-model="email2" type="text" class="border border-gray-300 rounded px-2 py-1" />
              <select
                @change="mailChange" 
                class="border border-gray-300 rounded px-2 py-1">
                <option>naver.com</option>
                <option>daum.net</option>
                <option>gmail.com</option>
                <option>직접입력</option>
              </select>
            </div>
            <p class="text-gray-500 text-xs mt-2">
              이메일을 통해 주문처리과정을 보내드립니다.<br />
              이메일 주소에는 반드시 수신가능한 이메일주소를 입력해 주세요.
            </p>
          </td>
        </tr>
        <tr>
          <th class="bg-gray-100 text-left p-3 border border-gray-300">배송메시지</th>
          <td colspan="3" class="p-3 border border-gray-300">
            <textarea v-model="orderMessage" class="w-full h-20 border border-gray-300 rounded p-2"></textarea>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-12">
      <div class="mt-4 flex gap-2 justify-center">
        <button
          class="Buy-Button h-10 bg-gray-800 text-white px-4 rounded cursor-pointer hover:bg-gray-900"
          @click="allBuyButton"
        >
          전체상품 주문
        </button>
        <button
          class="Buy-Button h-10 bg-gray-800 text-white px-4 rounded cursor-pointer hover:bg-gray-900"
          @click="buyButton"
        >
          선택상품 주문
        </button>
      </div>
    </div>

    <!-- ProductPage ContentEnd -->
  </div>

  <ModalCmp v-if="showModal" @close="showModal = false">
    <AddressBookPop @close="showModal = false" :show="showModal" @submit="handleModalSubmit" />
  </ModalCmp>
</template>

<script setup>
  import '@assets/globStyles.css'
  import { ref, onMounted ,watch } from 'vue';
  import utils from '@js/utils.js';
  import AddressBookPop from '@pop/AddressBookPop.vue'
  import ModalCmp from '@common/ModalCmp.vue'

  const totalPrice = ref(0);
  const deliveryFee = ref(0);

  const cartList = ref([]);
  const itemSize = ref('');
  
  const receiverPN1  = ref('010')
  const receiverPN2  = ref('')
  const receiverPN3  = ref('')

  const receiverName = ref('');
  const postCodeVal = ref('');
  const address1 = ref('');
  const address2 = ref('');
  const orderMessage = ref('');
  const selectedAddr = ref('');
  const showModal = ref(false);
  const email1 = ref('');
  const email2 = ref('naver.com');
  const emailReadonly = ref(true); // 초기엔 readonly 상태
  
  const accessToken = localStorage.getItem('accessToken');
  
  /* global daum */
  const postCode = () => {
    new daum.Postcode({
      oncomplete: function(data) {
        postCodeVal.value = data.zonecode;
        address1.value = data.roadAddress + data.buildingName;
      }
    }).open();
  }
  const handleModalSubmit = (value) => {
    const splitPN = utils.splitPhoneNumber(value.receiver_phone);
    
    showModal.value = !showModal.value;

    receiverPN1.value = splitPN[0];
    receiverPN2.value = splitPN[1]; 
    receiverPN3.value = splitPN[2];

    address1.value = value.address1;
    address2.value = value.address2;
    postCodeVal.value = value.post_code;
    receiverName.value = value.receiver_name;
    
  };

  const allBuyButton = async() => {
    const val = {
      cartList : cartList.value,
      postCodeVal : postCodeVal.value,
      address1 : address1.value,
      address2 : address2.value,
      phoneNb  : receiverPN1.value+"-"+receiverPN2.value+"-"+receiverPN3.value,
      receiverName : receiverName.value,
      orderMessage : orderMessage.value,
    }
     await utils.aSyncPostApi('/order',val);
    
  }
  const removeItem = async(index) => {
    const itemId = cartList.value[index].itemsId;
    const itemsDetailId1 = cartList.value[index].itemsDetailId1;
    const itemsDetailId2 = cartList.value[index].itemsDetailId2;

    await utils.aSyncDeleteApi(`/cart/`+itemId+`/`+itemsDetailId1+`/`+itemsDetailId2,"");
    fetchItems();
  }

  
  const buyButton = async() => {
    console.log("buttonClick",cartList.value);
  }
  const mailChange = async(event) => {
    const changeVal = event.target.value;
    if(changeVal ==='직접입력'){
      email2.value= '';
      emailReadonly.value = !emailReadonly.value;
    }else{
      emailReadonly.value = true;
      email2.value=changeVal;
    }
  }

  function formatPrice(value) {
    return `${value.toLocaleString()}원`
  }
  // API 호출
  const fetchItems = async () => {

    if(accessToken != null ){
      console.log("ifif");
      const result = await utils.aSyncGetApi('/cart', ``);
      if(result){
      cartList.value = result.result;
      itemSize.value = result.result.length;
      for(const resultItem of result.result){
        totalPrice.value += resultItem.itemSalePrice;
      }
      if(totalPrice.value < 80000) deliveryFee.value = 3000
      }
    }
    
  };

  onMounted(() => {
    fetchItems();
    selectedAddr.value = 'recent';
  });

  watch(selectedAddr, async(newVal) => {

    if(newVal == "new"){
      receiverPN1.value  = "010";
      receiverPN2.value  = ""; 
      receiverPN3.value  = "";
      address1.value     = "";
      address2.value     = "";
      postCodeVal.value  = "";
      receiverName.value = "";
    }else if(accessToken != null){
      // 엑세스토큰이 없으면 최근배송지 x
      const result = await utils.aSyncGetApi('/recentOrder', ``);
      if(result?.result){
        const item = result.result[0];
        const receiverPN = utils.splitPhoneNumber(item.receiver_phone);
        receiverPN1.value  = receiverPN[0];
        receiverPN2.value  = receiverPN[1];
        receiverPN3.value  = receiverPN[2];
        address1.value     = item.address1;
        address2.value     = item.address2;
        postCodeVal.value  = item.post_code;
        receiverName.value = item.receiver_name;

        if(item.email_address) {
          const emailSplit = item.email_address.split('@');
          console.log("emailSplit",emailSplit);
          email1.value = emailSplit[0];
          email2.value = emailSplit[1];

        }
        console.log("item.order_message",item.order_message);
        if(item.order_message) {
          orderMessage.value = item.order_message
        }
      }
    }
  });
  
</script>

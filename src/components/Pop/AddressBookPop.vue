<template>
  <div class="border border-gray-300 p-4 w-[600px] bg-white">
    <div class="flex border-b border-gray-300">
      <button
        :class="['flex-1 py-2 font-bold cursor-pointer', activeTab === 'recent' ? 'bg-white border-b-2 border-black' : 'bg-gray-100']"
        @click="clickActiveTab('recent')"
      >최근 배송지</button>
      <button
        :class="['flex-1 py-2 font-bold cursor-pointer', activeTab === 'manual' ? 'bg-white border-b-2 border-black' : 'bg-gray-100']"
        @click="clickActiveTab('manual')"
      >직접입력</button>
    </div>

    <div class="p-4">
      <div v-if="activeTab === 'recent'">
        <div
          v-for="(addressItem, index) in addressList"
          :key="index"
          class="flex justify-between items-start p-4 bg-white border border-gray-300 mb-4"
        >
          <div class="flex flex-col gap-1">
            <p><strong>{{ addressItem.receiver_name }}</strong></p>
            <p>[{{ addressItem.post_code }}] {{ addressItem.address1 }} {{ addressItem.address2 }}</p>
            <p>{{ formatPhoneNumber(addressItem.receiver_phone) }}</p>
          </div>

          <div class="flex flex-col items-end gap-2 ml-5">
            <button class="text-blue-600 text-sm hover:underline" @click="edit(index)">수정</button>
            <button class="w-7 h-7 rounded-full bg-gray-600 text-white text-lg flex items-center justify-center" @click="chkClick(index)">✓</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'manual'">
        <div class="max-w-2xl mx-auto p-4 bg-white border border-gray-300 rounded">
          <!-- 동일/새로운 배송지 선택 -->
          <div class="flex items-center gap-4 mt-4">
            <label class="flex items-center gap-2">
              <input type="radio" name="addrType" checked class="form-radio" />
              <span>회원 정보와 동일</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="addrType" class="form-radio" />
              <span>새로운 배송지</span>
            </label>
          </div>

          <!-- 받는 사람 -->
          <div class="mt-4">
            <label class="block mb-1 font-medium">받는사람</label>
            <input v-model = "receiverName"  type="text" placeholder="이름 입력" class="w-full border border-gray-300 px-3 py-2 rounded" />
          </div>

          <!-- 주소 -->
          <div class="mt-4">
            <label class="block mb-1 font-medium">주소</label>
            <div class="flex gap-2">
              <input readonly v-model = "postCodeVal" type="text" placeholder="우편번호" class="flex-1 border border-gray-300 px-3 py-2 rounded" />
              <button class="border border-gray-300 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" @click="postCode">주소검색</button>
            </div>
            <input
              readonly 
              v-model = "address1" 
              type="text" 
              placeholder="기본주소" class="w-full mt-2 border border-gray-300 px-3 py-2 rounded" />
            <input
              v-model = "address2"
              type="text"
              placeholder="나머지 주소"
              class="w-full mt-2 border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <!-- 휴대전화 -->
          <div class="mt-4">
            <label class="block mb-1 font-medium">휴대전화</label>
            <div class="flex gap-2">
              <select v-model="receiverPN1" class="border border-gray-300 px-2 py-2 rounded w-1/4">
                <option>010</option>
                <option>011</option>
                <option>016</option>
              </select>
              <input v-model="receiverPN2" type="text" placeholder="1234" class="border border-gray-300 px-2 py-2 rounded w-1/4" />
              <input v-model="receiverPN3" type="text" placeholder="5678" class="border border-gray-300 px-2 py-2 rounded w-1/4" />
            </div>
          </div>

          <!-- 이메일 -->
          <!-- <div class="mt-4">
            <label class="block mb-1 font-medium">이메일</label>
            <div class="flex gap-2">
              <input type="text" placeholder="이메일 아이디" class="border border-gray-300 px-2 py-2 rounded w-1/3" />
              <span class="py-2">@</span>
              <select class="border border-gray-300 px-2 py-2 rounded w-1/3">
                <option>직접입력</option>
                <option>naver.com</option>
                <option>gmail.com</option>
                <option>hanmail.net</option>
              </select>
            </div>
          </div> -->

          <!-- 메시지 선택 -->
          <div class="mt-4">
            <select class="w-full border border-gray-300 px-3 py-2 rounded">
              <option>-- 메시지 선택 (선택사항) --</option>
              <option>문 앞에 놓아주세요</option>
              <option>배송 전 연락 부탁드립니다</option>
            </select>
          </div>

          <!-- 기본 배송지 체크 -->
          <div class="mt-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="form-checkbox" />
              <span>기본 배송지로 저장</span>
            </label>
          </div>
        </div>
        <div class="Buy-Button-Div">
          <button class="Buy-Button" style="width:100%; background: #333; color:white" @click="saveButton">저장</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted ,defineEmits  } from 'vue'
import utils from '@js/utils.js'

const emit = defineEmits(['submit']);
const addressList = ref([])
const activeTab = ref('recent');

const receiverName = ref('');
const postCodeVal     = ref('');
const address1     = ref('');
const address2     = ref('');

const receiverPN1  = ref('010')
const receiverPN2  = ref('')
const receiverPN3  = ref('')

const addressEdit  = ref(false)

/* global daum */
const postCode = () => {
  new daum.Postcode({
    oncomplete: function(data) {
      postCodeVal.value = data.zonecode;
      address1.value = data.roadAddress + data.buildingName;
    }
  }).open();
}

const chkClick = (index) => {
  emit('submit', addressList.value[index]);
  console.log("index",addressList.value[index]);
}

const clickActiveTab = (val) => {
  activeTab.value = val
  fetchItems();
}

const formatPhoneNumber = (phoneNumber) => {
  return phoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
}

const splitPhoneNumber = (phoneNumber) => {
  const splPhoneNumber = formatPhoneNumber(phoneNumber);
  const spl = splPhoneNumber.split('-');
  return spl;
}
const saveButton = async() => {
  const val = {
    receiverName : receiverName.value,
    postCode : postCodeVal.value,
    address1 : address1.value,
    address2 : address2.value,
    receiverPhone : receiverPN1.value+"-"+receiverPN2.value+"-"+receiverPN3.value,
  }
  console.log("val",val);
  const result = await utils.aSyncPostApi('/address',val);
  console.log("result",result);
}

const edit = (index) => {
  receiverName.value = addressList.value[index].receiver_name;
  address1.value = addressList.value[index].address1;
  address2.value = addressList.value[index].address2;
  postCode.value = addressList.value[index].post_code;
  
  const pn = splitPhoneNumber(addressList.value[index].receiver_phone);

  receiverPN1.value = pn[0];
  receiverPN2.value = pn[1];
  receiverPN3.value = pn[2];

  activeTab.value   = 'manual'
  addressEdit.value = true;
}

const fetchItems = async () => {
  const result = await utils.aSyncGetApi('/address', '')
  addressList.value = result.result
}

onMounted(fetchItems)
</script>

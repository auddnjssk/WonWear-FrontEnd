<template>
  <div class="flex items-center justify-between px-4 py-2 bg-gray-100">
    <!-- 왼쪽 메뉴 부분 -->
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <a class="text-gray-600 cursor-pointer" @click="homeClick">HOME &gt;</a>
      <div v-if="subMenu === 'null'">
        <a class="text-gray-900 font-semibold">{{ mainMenu }}</a>
      </div>
      <div v-else>
        <a class="text-gray-600">{{ mainMenu }} &gt;</a>
        <a class="text-gray-900 font-semibold">{{ subMenu }}</a>
      </div>
    </div>

    <!-- 오른쪽 버튼 부분 -->
    <div class="flex gap-2" v-if="subMenu !== 'null'">
      <button
        @click="addItem"
        class="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800"
      >
        아이템 추가
      </button>
    </div>
  </div>
</template>


<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const props = defineProps({
  cateNo: String,
})


const mainMenu = ref('');
const subMenu = ref('');

const router = useRouter();

const homeClick = () => {
  router.push(`/`)
}

const addItem = () => {
  router.push(`/addItem/${props.cateNo}`)
}


const fetchItems = () => {
  mainMenu.value = localStorage.getItem('meinMenu');
  subMenu.value = localStorage.getItem('subMenu');
}

onMounted(() => {
  fetchItems()
})

</script>

<template>
  <div class="flex flex-wrap items-center gap-2 text-sm px-4 py-2 bg-gray-100 bg-white">
    <a class="text-gray-600 cursor-pointer"  @click="homeClick">HOME &gt;</a>
    <div v-if="subMenu === 'null'">
      <a class="text-gray-900 font-semibold ">{{ mainMenu }} </a>
    </div>
    <div v-else>
      <a class="text-gray-600 ">{{ mainMenu }} &gt; </a>
      <a class="text-gray-900 font-semibold">{{ subMenu }}</a>
    </div>
    <button
      @click="addItem"
      class="ml-auto bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800"
    >
      아이템 추가
    </button>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const mainMenu = ref('');
const subMenu = ref('');

const router = useRouter();

const homeClick = () => {
  router.push(`/`)
}

// const addItem = () => {
//   router.push(`/addItem/${props.mainMenu}/${props.subMenu}`)
// }

const fetchItems = () => {
  mainMenu.value = localStorage.getItem('meinMenu');
  subMenu.value = localStorage.getItem('subMenu');
}

onMounted(() => {
  fetchItems()
})

</script>

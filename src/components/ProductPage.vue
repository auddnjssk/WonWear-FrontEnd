<template>
  <div class="w-full">

    <PageTopInfo :mainMenu="mainMenu" :subMenu="subMenu" />
    
    <PageLevelInfo :cateNo="cateNo" />

    <!-- 제품 리스트 -->
    <div class="pt-10" >
      <div class="flex flex-wrap gap-5">
        <div
          class="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.33px)] p-2 bg-white rounded shadow cursor-pointer"
          v-for="items in itemsList"
          :key="items.item_id"
          @click="itemClick(items.item_id)"
        >
          <div class="flex flex-col items-center text-center">
            <img
              class="w-full h-106 object-cover rounded mb-3"
              @error="handleImageError"
              :src="`http://localhost:8082/Chumbnail/${items.item_id}_1.png`"
              alt="product"
            />
            <span class="font-medium text-gray-900">{{ items.item_name }}</span>
            <hr class="w-4/5 border-t-1 border-gray-300 my-2" />
            <span class="text-gray-600 text-sm">
              {{ formatPrice(items.item_price) }} {{ items.item_addinfo }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import utils from '@js/utils.js'
import PageTopInfo from '@common/PageTopInfo.vue'
import PageLevelInfo from '@common/PageLevelInfo.vue'

const route = useRoute()
const router = useRouter()
const itemsList = ref([])

const cateNo = route.params.cateNo

const handleImageError = (event) => {
  const extensions = ['jpg', 'jpeg', 'png']
  const currentSrc = event.target.src
  const baseName = currentSrc.substring(0, currentSrc.lastIndexOf('.'))
  const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.') + 1)
  const nextIndex = extensions.indexOf(currentExt.toLowerCase()) + 1

  if (nextIndex < extensions.length) {
    event.target.src = `${baseName}.${extensions[nextIndex]}`
  } else {
    event.target.src = 'http://localhost:8082/Chumbnail/default.png'
  }
}

const formatPrice = (value) => {
  return `${value.toLocaleString()}원`
}

const fetchItems = async () => {
  const result = await utils.aSyncGetApi('/items', `cateNo=${cateNo}`)
  itemsList.value = result.result
}

const itemClick = (items_id) => {
  router.push(`/detailsPage/${items_id}`)
}

onMounted(() => {
  fetchItems()
})
</script>

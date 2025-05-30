<template>
  <div class="relative w-full h-[400px] overflow-hidden">
    <!-- 배경 이미지 -->
    <transition name="fade" mode="out-in">
      <img
        :key="contents[currentIndex]?.image_url"
        :src="contents[currentIndex]?.image_url"
        alt="background"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />
    </transition>

    <!-- 텍스트 내용 -->
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl text-center drop-shadow-lg z-10">
      <transition name="fade" mode="out-in">
        <div :key="currentIndex">
          {{ contents[currentIndex]?.text || '' }}
        </div>
      </transition>
    </div>

    <!-- 인디케이터 -->
    <div class="absolute bottom-5 w-full flex justify-center gap-2 z-10">
      <span
        v-for="(item, index) in contents"
        :key="index"
        @click="goTo(index)"
        :class="[
          'w-3 h-3 rounded-full cursor-pointer transition-all duration-300',
          index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import utils from '@js/utils.js'

const contents = ref([])
const currentIndex = ref(0)
let interval = null

const changeContent = () => {
  if (contents.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % contents.value.length
}

const fetchItems = async () => {
  const result = await utils.aSyncGetApi('/mainBanner', "")
  for (const map of result.result) {
    const val = {
      seqn: map.seqn,
      image_url: `http://localhost:8082/Banner/${map.banner_id}.${map.banner_extension}`,
      text: map.banner_text || '' // 텍스트 
    }
    contents.value.push(val)
  }
}

const goTo = (index) => {
  currentIndex.value = index
  resetInterval()
}

const resetInterval = () => {
  clearInterval(interval)
  interval = setInterval(changeContent, 3000)
}

onMounted(() => {
  fetchItems()
  resetInterval()
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

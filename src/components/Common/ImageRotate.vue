<template>
  <div class="hero">
    <img class="background" :src="backgroundImage" alt="background" />
    
    <div class="content">
      <transition name="fade" mode="out-in">
        <div :key="currentIndex" class="text">
          {{ contents[currentIndex] }}
        </div>
      </transition>
    </div>

    <!-- 인디케이터 -->
    <div class="indicator">
      <span
        v-for="(item, index) in contents"
        :key="index"
        :class="{ active: index === currentIndex }"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const backgroundImage = 'https://placehold.co/1000x400?text=Background'

const contents = [
  '쉽고 빠른 계약',
  '모바일 서명 지원',
  '안전한 파일 저장',
  '실시간 진행 현황'
]

const currentIndex = ref(0)
let interval = null

const changeContent = () => {
  currentIndex.value = (currentIndex.value + 1) % contents.length
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
  resetInterval()
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 2rem;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.6);
  text-align: center;
}

/* 인디케이터 바 */
.indicator {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.indicator span {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator span.active {
  background-color: white;
  transform: scale(1.2);
}

/* fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

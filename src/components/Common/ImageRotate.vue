<template>
  <div class="hero">
    
    <img class="background" :src="contents[currentIndex]?.image_url" alt="background" />
    
    <div class="content">
      <transition name="fade" mode="out-in">
        <div :key="currentIndex" class="text" >
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
import utils from '@js/utils.js'


const contents = ref([]);

const currentIndex = ref(0)
let interval = null

const changeContent = () => {
  currentIndex.value = (currentIndex.value + 1) % contents.value.length
}

const fetchItems = async () => {
  console.log("resul!!t");
  const result = await utils.aSyncGetApi('/mainBanner',"");
  console.log("result",result.result);

  for (const map of result.result) {
    const val = {
      seqn             : map.seqn ,
      image_url        : `http://localhost:8082/Banner/${map.banner_id}.${map.banner_extension}`
    }
    contents.value.push(val);

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
  fetchItems();
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

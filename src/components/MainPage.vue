<template>
  <div class="w-full">
    <!-- 메인 콘텐츠 -->
    <div class="px-4 py-8">
      <ImageRotate />

      <!-- 4개 이미지 -->
      <div class="flex justify-between gap-4 pt-24">
        <img v-for="n in 4" :key="n" :src="backgroundImage" alt="background" class="w-1/4 h-24 rounded-lg object-cover" />
      </div>

      <!-- 3개 상품 노출 -->
      <div class="pt-24 flex justify-between gap-6">
        <div v-for="n in 3" :key="n" class="flex flex-col items-center border border-gray-300 rounded-lg p-4 w-1/3">
          <img :src="backgroundImage" alt="background" class="w-full h-24 object-cover rounded-md" />
          <a class="mt-4 text-lg font-semibold text-gray-800">상품명</a>
          <hr class="w-4/5 my-2 border-t-2 border-gray-300" />
          <a class="text-gray-600">63,000원</a>
        </div>
      </div>
    </div>
    <!-- 메인 콘텐츠 끝 -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import ImageRotate from '@common/ImageRotate.vue';

const backgroundImage = 'https://placehold.co/1000x400?text=Background';

onMounted(() => {
  // 초기 데이터 로딩 로직 (필요 시)
});
</script>

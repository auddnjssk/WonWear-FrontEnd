<template>
      <div class="border-t mt-8 pt-4">
        <img
          v-for="detailImage in detailImageList"
          :key="detailImage.key"
          :src="detailImage.src"
          class="w-full mb-2 rounded"
          alt="detail"
        />
      </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps({
  detailImageSize: String,
  itemsId: String,
}) 

const detailImageList = ref([]);

const fetchItems = () => {
  console.log("???",props.itemsId);
  for (let i = 1; i <= props.detailImageSize; i++) {
    detailImageList.value.push({ key: i, src: `http://localhost:8082/ItemDetails/${props.itemsId}_${i}.jpg` });
  }

  console.log("detailImageList.value",detailImageList.value);
}

onMounted(() => {
  fetchItems()
})

</script>

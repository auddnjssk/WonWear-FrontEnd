<template>
    <div class="editor-container">
      <!-- 드래그 가능한 버튼 -->
      <div
        class="draggable"
        draggable="true"
        @dragstart="onDragStart"
      >
        드래그로 입력 추가
      </div>
      <!-- 드롭 영역 -->

    </div>
    <div
        class="drop-area"
        @dragover.prevent
        @drop="onDrop"
      >
      <canvas ></canvas>
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="input-field"
          :style="{ top: field.top + 'px', left: field.left + 'px', width : '300px' }"
        >
          <input
            type="text"
            v-model="field.value"
            placeholder="값을 입력하세요"
          />
        </div>
      </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    setup() {
      const fields = ref([]); // 입력 필드 배열
      const draggedItem = ref(null); // 드래그된 아이템 정보
  
      // 드래그 시작 이벤트
      const onDragStart = (event) => {
        draggedItem.value = {
          offsetX: event.offsetX,
          offsetY: event.offsetY,
        };
      };
  
      // 드롭 이벤트
      const onDrop = (event) => {
        const x = event.clientX - draggedItem.value.offsetX;
        const y = event.clientY - draggedItem.value.offsetY;
  
        // 새 입력 필드를 추가
        fields.value.push({
          top: y,
          left: x,
          value: "",
        });
      };
  
      return {
        fields,
        onDragStart,
        onDrop,
      };
    },
  };
  </script>
  
  <style scoped>
  .editor-container {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
    position: relative;
    overflow: hidden;
  }
  
  .draggable {
    width: 150px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    text-align: center;
    border-radius: 5px;
    cursor: grab;
    position: absolute;
    top: 10px;
    left: 10px;
    user-select: none;
  }
  
  .draggable:active {
    cursor: grabbing;
  }
  
  .drop-area {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #f8f9fa;
  }
  
  .input-field {
    position: absolute;
  }
  
  input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>
  
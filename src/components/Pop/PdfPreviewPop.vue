<template>
  <div v-if="isOpen" class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <p>PDF 미리보기</p>
      <iframe :src="pdfUrl" width="1200" height="800"></iframe>
      <button @click="closePopup">Close</button>
    </div>
  </div>
</template>

<script>

import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';

export default {
  name: 'PopupTest',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: 'This is a message in the popup.'
    }
  },
  data(){
    return{
        pdfUrl: null,  // PDF 미리보기를 위한 Blob URL
    }
  },
  mounted: async function () {
    try {
      console.log('content==>', this.content);

      // HTML을 캔버스로 렌더링
      const container = document.createElement('div');
      container.innerHTML = this.content;
      container.style.width = '2480px'; //A4 가로
      container.style.height = '3508px'; //A4 세로
      document.body.appendChild(container);

      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL('image/png');
      document.body.removeChild(container); // 렌더링 후 DOM에서 제거

      // PDFDocument 생성
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([2480, 3508]);

      // 이미지 삽입
      const img = await pdfDoc.embedPng(imgData);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: 2480,
        height: 3508,
      });

      // PDF Blob URL 생성
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      this.pdfUrl = URL.createObjectURL(blob);
    } catch (error) {
      console.error('PDF 생성 중 오류:', error);
    }
  },

  methods: {
    closePopup() {
      this.$emit('generatePdf'); // 부모 컴포넌트로 팝업 닫기 이벤트 전달
    }
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 1300px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>

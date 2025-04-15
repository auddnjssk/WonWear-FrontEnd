<template>
  <div>
    <component
      :is="currentComponent"
      :selectedItem="selectedItem"
      @next="handleNext"
      @back="handleBack"
    />
  </div>
</template>

<script>
// 첫번째
import ManualTransmitStep from '@sideMenu/ManualTransmitStep/StepOne.vue';


export default {
  data() {
    return {
      currentStep: 1, // 현재 단계
      selectedItem: null, // 선택된 데이터
    };
  },
  computed: {
    currentComponent() {
      // 현재 단계에 따라 렌더링할 컴포넌트를 결정
      switch (this.currentStep) {
        case 1:
          return ManualTransmitStep;
          default:
          return ManualTransmitStep; // 기본값을 반환
      }
    },
  },
  methods: {
    handleNext(selectedItem) {
      // 다음 단계로 이동하며 선택된 데이터를 저장
      this.selectedItem = selectedItem;
      this.currentStep++;
    },
    handleBack() {
      // 이전 단계로 이동
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
  },
};
</script>

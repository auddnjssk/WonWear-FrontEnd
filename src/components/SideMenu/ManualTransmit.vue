<template>
  <div>
    <ProgressBar 
      :currentStep="currentStep" 
      @stepClick="stepClick" 
      :steps="steps" />
    <component
      :is="currentComponent"
      :sendDataToParent="receiveDataFromChild"
      :oneItem="oneItem || {}"
      :twoItem="twoItem || {}"
      :thrItem="thrItem || {}"
      @next="handleNext"
      @back="handleBack"
    />
  </div>
</template>

<script>
// 첫번째
import StepOne from '@sideMenu/ManualTransmitStep/StepOne.vue';
import StepTwo from '@sideMenu/ManualTransmitStep/StepTwo.vue';
import StepThr from '@sideMenu/ManualTransmitStep/StepThr.vue';
import StepFour from '@sideMenu/ManualTransmitStep/StepFour.vue';
import ProgressBar from '@components/Common/ProgressBar.vue';


export default {
  components: {
    ProgressBar
  },
  data() {
    return {
      currentStep: 1, // 현재 단계
      steps: ['고객 선택', '계약서', '메일 양식', '미리 보기'], // 단계 이름
      oneItem: null, // 선택된 데이터
      twoItem: null, // 선택된 데이터
      thrItem: null, // 선택된 데이터
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentStep) {
        case 1:
          return StepOne;
        case 2:
          return StepTwo;
        case 3:
          return StepThr;
        case 4:
          return StepFour;
        default:
          return StepOne;
      }
    },
  },
  methods: {
    receiveDataFromChild(item,step,act){
      if(act == "next"){
        this.nextStep();
        if(step == 1) this.oneItem = item;
        if(step == 2) this.twoItem = item;
        if(step == 3) this.thrItem = item;

        console.log("this.oneItem",this.oneItem);
        console.log("this.twoItem",this.twoItem);
        console.log("this.thrItem",this.thrItem);

        this.currentStep = ++step
      }
    },
    stepClick(index) {
        console.log("stepClick",index);
        this.currentStep = index;
    },
    prevStep() {
        if (this.currentStep > 0) this.currentStep--;
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1) this.currentStep++;
    },
  },
};
</script>

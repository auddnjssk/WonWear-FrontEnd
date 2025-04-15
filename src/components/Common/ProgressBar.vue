<template>
  <div class="progress-bar">
    <div 
      v-for="(step, index) in steps" 
      :key="index" 
      class="progress-step"
      :class="{ active: index <= currentStep, completed: index < currentStep }"
    >
      <div class="step-indicator" @click="stepClick(index)">
        <span v-if="index < currentStep" class="checkmark">✔</span>
        <span v-else class="step-number">{{ index + 1 }}</span>
      </div>
      <p class="step-label" >{{ step }}</p>
    </div>
    <div class="progress-line">
      <div class="line-fill" :style="{ width: lineWidth + '%' }"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      currentStep: {
        type: Number, // 부모로부터 전달받을 현재 단계 값
        required: true,
      },
      steps: {
        type: Array, // 단계 이름 배열
        default: () => ['첫번째', '두번째', '세번째', '네번째'],
      },
    },
    data() {
      return {
      };
    },
    computed: {
      lineWidth() {
        return (this.currentStep / (this.steps.length )) * 100;
      },
    },
    methods:{
      stepClick(index){
        console.log("index=>",index);
        this.$emit('stepClick',index+1);


      }
    }
  };
</script>
    
<style scoped>
.progress-step :hover{
  cursor: pointer;
  
}
.progress-bar {
  display: flex;
  align-items: center;
  position: relative;
}

.progress-step {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #ddd;
  background-color: #fff;
}

.step-indicator.active {
  border-color: #18283b;
  background-color: #18283b;
  color: #fff;
}

.step-indicator.completed {
  background-color: #18283b;
  color: #fff;
}

.checkmark {
  font-size: 16px;
}

.step-label {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.progress-line {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  height: 4px;
  background-color: #ddd;
  z-index: 0;
}

.line-fill {
  height: 100%;
  background-color:#18283b;
  transition: width 0.3s;
}
</style>
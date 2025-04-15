<!-- App.vue -->
<template>
  <div style="height: 100%; width: 100%;" >
    <div class = "subjectCon">
      <!-- 'Ckeditor'로 컴포넌트 이름 변경 -->
       
      <textarea class = "titleArea"  
        :value="this.custNm" 
        rows="10" 
        cols="50"/>
      <button class = "saveBtn" @click="buttonSubmit" >전송</button>    
    </div>
    <div class = "subjectCon">
      <!-- 'Ckeditor'로 컴포넌트 이름 변경 -->
       
      <textarea class = "titleArea"  
        :value="thrItem.form_title" 
        rows="10" 
        cols="50"/>
    </div>
    <div class = "contentArea" v-html="thrItem.form_detail"></div>
  
  </div>
</template>

<script>
import * as utils from "@js/utils.js";

export default {
  name: 'StepFour',
  components: {
  },
  props: {
    oneItem: {
      type: Object, 
      required: true,
    },
    twoItem: {
      type: Object, 
      required: true,
    },
    thrItem: {
      type: Object, 
      required: true,
    },

  },
  data() {
    return {
      editorData: '',
      editorConfig: {}, // 필요에 따라 구성 가능
      maxFormId : "",
      editFlag : "N",
      custNm : "받는사람 "+this.oneItem.cust_nm + "<"+this.oneItem.cust_kaid+">",
      isPopupVisible: false, 
    };
  },
  methods:{
    buttonSubmit() {
      try {

        const JsonData = {
          custMap : JSON.stringify(this.oneItem),
          pdfMap : JSON.stringify(this.twoItem),
          mailMap : JSON.stringify(this.thrItem),
        };

        utils.aSyncPostApi('/google/sendMail', JsonData);

        this.isPopupVisible = true;
      } catch (error) {
        console.error('There was an error during listClick:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.'); 
      }
    }
  }
};
</script>

<style>
.subjectCon{
height: 80px;
width: 100%;
display : flex;
align-items : center;


}
.titleArea{
  padding: 10px;
  left: 0;
  height: 45px;
  width: 100%;
  margin-right : 10px;
  border-radius: 12px;
}
.contentArea{
  padding: 10px;
  left: 0;
  height: 100%;
  width: 100%;
  margin-right : 10px;
  border:1px solid;
  border-color: rgb(118, 118, 118);
  border-radius: 12px;
  background-color: #ffffff;


}
.delBtn{
  color: red;
  padding: 10px;
  right: 0;
  height: 45px;
  width: 60px;
  margin-right : 10px;
}
.button{
  margin-top:0px;
}
.saveBtn{
  margin-top: 0px;
  left: 1vw;
  top: 1vw;
  height: 40px;
  background: var(--navbar-dark-primary);
  border-radius: 12px;
  flex-direction: column;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  width: 60px;
  color:  #ffffff;

}
.editDiv{
  height: 100%;
}
.ck-editor__editable_inline{
  height: 100%;
}
.ck-editor__main{
  height: 100%;
}
</style>

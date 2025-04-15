<template>
<div class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>

        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-textarea-t" viewBox="0 0 16 16">
            <path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5zM2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2m12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
            <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386z"/>
        </svg>
        <p style = "padding : 20px">{{ message }}</p>
        <input v-model="inputVal" :placeholder="placeholder" >
        <div class = "input-button">
            <button class = "glb-button-70" @click="commit()">저장</button>
            <button class = "glb-button-70" @click="closePopup()">취소</button>
        </div>
    </div>
</div>
</template>

<script>
import {  toRefs , ref   } from "vue";
import '@assets/globStyles.css';
import * as utils from "@js/utils.js"; 


export default {
name: 'InputPop',
props: {  
    placeholder: {
    type: String,
    default: '입력'
    },
    message: {
    type: String,
    default: '메시지'
    },    
    removeInputPopup: {
    type: Function,
    required: true,
    },
    callBack: {
    type: Function,
    required: false
    },
    
    cbArgument: {
    type: String,
    required: false
    }
    
},

setup(props){
    const inputVal = ref("");
    const { callBack , removeInputPopup} = toRefs(props);

    console.log("callBack",callBack);

    const closePopup = () => {
        // callBack이 존재하면 작동
        removeInputPopup.value();
    };

    const commit = () => {
        if(!inputVal.value){
            utils.showAlert('error',"값을 입력해주세요");
            return;
        }
        callBack.value(inputVal.value);
        removeInputPopup.value();
    }

    return {
        closePopup,
        commit,
        inputVal
    };
}



}
</script>
<template> 
  <div class="glb-main-page">
    <!-- 고정된 헤더 -->
    <header class="glb-fixed-header">
      <div class ="glb-paging-div">
          <svg  @click = "prevPage" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
           <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
          </svg>
          <input style="width: 25px; height : 35px; text-align: center; margin : 5px ; font-size: 15px;" type="text" v-model="currentPage" @change="goPage"/>
          <a style="font-size: 15px; font-weight: 100;">/</a>
          <input style="width: 25px; height : 35px; text-align: center; margin : 5px ; font-size: 15px;" readonly type="text" v-model="totalPages"   />

          <svg @click = "nextPage" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
          </svg>
      </div>

      <div class ="glb-header-right-div">
          <button 
            class="glb-button" 
            @click="save()"
          > 저장
          </button>
          <button 
            class="glb-button" 
            @click="fnListNedit()"
          > 목록
          </button>
      </div>
      <!-- <button @click = "TestClick()">dd</button> -->
    </header>

    <!-- -------------------------- Render start-------------------------- -->

    <div class="glb-content">
      <div class="image-outerDiv"  >
          <div class="ImageDiv" 
            :ref="el => setImgDivRef(el)"
            @dragover.prevent
            @drop="onDrop"
            @click = "resetZoom()"
            >
            <!-- 텍스트 인풋 -->
            <div
              v-for="(field, index) in textFields[currentPage-1]"
              :key="index"
              @click.stop = "inputClick(field,$event)"
              class="pdf-input-div"
              :style="{ top: field.top + 'px', left: field.left + 'px', width : field.width + 'px' , height : field.height + 'px' }"
            >
              <input
                class="pdf-textInput"
                type="text"
                v-model="field.value"
                placeholder="값을 입력하세요"
              />
            </div>

            <!-- 서명패드 인풋 -->
            <div
              v-for="(field, index) in signFields[currentPage-1]"
              :key="index"
              @click.stop = "inputClick(field,$event,index)"
              class="pdf-input-div"
              :class="{ zoomed: zoomedField === index  }" 
              :style="{ top: field.top + 'px', left: field.left + 'px', width : field.width + 'px' , height : field.height + 'px' }"
            >
              <VueSignaturePad 
                class="pdf-signInput"
                v-model="field.value"
                @canvas-setup="onCanvasSetup(index)"
              />
            </div>
          </div>
      </div>
        
        <!-- -------------------------- Render end-------------------------- -->



      <div class="eqipTab">
          <div class="deleteIcon" @click="deleteClick">
            <!-- 삭제 버튼 -->
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" fill="currentColor"  class="bi bi-trash" viewBox="0 0 16 16" >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </div>
          <!-- 드래그 부분 -->
          <div class = "dragDiv">
            <div
              class="draggable"
              id = "text"
              draggable="true"
              @dragstart="onDragStart"
            >
              <svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-card-text"  viewBox="0 0 16 16" >
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>
              </svg>
            </div>
            <div
              class="draggable"
              id = "sign"
              draggable="true"
              @dragstart="onDragStart"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
            </div>
          </div>
          <div class = "styleDiv">
            <a>높이</a><input v-model="clickHeight"/><br>
            <a>너비</a><input v-model="clickWidth"/>
            <button @click = "styleCommit()">스타일 적용</button>
          </div>
      </div>
    </div>
  </div>

  <div>
    
  </div>
</template>


<script>
import * as pdfjsLib from "pdfjs-dist";
import * as utils from "@js/utils.js";
import { toRefs,ref , onMounted, nextTick} from "vue";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
// 서명 패드
import { VueSignaturePad } from "vue-signature-pad";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
export default {
name: "PdfForm",
components : {
  VueSignaturePad
},
props : {
  formId: {
      type: String, 
      required: true,
  },
  editNlist: {
      type: Function,
      required: true,
  },
},
setup(props) {
  const { formId,editNlist } = toRefs(props);

  const currentPage = ref(1); // 현재 페이지 번호
  const totalPages = ref(0); // 총 페이지 수
  const imgDivRef = ref(); // image 참조
  // 드래그 부분
  const textFields = ref([]); // 텍스트 입력 필드 배열
  const signFields = ref([]); // 서명 입력 필드 배열
  const imgUrls = ref([]); 
  const dropAreaHeight = ref();
  const formTitle = ref();
  const clickField = ref();
  const clickRef   = ref();
  const clickWidth = ref();
  const clickHeight = ref();
  const signaturePadRef = ref ();
  const zoomedField = ref();

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 현재 화면비율에 맞춰서 Input Size 설정
  const textDefaultWidth = ref( Math.round(screenWidth/10));
  const textDefaultHeight = ref(Math.round(screenHeight/40));
  
  const signDefaultWidth = ref( Math.round(screenWidth/15));
  const signDefaultHeight = ref(Math.round(screenHeight/30));

  let dragType = null;
  let oldTop = null;
  let oldLeft = null;

  const fnListNedit = () => {
    editNlist.value();
  }

  const styleCommit = () => {
    console.log("들어온값 =>",clickField.value);
    const renderedWidth =  imgDivRef.value.offsetWidth;
    const renderedHeight = imgDivRef.value.offsetHeight; 
                
    clickField.value.relativeWidth = clickWidth.value / renderedWidth;
    clickField.value.relativeHeight = clickHeight.value / renderedHeight;
    clickField.value.width = clickWidth.value ;
    clickField.value.height = clickHeight.value ;

    clickRef.value.style.width = clickWidth.value + "px";
    clickRef.value.style.height = clickHeight.value + "px";

  }
  const inputClick = (field,event,index) => {
    signaturePadRef.value = event.srcElement;
    const clickedElement = event.target;

    clickRef.value = clickedElement
    clickField.value = field;
    clickWidth.value = clickedElement.getBoundingClientRect().width;
    clickHeight.value = clickedElement.getBoundingClientRect().height;

    console.log("clickField",clickField.value);
    if(event.srcElement.tagName == "CANVAS"){
      if(zoomedField.value!=null) return;
      zoomedField.value = zoomedField.value === index ? null : index;
      // 이전 좌표값 저장
      oldTop = clickField.value.top;
      oldLeft = clickField.value.left;
      // 2배로 확대
      clickField.value.width = clickField.value.width * 3;
      clickField.value.height = clickField.value.height * 3;
      // 화면 중간으로 정렬
      clickField.value.top = screenHeight / 2;
      clickField.value.left = screenWidth / 2;
      // Canvas도 같이 확대
      signaturePadRef.value.width = clickField.value.width * 3;
      signaturePadRef.value.height = clickField.value.height * 3;
      signaturePadRef.value.getContext("2d").scale(3, 3);
    }
  }

  const resetZoom = () => {
    if(zoomedField.value != null) {
      console.log("???",zoomedField.value );
      zoomedField.value = null; // 배경 클릭 시 원래 크기로
      // 2배로 확대
      clickField.value.width = clickField.value.width / 3;
      clickField.value.height = clickField.value.height / 3;
      // 화면 중간으로 정렬
      clickField.value.top = oldTop
      clickField.value.left = oldLeft
    }
  }
  const setHeight = () => {
      utils.aSyncGetApi("/image","formId="+formId.value)
      .then((response) => {
        console.log("response",response);
          imgUrls.value = response.result
          totalPages.value = response.result.length;
          
          if(totalPages.value > 0){
            nextTick(() => {
              
              const parentElement = document.querySelector('.image-outerDiv'); 
              const divHeight =parentElement.offsetHeight
              
              const screenScale = Math.min(divHeight / 792);
              
              const imageUrl = "/images/"+imgUrls.value[0];
              console.log("screenWidth",screenWidth);
              console.log("divHeight",divHeight);


              if(screenWidth > 768){
                // A4용지 비율로 Width 계산
                imgDivRef.value.style.height           =   screenScale*792+'px';
                imgDivRef.value.style.width            = ((screenScale*792) * 0.705)+'px';
                imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
                imgDivRef.value.style.backgroundRepeat = "no-repeat"; // 한장의 사진만 (바둑배열 x)
                imgDivRef.value.style.backgroundSize   = "cover"; // 컨테이너에 가득차게
              }else{ // 모바일에선 Width로 height를 계산
                imgDivRef.value.style.height           =  screenWidth*1.414+'px';
                imgDivRef.value.style.width            =  screenWidth+'px';
                imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
                imgDivRef.value.style.backgroundRepeat = "no-repeat"; // 한장의 사진만 (바둑배열 x)
                imgDivRef.value.style.backgroundSize   = "cover"; // 컨테이너에 가득차게
              }

              inputGet();
            });
          }
        });
  }

  const inputGet = () => { 
    const renderedWidth = imgDivRef.value.offsetWidth;
    const renderedHeight = imgDivRef.value.offsetHeight;

    nextTick(() => {
      utils.aSyncGetApi("/formCoordinate","formId="+formId.value)
      .then((response) => {
          const results = response.result;
          
          // 기준이 되는 div
          const parentElement = document.querySelector('.ImageDiv'); 
          const headerElement = document.querySelector('.glb-fixed-header'); 
          
          // 드롭된 div의 위치 (뷰포트 기준)
          const rect = parentElement.getBoundingClientRect();

          if(response.result.length > 0){
            for(const result of results){
              
              if(result.input_type == "text"){
                // 페이지 배열 초기화   
                if (!Array.isArray(textFields.value[result.page_number-1])) {
                  textFields.value[result.page_number-1] = [];
                } 
                textFields.value[result.page_number-1].push({

                  top            : (result.y_relative * imgDivRef.value.offsetHeight) + headerElement.offsetHeight ,
                  left           : (result.x_relative * imgDivRef.value.offsetWidth) + rect.left,
                  width          : Math.round(result.width_relative * renderedWidth),
                  height         : Math.round(result.height_relative * renderedHeight),
                  relativeX      : result.x_relative,
                  relativeY      : result.y_relative,
                  relativeWidth  : result.width_relative,
                  relativeHeight : result.height_relative,
                  inputType      : result.input_type,
                  value          :  "",

                }) 
              }else if(result.input_type == "sign"){
                // 페이지 배열 초기화   
                if (!Array.isArray(signFields.value[result.page_number-1])) {
                  signFields.value[result.page_number-1] = [];
                } 
                signFields.value[result.page_number-1].push({

                  top            : (result.y_relative * imgDivRef.value.offsetHeight) + headerElement.offsetHeight ,
                  left           : (result.x_relative * imgDivRef.value.offsetWidth) + rect.left,
                  width          : Math.round(result.width_relative * renderedWidth),
                  height         : Math.round(result.height_relative * renderedHeight),
                  relativeX      : result.x_relative,
                  relativeY      : result.y_relative,
                  relativeWidth  : result.width_relative,
                  relativeHeight : result.height_relative,
                  inputType      : result.input_type,
                  value          :  "",

                }) 
              }
            }
          }
        });
      })
  }
  const setImgDivRef = (el) => {
    if (el) {
      imgDivRef.value = el;
    }
  };
  
  const deleteClick = () => {
    textFields.value[currentPage.value-1] = "";
    signFields.value[currentPage.value-1] = "";
  }

  const onDragStart = (event) => {
    console.log("event.target.id",event.target.id);
    dragType = event.target.id;
  };
  
  const onDrop = (event) => {
    console.log("event",event);
    const parentElement = document.querySelector('.ImageDiv');

    // 부모 요소를 기준으로 상대 좌표 얻기
    const relativeX = event.offsetX / parentElement.offsetWidth;
    const relativeY = event.offsetY / parentElement.offsetHeight;
    
    if(dragType == "text"){
      
      // 페이지 배열 초기화
      if (!Array.isArray(textFields.value[currentPage.value-1])) {
        textFields.value[currentPage.value-1] = [];
      }
      
      textFields.value[currentPage.value-1].push({
          top            : event.clientY,
          left           : event.clientX,
          width          : textDefaultWidth.value,
          height         : textDefaultHeight.value,
          relativeWidth  : textDefaultWidth.value/imgDivRef.value.offsetWidth ,
          relativeHeight : textDefaultHeight.value/imgDivRef.value.offsetHeight,
          relativeX      : relativeX,
          relativeY      : relativeY,
          clientX        : event.clientX,
          clientY        : event.clientY,
          inputType      : "text",
          value          :  "",
      }) ;
    }else if(dragType == "sign"){

      // 페이지 배열 초기화
      if (!Array.isArray(signFields.value[currentPage.value-1])) {
        signFields.value[currentPage.value-1] = [];
      }
      signFields.value[currentPage.value-1].push({
          top            : event.clientY,
          left           : event.clientX,
          width          : signDefaultWidth.value,
          height         : signDefaultHeight.value,
          relativeWidth  : signDefaultWidth.value/imgDivRef.value.offsetWidth ,
          relativeHeight : signDefaultHeight.value/imgDivRef.value.offsetHeight,
          relativeX      : relativeX,
          relativeY      : relativeY,
          clientX        : event.clientX,
          clientY        : event.clientY,
          inputType      : "sign",
          value          :  "",
      }) ;
    }
    dragType = null;
  };

  const renderPage = (currentPage) => {
    console.log("currentPage",currentPage);
  }
  const goPage = async () => {
    if (currentPage.value < 1 || currentPage.value > totalPages.value) {
      alert("유효하지 않은 페이지 번호입니다.");
      return;
    }
    const imageUrl = "/images/"+imgUrls.value[currentPage.value-1];
    imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
  };

  const prevPage = async () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      const imageUrl = "/images/"+imgUrls.value[currentPage.value-1];
      imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
    }
  };

  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      const imageUrl = "/images/"+imgUrls.value[currentPage.value-1];
      imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
    }
  };

  const onCanvasSetup = (index) => {
    console.log("zoomedField.value",zoomedField.value);
    console.log("!!",index);
      if (zoomedField.value === index) {
        console.log("index",index);
        const canvas = this.$refs.signaturePad[index].$el.querySelector('canvas');
        this.canvasContext = canvas.getContext('2d');
        this.canvasContext.scale(this.zoomScale, this.zoomScale);
      }
  }
  const save = () => {
    
    const inputFields = {
      textFields : textFields.value,
      signFields : signFields.value
    }

    const jsonBody = {
      formTitle : formTitle.value,
      formId : formId.value,
      inputFields : inputFields
    }
    
    utils.aSyncPostApi('/formCoordinate',jsonBody)
    .then((response) => {
      utils.showAlert('alert',response.message);
    });

    console.log("imgUrls.value",imgUrls.value);
  };

  const TestClick = () => {

    console.log("textFields",textFields.value);
    //setHeight();
  }
  onMounted(() => {
    setHeight();
  });


  return {
    currentPage,
    totalPages,
    imgDivRef,
    goPage,
    prevPage,
    nextPage,
    onDragStart,
    onDrop,
    textFields,
    setHeight,
    dropAreaHeight,
    save,
    formTitle,
    renderPage,
    deleteClick,
    signFields,
    inputClick,
    clickField,
    clickWidth,
    clickHeight,
    textDefaultWidth,
    textDefaultHeight,
    inputGet,
    styleCommit,
    clickRef,
    TestClick,
    fnListNedit,
    screenWidth,
    screenHeight,
    setImgDivRef,
    dragType,
    zoomedField,
    resetZoom,
    onCanvasSetup,
    signaturePadRef,
    oldTop ,
    oldLeft
  };
},
};
</script>

<style scoped>
.image{
  border: 1px solid black; 
}
.file-upload {
  padding: 10px;
}
.pdf-container {
  overflow: auto;
}
.pdf-page {
  position: relative;
  margin-bottom: 20px;
}
.input-field {
  position: absolute;
}
.pdf-input-div {
  position: absolute;
  border: 0px;
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  transition: width 0.3s ease, height 0.3s ease;
}
.pdf-input {
  z-index: 10001;
  width: 100%;
  height: 100%;
  border: 0px;
}
.pdf-textInput {
  border: 0.5px solid  red;
  background-color :wheat;
}
.pdf-signInput {
  border: 0.5px solid  red;
  background-color :wheat;
}

/* 확대 시 중앙 배치 */
.pdf-signInput.zoomed {
  position: fixed;
  transform: translate(-50%, -50%) scale(0.5);
  z-index: 1001; /* 높은 z-index로 설정 */
  pointer-events: auto; /* 터치 및 클릭 이벤트를 수용 */
}
/* 확대 시 중앙 배치 */
.pdf-input-div.zoomed {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease; 
  z-index: 1001; /* 높은 z-index로 설정 */
  pointer-events: auto; /* 터치 및 클릭 이벤트를 수용 */
}


.dragDiv {
  display: flex;

}
.draggable{
  width: 100%;
  height: 100%;
}
.draggable:active {
  cursor: grabbing;
}
.drop-area {
  text-align : center;
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #f8f9fa;
}
</style>

<!-- setheight로 이미지를 들고옴 (그 뒤 빈 이미지칸에 Image를 넣음)
     그다음 절대좌표값을 들고옴
     생성
 
-->
<template>
  <div class="main-page">
    <!-- 고정된 헤더 -->
    <header class="glb-fixed-pdf-header">
      <a>PDF 편집기</a>
      <button @click="save">저장</button>
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
        <button 
          class="glb-button" 
          style="width : 120px"
          @click="fnListNedit()"
        > 목록으로 가기
        </button>
      <button @click = "TestClick()">dd</button>
    </header>

    <!-- PDF 미리보기 -->
    <div style="display: flex;">
      <div class="drop-area">

        <canvas
          style ="width:400px; height :700px"
            :key="index"
            :ref="el => setCanvasRef(el,index)">
          </canvas>

        <img
          alt="Resizable Image" 
          @dragover.prevent
          @drop="onDrop"
          class="image"
          :ref="el => setImgRef(el, index)"
        />
        <div
          v-for="(field, index) in textFields[currentPage-1]"
          :key="index"
          @click = "getField(field,$event)"
          class="pdf-input-div"
          :style="{ top: field.top + 'px', left: field.left + 'px', width : field.width + 'px' , height : field.height + 'px' }"
        >

          <input
            class="pdf-input"
            type="text"
            v-model="field.value"
            placeholder="값을 입력하세요"
          />
        </div>
      </div>
      <div class="eqipTab">
        <div>
          <div class="deleteIcon" @click="deleteClick">
            <!-- 삭제 버튼 -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
              />
            </svg>
          </div>
          <!-- 텍스트 입력 -->
          <div
            class="draggable"
            draggable="true"
            @dragstart="onDragStart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-card-text"
              viewBox="0 0 16 16"
            >
              <path
                d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"
              />
              <path
                d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"
              />
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
</template>


<script>
import * as pdfjsLib from "pdfjs-dist";
import * as utils from "@js/utils.js";
import { toRefs,ref , onMounted, nextTick} from "vue";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
export default {
name: "PdfForm",

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

  const pdfFile = ref(null); // 업로드된 PDF 파일
  const pdfDoc = ref(null); // PDF 문서 객체
  const currentPage = ref(1); // 현재 페이지 번호
  const totalPages = ref(0); // 총 페이지 수

  const imageRef = ref(); // image 참조

  const canvasRef = ref ();

  const refFileUrl = ref(null);
  // 드래그 부분
  const textFields = ref([]); // 입력 필드 배열
  const signFields = ref([]); // 입력 필드 배열
  
  const imgUrls = ref([]); 
  const draggedItem = ref(null); // 드래그된 아이템 정보

  const dropAreaHeight = ref();
  const formTitle = ref();

  const clickField = ref();
  const clickRef = ref();
  
  const clickWidth = ref();
  const clickHeight = ref();

  const textInputWidth = ref(150);
  const textInputHeight = ref(20);

  const fnListNedit = () => {
    editNlist.value();
  }

  const styleCommit = () => {
    console.log("들어온값 =>",clickField.value);
    const renderedWidth =  imageRef.value.offsetWidth;
    const renderedHeight = imageRef.value.offsetHeight; 
                
    clickField.value.relativeWidth = clickWidth.value / renderedWidth;
    clickField.value.relativeHeight = clickHeight.value / renderedHeight;
    clickField.value.width = clickWidth.value ;
    clickField.value.height = clickHeight.value ;

    clickRef.value.style.width = clickWidth.value + "px";
    clickRef.value.style.height = clickHeight.value + "px";

  }
  const getField = (field,event) => {

    const clickedElement = event.target;

    clickRef.value = clickedElement
    clickField.value = field;
    clickWidth.value = clickedElement.getBoundingClientRect().width;
    clickHeight.value = clickedElement.getBoundingClientRect().height;

    console.log(clickHeight.value);
  }

  const setHeight = () => {
      const parentElement = document.querySelector('.drop-area'); 
      const headerElement = document.querySelector('.glb-fixed-pdf-header');

      dropAreaHeight.value = (parentElement.offsetHeight - headerElement.offsetHeight)-5;
      parentElement.style.height =  `${dropAreaHeight.value}px`;
      
      utils.aSyncGetApi("/image","formId="+formId.value)
      .then((response) => {
          imgUrls.value = response.result
          totalPages.value = response.result.length;
          for(let i=0 ; totalPages.value > i  ; i++){
            textFields.value.push({
            })
          }

          if(totalPages.value > 0){
            nextTick(() => {
              if (imageRef.value) {
                imageRef.value.src = "/images/"+imgUrls.value[currentPage.value-1];
                imageRef.value.height = dropAreaHeight.value-2;
                // A4용지 비율로 Width 계산
                imageRef.value.width  = ((dropAreaHeight.value+5) * 0.705);
              }
            });
            nextTick(() => {
              
              inputGet();
            });
            
          }
        });
  }

  const inputGet = () => { 
    const renderedWidth = imageRef.value.offsetWidth;
    const renderedHeight = imageRef.value.offsetHeight;
    console.log("!",renderedWidth);
    console.log("!",renderedHeight);
    nextTick(() => {
      utils.aSyncGetApi("/formCoordinate","formId="+formId.value)
      .then((response) => {

          const results = response.result;

          if(response.result.length > 0){
            for(const result of results){
              
              if(result.input_type == "text"){
                // 페이지 배열 초기화
                if (!Array.isArray(textFields.value[result.page_number-1])) {
                  textFields.value[result.page_number-1] = [];
                } 
                textFields.value[result.page_number-1].push({
                    top             : result.x_coord,
                    left            : result.y_coord,
                    width           : result.width_relative * renderedWidth,
                    height          : result.height_relative * renderedHeight,
                    relativeX       : result.x_relative,
                    relativeY       : result.y_relative,
                    relativeWidth   : result.width_relative,
                    relativeHeight  : result.height_relative,
                    inputType       : result.input_type,
                    value           :  "",

                }) 
              }
              

            }
          }
        });
      })
  }
  const setImgRef = (el) => {
    if (el) {
      imageRef.value = el;
    }
  };
  const setCanvasRef = (el) => {
    if (el) {
      canvasRef.value = el;
    }
  };

  
  
  const deleteClick = () => {

    textFields.value[currentPage.value-1] = "";

  }

  const onDragStart = (event) => {
    const targetElement = event.target; // 드래그 대상 엘리먼트
    const parentElement = document.querySelector('.drop-area'); // 기준이 되는 div

    // 기준 div의 좌표 가져오기
    const parentRect = parentElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    draggedItem.value = {
        offsetX: event.clientX - targetRect.left,
        offsetY: event.clientY - targetRect.top,
        parentOffsetX: parentRect.left,
        parentOffsetY: parentRect.top,
    };
  };
  const onDrop = (event) => {

    console.log("textFields",textFields.value[0]);
    const parentElement = document.querySelector('.drop-area'); // 기준이 되는 div
    const parentRect = parentElement.getBoundingClientRect();

    const dropX = event.clientX - parentRect.left - draggedItem.value.offsetX;
    const dropY = event.clientY - parentRect.top - draggedItem.value.offsetY;
    
    // 렌더링된 이미지 크기 기준으로 상대 좌표 계산
    const renderedWidth = imageRef.value.offsetWidth;
    const renderedHeight = imageRef.value.offsetHeight;
    
    const relativeX = dropX / renderedWidth;
    const relativeY = dropY / renderedHeight;

    const relativeWidth  = textInputWidth.value / renderedWidth;
    const relativeHeight = textInputHeight.value / renderedHeight;


    console.log("textInputWidth",textInputWidth.value);
    console.log("textInputHeight",textInputHeight.value);

    console.log("복원 ->>",relativeWidth);
    console.log("복원 ->>",relativeHeight);

    console.log("복원 ->>",relativeHeight*renderedWidth);
    console.log("복원 ->>",relativeHeight*renderedHeight);
    
    // 페이지 배열 초기화
    if (!Array.isArray(textFields.value[currentPage.value-1])) {
      textFields.value[currentPage.value-1] = [];
    }
    textFields.value[currentPage.value-1].push({

        top            : dropY,
        left           : dropX,
        width          : relativeWidth * renderedWidth,
        height         : relativeHeight * renderedHeight,
        relativeX      : relativeX,
        relativeY      : relativeY,
        relativeWidth  : relativeWidth,
        relativeHeight : relativeHeight,
        inputType      : "text",
        value          :  "",
    }) ;

    console.log(textFields.value); // 새 입력 필드 확인
  };

  const renderPage = (currentPage) => {
    console.log("currentPage",currentPage);
  }
  const goPage = async () => {
    if (currentPage.value < 1 || currentPage.value > totalPages.value) {
      alert("유효하지 않은 페이지 번호입니다.");
      return;
    }
    imageRef.value.src = "/images/"+imgUrls.value[currentPage.value-1];
  };

  const prevPage = async () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      imageRef.value.src = "/images/"+imgUrls.value[currentPage.value-1];
    }
  };

  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      imageRef.value.src = "/images/"+imgUrls.value[currentPage.value-1];
    }
  };

  const save = () => {

    const jsonBody = {
      formTitle : formTitle.value,
      formId : formId.value,
      inputFields : textFields.value
    }
    utils.aSyncPostApi('/formCoordinate',jsonBody);

    console.log("imgUrls.value",imgUrls.value);
  };

  const TestClick = () => {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageRef.value, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'captured_image.png';
    link.click();
  }
  onMounted(() => {
    setHeight();
  });


  return {
    pdfFile,
    pdfDoc,
    currentPage,
    totalPages,
    imageRef,
    goPage,
    prevPage,
    nextPage,
    refFileUrl,
    onDragStart,
    onDrop,
    textFields,
    setHeight,
    dropAreaHeight,
    save,
    formTitle,
    renderPage,
    setImgRef,
    deleteClick,
    signFields,
    getField,
    clickField,
    clickWidth,
    clickHeight,
    textInputWidth,
    textInputHeight,
    inputGet,
    styleCommit,
    clickRef,
    TestClick,
    fnListNedit,
    setCanvasRef,
    canvasRef
  };
},
};
</script>

<style scoped>
.image{
  border: 1px solid black; 
}
.eqipTab{
  width: 300px;

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
  height: 20px; /* 필요에 따라 높이 설정 */
  width: 150px; /* 필요에 따라 너비 설정 */
}
.pdf-input {
  border: 1px solid black;
  width: 100%;
  height: 100%;
  border: 0px;
  border: 1px solid #ccc;
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
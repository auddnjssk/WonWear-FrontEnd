<template>
  <div class = "calender-container">
    <FullCalendar class ="calender-Main"
      :events="calendarEvents"
      :options="calendarOptions"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'; // Vue3 버전 사용 시
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import timeGridPlugin from '@fullcalendar/timegrid'; // 주간/일간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 드래그 & 드롭, 클릭 기능 플러그인

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      // 캘린더에 표시할 이벤트 예시
      calendarEvents: [
        { title: 'Event 1', date: '2024-11-14' },
        { title: 'Event 2', date: '2024-11-15' }
      ],
      // 캘린더 옵션
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth', // 초기 보기 모드 설정 (월간 보기)
        editable: true, // 드래그 & 드롭 활성화
        selectable: true, // 날짜 선택 활성화
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' // 뷰 모드 변경 버튼
        },
        dateClick: this.handleDateClick, // 날짜 클릭 시 이벤트
        eventClick: this.handleEventClick // 이벤트 클릭 시 이벤트
      }
    };
  },
  methods: {
    handleDateClick(info) {
      alert('Clicked on: ' + info.dateStr);
      // 원하는 동작을 추가하세요.
    },
    handleEventClick(info) {
      alert('Event: ' + info.event.title);
      // 원하는 동작을 추가하세요.
    }
  }
};
</script>

<style>
.calender-container{
  

}
.calender-Main{
  
}
.fc-toolbar fc-toolbar-ltr{
  transform: scale(0.8); /* 너무커서 줄임 */
}
.fc-view-harness-active{
  transform: scale(0.8); /* 너무커서 줄임 */
}
/* 필요 시 추가 스타일 */
</style>

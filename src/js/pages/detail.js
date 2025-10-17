import { $ } from "/src/js/utils/dom.js";
import { store } from "/src/js/store/store.js";
const params = new URLSearchParams(location.search);
const id = params.get("id");
if (!id) {
  console.log("id 값 없습니다");
} else {
  console.log("id:", id);
  const lectures = store.getLocalStorage("lectures") || [];
  const lecture = lectures.find((l) => l.id === id);
  if (!lecture) {
    alert("일치하는 강의를 찾을 수 없습니다.");
  } else {
    $("#lecture-detail").innerHTML = `
      <div class="lecture-detail">
        <img src="${lecture.thumbnail}" alt="썸네일" />
        <div>강의 제목: ${lecture.title}</div>
        <div>강사: ${lecture.instructor}</div>
        <div>카테고리: ${lecture.category}</div>
        <div>소개: ${lecture.content}</div>
      </div>
    `;
  }
}

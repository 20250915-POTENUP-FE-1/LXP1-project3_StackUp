import { $ } from "../../utils/dom.js";
import { store } from "../../store/store.js";
import { makeId } from "../../utils/idGenerator.js";
import { LS_KEY } from "../../pages/Lecture.js";

const res = await fetch("/src/js/ui/lecture-form/lecture-form.html", {
  cache: "no-cache",
});
if (!res.ok) throw new Error(`HTTP ${res.status}`); //404 505 에러대비

const html = await res.text();
const doc = new DOMParser().parseFromString(html, "text/html");

const header = document.createDocumentFragment();
if (!header) throw new Error("'.content-header'를 찾을 수 없어요.");

const fragment = document.createDocumentFragment();
[...doc.body.childNodes].forEach((node) => fragment.appendChild(node));
document.querySelector(".content-header").prepend(fragment);

const preview = document.querySelector("#preview");
document.querySelector("#thumb-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const base64Image = event.target.result;
    localStorage.setItem("thumbnailImage", base64Image);
    // 미리보기 표시
    preview.src = base64Image;
  };
  // 파일을 Base64 문자열로 변환
  reader.readAsDataURL(file);
});

const registLecture = (e) => {
  e.preventDefault();
  const savedLectures = store.getLocalStorage(LS_KEY.lectures);
  const lectures = Array.isArray(savedLectures) ? savedLectures : [];
  const form = e.target.closest("form") || $("#lecture-regist-form");
  if (!form) return;
  const lecCategory = form.querySelector("#category")?.value ?? "";
  const lecTitle = form.querySelector("#title-input")?.value?.trim() ?? "";
  const lecInstructor =
    form.querySelector("#instructor-input")?.value?.trim() ?? "";
  const lecDesc = form.querySelector("#desc-input")?.value?.trim() ?? "";
  const lecThumb = form.querySelector("#preview")?.src ?? "";
  console.log(lecThumb);
  if (!lecCategory) return alert("카테고리를 선택하세요.");
  if (!lecTitle) return alert("강의명을 입력하세요.");
  if (!lecInstructor) return alert("강사명을 입력하세요.");
  if (!lecDesc) return alert("강의 설명을 입력하세요.");
  if (!lecThumb) return alert("썸네일 주소를 입력하세요.");

  const newLecture = {
    id: makeId(),
    title: lecTitle,
    category: lecCategory,
    instructor: lecInstructor,
    thumbnail: lecThumb,
    content: lecDesc,
    createdAt: Date.now(),
  };

  lectures.unshift(newLecture);
  store.setLocalStorage(LS_KEY.lectures, lectures);
  form.reset();
  const mainContent = $(".main-content");
  const activeBtn = mainContent.querySelector(".category-btn.active");
  const activeBtnCode = activeBtn.dataset.categoryCode ?? "all";
  let df;
  if (lecCategory === activeBtnCode || "all" === activeBtnCode) {
    df = `
  <li class="lecture-item" data-id="${newLecture.id}">
  <span class="lecture-image">
    <img src="${newLecture.thumbnail}" alt="강의 이미지" />
  </span>
  <div class="lecture-info">
    <span class="lecture-title">${newLecture.title}</span>
    <span class="lecture-description">${newLecture.content}</span>
    <span class="lecture-instructor">${newLecture.instructor} 강사님</span>
  </div>
  <div class="lecture-actions">
    <button type="button" class="edit-btn modal-toggle-btn" data-modal-target="editModal">수정</button>
    <button type="button" class="delete-btn">삭제</button>
  </div>
</li>
  `;
    $("#lecture-list").insertAdjacentHTML("afterbegin", df);
  }
  form.querySelector("#title-input")?.focus();
};

$(".main-content").addEventListener("submit", (e) => {
  e.preventDefault();
  registLecture(e);
});

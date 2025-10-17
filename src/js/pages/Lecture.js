import { $ } from "../utils/dom.js";
import { store } from "../store/store.js";
export const LS_KEY = {
  lectures: "lectures",
};
export function Lecture() {
  this.lectures = {};
  this.currentCategory = {
    code: "all",
  };

  this.init = function () {
    const savedLectures = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(savedLectures) ? savedLectures : [];
    if (!savedLectures) store.setLocalStorage(LS_KEY.lectures, this.lectures);

    this.currentCategory = {
      code: "all",
    };

    renderLecture();
    renderCategory();
  };
  const renderLecture = () => {
    $("#lecture-list").innerHTML = "";

    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];

    const code = this.currentCategory.code;
    const list =
      code === "all"
        ? this.lectures
        : this.lectures.filter((lec) => lec.category === code);

    $("#lecture-list").innerHTML = list
      .map((lecture) => {
        const { id, title, instructor, content, thumbnail } = lecture;
        return `
<li class="lecture-item" data-id="${id}">
  <span class="lecture-image">
    <img src="${thumbnail}" alt="강의 이미지" />
  </span>
  <div class="lecture-info">
    <span class="lecture-title">${title}</span>
    <span class="lecture-description">${content}</span>
    <span class="lecture-instructor">${instructor} 강사님</span>
  </div>
  <div class="lecture-actions">
    <button type="button" class="edit-btn modal-toggle-btn" data-modal-target="editModal">수정</button>
    <button type="button" class="delete-btn">삭제</button>
  </div>
</li>`;
      })
      .join("");
  };

  const renderCategory = () => {
    const code = this.currentCategory.code;
    document.querySelectorAll(".category-btn").forEach((btn) => {
      const btnCode = btn.dataset.categoryCode ?? "all";
      btn.classList.toggle("active", btnCode === code);
    });
  };
  $(".main-content").addEventListener("click", (e) => {
    const btn = e.target.closest(".category-btn");
    if (!btn) return;
    this.currentCategory = { code: btn.dataset.categoryCode ?? "all" };
    renderCategory();
    renderLecture();
  });

  const editLectureForm = (btn) => {
    const li = btn.closest(".lecture-item");
    if (!li) return;
    const id = li.dataset.id;
    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];

    const target = this.lectures.find((l) => l.id === id);
    if (!target) return alert("수정할 강의를 찾을 수 없습니다.");
    $("#edit-lecture-id").value = target.id;
    $("#edit-lecture-category").value = target.category;
    $("#edit-lecture-title").value = target.title;
    $("#edit-lecture-instructor").value = target.instructor;
    $("#edit-lecture-content").value = target.content;
  };

  const editLecture = () => {
    const id = $("#edit-lecture-id").value;
    const category = $("#edit-lecture-category").value;
    const title = $("#edit-lecture-title").value.trim();
    const instructor = $("#edit-lecture-instructor").value.trim();
    const content = $("#edit-lecture-content").value.trim();

    if (!category) return alert("카테고리를 입력하세요.");
    if (!title) return alert("강의명을 입력하세요.");
    if (!instructor) return alert("강사명을 입력하세요.");
    if (!content) return alert("강의 설명을 입력하세요.");

    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];

    const idx = this.lectures.findIndex((l) => l.id === id);
    if (idx === -1) return alert("일치하는 강의를 찾을 수 없습니다.");

    const edited = {
      ...this.lectures[idx],
      category,
      title,
      instructor,
      content,
    };

    this.lectures.splice(idx, 1, edited);
    store.setLocalStorage(LS_KEY.lectures, this.lectures);
    renderLecture();

    document.querySelector("#editModal .modal-close")?.click();
  };
  const deleteLecture = (btn) => {
    const li = btn.closest(".lecture-item");
    if (!li) return;
    const id = li.dataset.id;

    if (!confirm("정말로 삭제하시겠습니까?")) return;

    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];
    this.lectures = this.lectures.filter((l) => l.id !== id);

    store.setLocalStorage(LS_KEY.lectures, this.lectures);
    renderLecture();
  };

  $("#lecture-list").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.classList.contains("edit-btn")) {
      editLectureForm(btn);
    } else if (btn.classList.contains("delete-btn")) {
      deleteLecture(btn);
    }
  });

  $("#lecture-edit-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    editLecture();
  });
  $("#lecture-list").addEventListener("click", (e) => {
    if (e.target.closest("button")) return;

    const li = e.target.closest("li");
    if (!li) return;
    const liId = li.dataset.id;
    location.href = `/src/js/pages/detail.html?id=${liId}`;
  });
}

const lecture = new Lecture();
lecture.init();

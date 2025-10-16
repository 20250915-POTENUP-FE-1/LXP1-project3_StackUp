import { $ } from "../utils/dom.js";
import { store } from "../store/store.js";

function Lecture() {
  // 1️⃣ 버튼 영역과 리스트 영역 가져오기
  const catBar = document.querySelector(".category-select");
  const listEl = document.getElementById("lecture-list");

  // 2️⃣ localStorage에서 강의 데이터 읽기
  const LECTURES = JSON.parse(localStorage.getItem("lectures") || "[]");

  // 3️⃣ 한글 버튼 이름 → 실제 카테고리 ID(cat_*)로 바꾸는 표
  const NAME_TO_ID = {
    코딩기초: "cat_basic",
    데이터분석: "cat_data",
    생성형AI: "cat_ai",
    디자인: "cat_design",
    프로그래밍언어: "cat_prog",
  };

  // 4️⃣ 강의 목록을 HTML로 표시하는 함수
  const renderList = (rows) => {
    if (!rows.length) {
      listEl.innerHTML = `
        <li class="lecture-item">
          <div class="lecture-info">
            <span class="lecture-title">해당 카테고리 강의가 없습니다.</span>
          </div>
        </li>`;
      return;
    }

    listEl.innerHTML = rows
      .map(
        (l) => `
      <li class="lecture-item" data-id="${l.id}">
        <span class="lecture-image">
          <img src="${
            l.thumbnail || "https://picsum.photos/320/180"
          }" alt="강의 이미지">
        </span>
        <div class="lecture-info">
          <span class="lecture-title">${l.title}</span>
          <span class="lecture-description">${l.content || ""}</span>
          <span class="lecture-instructor">${l.instructor || ""} 강사님</span>
        </div>
        <div class="lecture-actions">
          <button class="edit-btn modal-toggle-btn" data-modal-target="editModal">수정</button>
          <button class="delete-btn">삭제</button>
        </div>
      </li>
    `
      )
      .join("");
  };

  // 5️⃣ 카테고리 필터 함수
  const filterBy = (code) => {
    if (code === "all") return LECTURES;
    const catId = NAME_TO_ID[code] || code;
    return LECTURES.filter((l) => l.category === catId);
  };

  // 6️⃣ 버튼 클릭 이벤트 등록
  if (catBar) {
    catBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-btn");
      if (!btn) return;

      // 버튼 활성화 표시 바꾸기
      catBar
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 눌린 버튼의 data-category-code 읽어서 필터
      const code = btn.dataset.categoryCode;
      renderList(filterBy(code));
    });
  }

  // 7️⃣ 페이지 처음 켰을 때 전체 강의 보여주기
  renderList(LECTURES);
}

const lecture = new Lecture();

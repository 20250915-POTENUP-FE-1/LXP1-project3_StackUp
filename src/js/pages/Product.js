import { $ } from "../utils/dom.js";
import { store } from "../store/store.js";

function Product() {

  // 상태관리변수1. 도서 상태
  this.books = {}; 
  // 상태관리변수2. 현재 선택된 카테고리 상태
  this.currentCategory = {};

  // 초기화메소드
  this.init = () => {
    // 초기화1) 카테고리 초기화
    this.currentCategory = {
      code: "it",
      name: "IT"
    };
    renderCategory();

    // 초기화2) 도서상태 초기화
    this.books = store.getLocalStorage("books") || {
      it: [],
      science: [],
      literature: [],
      history: []
    };
    if(this.books.length !== 0)
      renderBook();
  }

  // 렌더링용 함수1. 도서 상태에 따라 렌더링되는 함수
  const renderBook = () => {
    const bookItems 
      = this.books[this.currentCategory.code]
          .map((book) => {  
            return `
              <li class="book-item">
                <div class="book-info">
                  <span class="book-name">${book.title}</span>
                  <span class="book-price">₩${book.price.toLocaleString()}</span>
                </div>
                <div class="book-actions">
                  <button class="edit-btn modal-toggle-btn" data-modal-target="editModal">수정</button>
                  <button class="delete-btn">삭제</button>
                </div>
              </li>
            `; 
          }).join("");
    
    $("#book-list").innerHTML = bookItems;
    $("#book-count").innerText = this.books[this.currentCategory.code].length;
  }
  // 렌더링용 함수2. 현재 선택된 카테고리 상태에 따라 렌더링되는 함수
  const renderCategory = () => {
    $("#book-category-name").innerText = this.currentCategory.name;
    document.querySelectorAll(".category-btn").forEach((categoryBtn) => {
      categoryBtn.classList.toggle("active", categoryBtn.dataset.categoryCode === this.currentCategory.code);
    })
  }

  // 기능용 함수1. 도서 추가 기능
  const registBook = () => {

    const bookName = $("#book-name-input").value;
    const bookPrice = Number($("#book-price-input").value);

    if(!bookName.trim() || !bookPrice){
      alert("값이 누락되었습니다. 값을 다 입력해주세요.");
      return;
    }

    this.books[this.currentCategory.code].push({
      title: bookName,
      price: bookPrice
    })
    store.setLocalStorage("books", this.books); 
    renderBook();

    $("#book-regist-form").reset();
    $("#book-name-input").focus();
  }
  // 기능용 함수2. 도서 수정 기능
  const editBookForm = (e) => {
    const $bookItem = e.target.closest(".book-item");
    const bookName = $bookItem.querySelector(".book-name").innerText;
    const bookPrice = Number($bookItem.querySelector(".book-price").innerText.replace(/[₩,]/g, ""));
    const bookIndex = Array.from($("#book-list").children).indexOf($bookItem);

    $("#edit-book-name").value = bookName;
    $("#edit-book-price").value = bookPrice;
    $("#edit-book-index").value = bookIndex;
  }
  const editBook = () => {

    const editBookName = $("#edit-book-name").value;
    const editBookPrice = Number($("#edit-book-price").value);
    const editBookIndex = $("#edit-book-index").value;

    this.books[this.currentCategory.code][editBookIndex] = {
      title: editBookName,
      price: editBookPrice
    };
    store.setLocalStorage("books", this.books);
    renderBook();

    $("#editModal .modal-close").click();
  }
  // 기능용 함수3. 도서 삭제 기능
  const deleteBook = (e) => {
    if(confirm("정말로 삭제하시겠습니까?")){
      const deleteBookIndex = Array.from($("#book-list").children).indexOf(e.target.closest(".book-item"));
      this.books[this.currentCategory.code].splice(deleteBookIndex, 1);
      store.setLocalStorage("books", this.books);
      renderBook();
    }
  }

  // 이벤트 핸들러1. 카테고리 선택 이벤트 핸들러
  $(".category-select").addEventListener("click", (e) => {
    if(e.target.classList.contains("category-btn")){
      this.currentCategory = {
        code: e.target.dataset.categoryCode,
        name: e.target.innerText
      };
      renderCategory();
      renderBook();
    }
  })

  // 이벤트 핸들러2. 도서 추가(submit) 이벤트 핸들러
  $("#book-regist-form").addEventListener("submit", (e) => {
    e.preventDefault(); 
    registBook();
  })

  // 이벤트 핸들러3. 도서 수정 모달창, 도서 삭제 이벤트 핸들러
  $("#book-list").addEventListener("click", (e) => {
    if(e.target.classList.contains("edit-btn")){
      editBookForm(e);
    }
    if(e.target.classList.contains("delete-btn")) {
      deleteBook(e);
    }
  })

  // 이벤트 핸들러4. 도서 수정(submit) 이벤트 핸들러
  $("#book-edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    editBook();
  })

}

const product = new Product();
product.init(); // 초기화 시키기
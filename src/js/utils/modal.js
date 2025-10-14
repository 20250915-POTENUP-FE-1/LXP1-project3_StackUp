

document.querySelector("#book-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-toggle-btn")) {
    document.querySelector(`#${e.target.dataset.modalTarget}`).style.display = 'flex';
  }
});

document.querySelectorAll('.modal').forEach((modal) => {
  // 모달 내의 x 클릭시 모달 닫기
  modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
  // 모달 내의 취소 버튼 클릭시 모달 닫기
  modal.querySelector('.cancel-btn').addEventListener('click',  () => closeModal(modal));
  // 모달 배경 클릭시 모달 닫기
  modal.addEventListener('click', function(e) {
    e.target === modal && closeModal(modal);
  });
});

function closeModal(modal) {
  modal.style.display = 'none';
  if(modal.querySelectorAll("form")) {
    modal.querySelectorAll("form").forEach((form) => {
      form.reset();
    });
  }
}



fetch("/src/js/ui/lecture-form/lecture-form.html")
  .then((res) => res.text())
  .then((resText) => {
    document
      .querySelector(".content-header")
      .insertAdjacentHTML("afterbegin", resText);
  });
document.addEventListener("DOMContentLoaded", () => {
  const $form = document.getElementById("lecture-regist-form");
  if (!$form) return;

  const $cat = document.getElementById("category");
  const $title = document.getElementById("title-input");
  const $teacher = document.getElementById("teacher-input");
  const $thumb = document.getElementById("thumb-input");
  const $desc = document.getElementById("desc-input");

  $form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      category: $cat.value,
      title: $title.value.trim(),
      instructor: $teacher.value.trim(),
      thumbnail: $thumb.files?.[0]?.name || "(파일 미선택)",
      content: $desc.value.trim(),
    };

    console.clear();
    console.log("📦 Step1 - 폼에서 읽은 값:", data);
    alert("Step1 OK! 콘솔을 확인해 보세요.");
  });
});

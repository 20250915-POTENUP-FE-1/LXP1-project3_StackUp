fetch("/src/js/ui/category-bar/category-bar.html")
  .then((res) => res.text())
  .then((resText) => {
    document
      .querySelector(".main-content")
      .insertAdjacentHTML("afterbegin", resText);
  });

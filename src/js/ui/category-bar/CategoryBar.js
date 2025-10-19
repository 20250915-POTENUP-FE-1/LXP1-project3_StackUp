fetch("/src/js/ui/category-bar/category-bar.html")
  .then((res) => res.text())
  .then((resText) => {
    document
      .querySelector(".content-header")
      .insertAdjacentHTML("afterend", resText);
  });

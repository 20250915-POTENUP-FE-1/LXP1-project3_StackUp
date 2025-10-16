fetch("/src/js/ui/lecture-form/lecture-form.html")
  .then((res) => res.text())
  .then((resText) => {
    document
      .querySelector(".content-header")
      .insertAdjacentHTML("afterbegin", resText);
  });

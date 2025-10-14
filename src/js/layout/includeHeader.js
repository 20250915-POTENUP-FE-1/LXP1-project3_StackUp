fetch("/layout/header.html")
  .then( (response) => response.text() )
  .then( (responseText) => {
    document.querySelector(".container").insertAdjacentHTML("afterbegin", responseText);
  } )
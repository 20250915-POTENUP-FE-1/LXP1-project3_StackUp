fetch("/layout/sidebar.html")
  .then( (response) => response.text() )
  .then( (responseText) => {
    document.querySelector(".main-container").insertAdjacentHTML("afterbegin", responseText);
  } )
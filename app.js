document.addEventListener("DOMContentLoaded", () => {
  let div = document.querySelector("div");
  fetch("http://localhost:3000/sneakers")
    .then((res) => res.json())
    .then((data) =>
      data.forEach((Obj) => {
        images = document.createElement("img");
        images.src = Obj.image;
        div.appendChild(images);
      })
    );
});

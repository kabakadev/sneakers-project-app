document.addEventListener("DOMContentLoaded", () => {
  let sneakerGrid = document.querySelector("#sneaker-grid");
  const rangePrices = document.querySelectorAll(".range-input input");
  const priceInput = document.querySelectorAll(".price-input input");
  //dropdown
  const dropDown = document.querySelector(".dropdown");
  const select = dropDown.querySelector(".select");
  const caret = dropDown.querySelector(".caret");
  const menu = dropDown.querySelector(".menu");
  const options = dropDown.querySelectorAll(".menu li");
  const selected = dropDown.querySelector(".selected");

  select.addEventListener("click", () => {
    select.classList.toggle("select-clicked");
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
  });

  let sneakerData = [];
  console.log(rangePrices);

  fetch("http://localhost:3000/sneakers")
    .then((res) => res.json())
    .then((data) => {
      sneakerData = data;
      displaySneakers(sneakerData);
    });

  function displaySneakers(sneakers) {
    sneakers.forEach((sneaker) => {
      const sneakerItem = document.createElement("div");
      sneakerItem.classList.add("border", "p-4", "rounded");

      const image = document.createElement("img");
      image.src = sneaker.image;
      image.classList.add("w-full", "h-auto", "object-cover", "rounded");

      const details = document.createElement("div");
      details.classList.add("mt-4");

      const brandModel = document.createElement("p");
      brandModel.textContent = `${sneaker.brand} - ${sneaker.model}`;
      brandModel.classList.add("font-bold", "text-lg", "text-center");

      const color = document.createElement("p");
      color.textContent = `Color: ${sneaker.color}`;
      color.classList.add("text-sm", "text-gray-600", "text-center");

      const size = document.createElement("p");
      size.textContent = `Size: ${sneaker.size}`;
      size.classList.add("text-sm", "text-gray-600", "text-center");

      const price = document.createElement("p");
      price.textContent = `Price: $${sneaker.price}`;
      price.classList.add("text-sm", "text-center", "font-semibold");

      details.appendChild(brandModel);
      details.appendChild(color);
      details.appendChild(size);
      details.appendChild(price);

      sneakerItem.appendChild(image);
      sneakerItem.appendChild(details);
      sneakerGrid.appendChild(sneakerItem);
    });
  }
  function filterSneakers() {
    console.log(typeof priceInput[0].value);
    const minPrice = parseInt(priceInput[0].value);
    const maxPrice = parseInt(priceInput[1].value);

    sneakerGrid.innerHTML = "";

    const filteredSneakers = sneakerData.filter(
      (sneaker) => sneaker.price >= minPrice && sneaker.price <= maxPrice
    );
    displaySneakers(filteredSneakers);
  }
  rangePrices.forEach((newInput) => {
    newInput.addEventListener("input", () => {
      // console.log(rangePrices);
      let minVal = parseInt(rangePrices[0].value);
      let maxVal = parseInt(rangePrices[1].value);
      priceInput[0].value = minVal;
      priceInput[1].value = maxVal;

      // progressBar.style.left = (minVal / rangePrices[0].max) * 100 + "%";
      // progressBar.style.right = 100 - (maxVal / rangePrices[1].max) * 100 + "%";
      filterSneakers();
    });
  });
  priceInput.forEach((input) => {
    input.addEventListener("input", () => {
      console.log(input.value);
      let minVal = parseInt(priceInput[0].value);
      let maxVal = parseInt(priceInput[1].value);

      if (minVal >= rangePrices[0].min && minVal <= rangePrices[0].max) {
        rangePrices[0].value = minVal;
      }
      if (maxVal >= rangePrices[1].min && maxVal <= rangePrices[1].max) {
        rangePrices[1].value = maxVal;
      }
      filterSneakers();
    });
  });
  function filterByBrand() {
    console.log(selected.innerText);
    const brandFilter = sneakerData.filter(
      (sneaker) => sneaker.brand === selected.innerText
    );
    sneakerGrid.innerHTML = "";
    displaySneakers(brandFilter);
  }

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      options.forEach((option) => {
        option.classList.remove("active");
      });
      option.classList.add("active");
      filterByBrand();
    });
  });
});

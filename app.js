document.addEventListener("DOMContentLoaded", () => {
  let sneakerGrid = document.querySelector("#sneaker-grid");

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
  //store sneakers here
  let sneakerData = [];
  let wishlistItem = [];

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
      details.classList.add("mt-4", "flex", "flex-col", "items-center");

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

      const button = document.createElement("button");
      button.textContent = "Wishlist";
      button.classList.add(
        "bg-blue-300",
        "text-white",
        "text-center",
        "text-sm",
        "rounded",
        "px-2",
        "py-1",
        "mt-4"
      );

      button.addEventListener("click", () => {
        const sneakerId = sneaker.id;
        if (!wishlistItem.includes(sneakerId)) {
          wishlistItem.push(sneakerId);
          button.classList.remove("bg-blue-300");
          button.classList.add("bg-gray-300");
          updateWishlist(sneaker);
          console.log("succeeded");
        } else {
          button.classList.add("bg-gray -300");
        }
      });

      details.appendChild(brandModel);
      details.appendChild(color);
      details.appendChild(size);
      details.appendChild(price);
      details.appendChild(button);

      sneakerItem.appendChild(image);
      sneakerItem.appendChild(details);
      sneakerGrid.appendChild(sneakerItem);
    });
  }
  function updateWishlist(sneaker) {
    const wishlistGrid = document.getElementById("wishlit-grid");
    // console.log(sneaker);
    const wishItem = document.createElement("div");
    wishItem.classList.add("border", "p-4", "rounded");

    const image = document.createElement("img");
    image.src = sneaker.image;
    image.classList.add("w-full", "h-auto", "object-cover", "rounded");
    console.log(image);

    const details = document.createElement("div");
    details.classList.add("mt-4", "flex", "flex-col", "items-center");

    const brandModel = document.createElement("p");
    brandModel.textContent = `${sneaker.brand} - ${sneaker.model}`;
    brandModel.classList.add("font-bold", "text-lg", "text-center");

    const button = document.createElement("button");
    button.textContent = "Remove";
    button.classList.add(
      "bg-red-300",
      "text-white",
      "text-center",
      "text-sm",
      "rounded",
      "px-2",
      "py-1",
      "mt-4"
    );
    button.addEventListener("click", () => {
      wishItem.remove();
    });

    details.appendChild(brandModel);
    details.appendChild(button);

    wishItem.appendChild(image);
    wishItem.appendChild(details);
    wishlistGrid.appendChild(wishItem);
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

  priceInput.forEach((input) => {
    input.addEventListener("input", () => {
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

  //section
  const home = document.querySelector("#home-section");
  const wishlist = document.querySelector("#wishlist-section");
  const showHomeSection = document.querySelector("a[href='#']");
  const showWishListSection = document.querySelector("a[href='#wishlist']");

  home.classList.remove("hidden");
  showHomeSection.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e);
    home.classList.remove("hidden");
    wishlist.classList.add("hidden");
  });
  showWishListSection.addEventListener("click", (e) => {
    e.preventDefault();
    wishlist.classList.remove("hidden");
    home.classList.add("hidden");
  });
});

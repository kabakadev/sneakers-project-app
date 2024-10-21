document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "https://json-db-lyjd.onrender.com/sneakers";
  let sneakerGrid = document.querySelector("#sneaker-grid");

  const priceInput = document.querySelectorAll(".price-input input");
  //dropdown
  const dropDown = document.querySelector(".dropdown");
  const select = dropDown.querySelector(".select");
  const caret = dropDown.querySelector(".caret");
  const menu = dropDown.querySelector(".menu");
  const options = dropDown.querySelectorAll(".menu li");

  //used in filtering and dropdown
  const selected = dropDown.querySelector(".selected");

  //sneakersection
  const sneakerSecDetails = document.querySelector("#sneaker-details");

  //section
  const home = document.querySelector("#home-section");
  const wishlist = document.querySelector("#wishlist-section");
  const showHomeSection = document.querySelector("a[href='#']");
  const showWishListSection = document.querySelector("a[href='#wishlist']");

  select.addEventListener("click", () => {
    select.classList.toggle("select-clicked");
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
  });
  //store sneakers here
  let sneakerData = [];
  let wishlistItem = [];

  fetch(`${baseUrl}`)
    .then((res) => res.json())
    .then((data) => {
      sneakerData = data;
      displaySneakers(sneakerData);
    });
  //function to get sneaker objects and display to the DOM
  function displaySneakers(sneakers) {
    sneakers.forEach((sneaker) => {
      //sneakerItem is the div that contains all the elements
      const sneakerItem = document.createElement("div");
      sneakerItem.classList.add("border", "p-4", "rounded");

      const image = document.createElement("img");
      image.src = sneaker.image;
      image.classList.add(
        "w-full",
        "h-auto",
        "object-cover",
        "rounded",
        "cursor-pointer"
      );

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
      //Enables the user to click on an image and view the details of the sneaker,
      image.addEventListener("click", () => {
        sneakerSecDetails.classList.remove("hidden");
        wishlist.classList.add("hidden");
        home.classList.add("hidden");
        showSneakerDetails(sneaker);
      });
      //calls the update wishlist function and changes the button to gray when an item added to wishlist,
      button.addEventListener("click", () => {
        const sneakerId = sneaker.id;
        if (!wishlistItem.includes(sneakerId)) {
          wishlistItem.push(sneakerId);
          button.classList.remove("bg-blue-300");
          button.classList.add("bg-gray-300");
          updateWishlist(sneaker);
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
  //function for showing sneaker details and gets extra property from the server
  function showSneakerDetails(sneaker) {
    const sneakerSecImage = document.querySelector("#sneaker-image");
    const sneakerSecBrand = document.querySelector("#sneaker-brand");
    const sneakerSecColor = document.querySelector("#sneaker-color");
    const sneakerSecSize = document.querySelector("#sneaker-size");
    const sneakerSecPrice = document.querySelector("#sneaker-price");
    const sneakerSecComment = document.querySelector("#text-content");

    sneakerSecImage.src = sneaker.image;
    sneakerSecBrand.textContent = `${sneaker.brand} - ${sneaker.model}`;
    sneakerSecColor.textContent = sneaker.color;
    sneakerSecSize.textContent = sneaker.size;
    sneakerSecPrice.textContent = `$${sneaker.price}`;
    sneakerSecComment.textContent = sneaker.comments;
  }
  //function to update wishlist
  function updateWishlist(sneaker) {
    const wishlistGrid = document.getElementById("wishlit-grid");

    //wishitem is the div that contains the elements
    const wishItem = document.createElement("div");
    wishItem.classList.add("border", "p-4", "rounded");

    const image = document.createElement("img");
    image.src = sneaker.image;
    image.classList.add("w-full", "h-auto", "object-cover", "rounded");

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

    //removes item from wishlist and also from the wishlist array
    button.addEventListener("click", () => {
      wishItem.remove();

      let index = wishlistItem.indexOf(sneaker.id);
      if (index !== -1) {
        wishlistItem.splice(index, 1);
      }
    });

    details.appendChild(brandModel);
    details.appendChild(button);

    wishItem.appendChild(image);
    wishItem.appendChild(details);
    wishlistGrid.appendChild(wishItem);
  }

  //function to filter sneakers
  function filterSneakers() {
    //gets the values of the price from the input field
    const minPrice = parseInt(priceInput[0].value);
    const maxPrice = parseInt(priceInput[1].value);
    const selectedBrand = selected.innerText;

    sneakerGrid.innerHTML = "";

    //clears the grid and adds the sneake based on the filter price
    const filteredSneakers = sneakerData.filter(
      (sneaker) => {
        const isWithinPriceRange = sneaker.price >= minPrice && sneaker.price <= maxPrice
        const matchesBrand = selectedBrand === 'All' || sneaker.brand === selectedBrand
        return isWithinPriceRange $$ matchesBrand
      }
    );
    displaySneakers(filteredSneakers);
  }

  //calls the filter function when the input values change
  priceInput.forEach((input) => {
    input.addEventListener("input", () => {
      filterSneakers();
    });
  });

  //logic for filtering by brand
  function filterByBrand() {
    const brandFilter = sneakerData.filter(
      (sneaker) => sneaker.brand === selected.innerText
    );
    sneakerGrid.innerHTML = "";
    displaySneakers(brandFilter);
  }

  //drop down menu logic when an option is clicked
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

  //by deault shows the home page. home refers to the section, showHomeSection refers to the navigation
  home.classList.remove("hidden");
  showHomeSection.addEventListener("click", (e) => {
    e.preventDefault();

    home.classList.remove("hidden");
    wishlist.classList.add("hidden");
    sneakerSecDetails.classList.add("hidden");
  });
  showWishListSection.addEventListener("click", (e) => {
    e.preventDefault();
    wishlist.classList.remove("hidden");
    home.classList.add("hidden");
    sneakerSecDetails.classList.add("hidden");
  });
});

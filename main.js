// add fixed position class when scrolling
function navbar() {
  let nav = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      nav.classList.add("position-fixed", "py-2");
    } else {
      nav.classList.remove("position-fixed", "py-2");
    }
  });
}
navbar();
// coundown function for saling
// print current year
function date(...target) {
  let targetDate = new Date(...target).getTime();

  let interval = setInterval(function () {
    let now = new Date().getTime();
    let difference = targetDate - now;
    document.getElementById("days_div").innerHTML = Math.floor(
      difference / (1000 * 60 * 60 * 24),
    );
    document.getElementById("hours_div").innerHTML = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    document.getElementById("minutes_div").innerHTML = Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60),
    );
    document.getElementById("seconds_div").innerHTML = Math.floor(
      (difference % (1000 * 60)) / 1000,
    );
    //    when the will be finished
    if (difference < 0) {
      clearInterval(interval);
      document.getElementById("timer").innerHTML = "Time is Over!";
    }
  }, 1000);
  document.getElementById("printYear").textContent = new Date().getFullYear();
}
// year , month[0-11] , day , hour , minut , seonds
date(2026, 5, 1, 0, 0, 0);

let data = [];
let favoriteProduct = [];

// check from data
if (localStorage.getItem("favProducts")) {
  favoriteProduct = JSON.parse(localStorage.getItem("favProducts"));
} else {
  favoriteProduct = [];
}

// function for add data from api
async function products() {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category/groceries",
    );

    // if you find any error throw that
    if (!response.ok) throw new Error("error in conection");
    const result = await response.json();
    // All data here from api
    const data_products = result.products;
    // push data in main array
    data = data_products.map((element) => element);

    // ======================================'
    // number of trending products

    // add more items in the trending section
    document.querySelector(".btn_Trending").onclick = () =>
      trendingProducts(count <= 6 ? (count += 4) : (count = 8));

    // call back functions
    trendingProducts();
    all_products();
    checkInputCount();
    search(data);
  } catch (error) {
    console.error("Error:", error);
  }
}
products();

let count = 4;
// function of adding trending products
function trendingProducts(counter = count) {
  let card_product_trending = "";
  for (let i = 0; i < counter; i++) {
    card_product_trending += `
                        <div class="card-product col-6 col-md-4 col-lg-4">
                    <div class="image-frame shadow d-flex align-items-center justify-content-center py-3 position-relative">
                        <img src="${data[i].images[0]}" onerror = "this.src = './images/error-product-img.jpg';" alt = "${data[i].images[0]}">
                        <button class ="btn btn-success " onclick = "theCart(${i})" title ="add to cart"><i class="fa-solid fa-cart-arrow-down"></i></button>
                    </div>
                    <div class="description-card text-center mt-2 mx-auto">
                        <h3 class="productName">${data[i].title || "Unkown"}</h3>
                        <p class="text-secondary "dir="rtl">${data[i].price + " ج" || "00"}</p>
                    </div>
                </div>
        `;
  }

  document.querySelector(".products").innerHTML = card_product_trending;
  return counter;
}

// function of adding all products
function all_products() {
  let card = "";

  for (let i = 0; i < data.length; i++) {
    card += `
              <div class="card-product shadow card" >
                <div class="image-frame">
                  <img src="${data[i].images[0]}" alt="${data[i].images[0]}" onerror = "this.src= './images/error-product-img.jpg';">
                </div>
                <div class="body-card-product">
                <h3 class="productName">${data[i].title}</h3>
                  <p>
                    ${data[i].description || "no decription about this product !!"}
                  </p>
                  <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <h3 class="text-success priceProduct" dir="rtl">${data[i].price + " ج" || "00"}</h3>
                    <input type="number"
                     class="form-control w-50 inp-count"
                     placeholder="Total is ${data[i].minimumOrderQuantity}">
                  </div>

                  <button class="btn btn-success mt-2 buy" onclick = "theCart(${i})">
                    Add to Cart <i class="fa-solid fa-cart-arrow-down"></i>
                  </button>
                </div>
              </div>
        `;
    // default value
    data[i].numberOfOrder = 1;
  }
  document.getElementById("all_products").innerHTML = card;
}

function checkInputCount() {
  let inputs = document.querySelectorAll(".inp-count");
  inputs.forEach((input, index) => {
    // check after
    input.addEventListener("input", () => {
      if (input.value < ++data[index].minimumOrderQuantity && input.value > 0) {
        // add data to array
        data[index].numberOfOrder = input.value;
        data[index].totalProducts = input.value * data[index].price || 1;

        // print price
        input.previousElementSibling.textContent =
          input.value * data[index].price + " ج";
      } else {
        input.value = "1";
      }
    });
  });
}
function theCart(index) {
  favoriteProduct.push(data[index]);
  localStorage.setItem("favProducts", JSON.stringify(favoriteProduct));
}

function search(data) {
  let btn_search = document.getElementById("btn_search");
  let productName = document.querySelectorAll(".productName");


  btn_search.addEventListener("click", () => {
    let searchInput = document
      .getElementById("search_input")
      .value.trim()
      .toLowerCase();

    productName.forEach((product) => {
      if (
        product.textContent.trim().toLowerCase().startsWith(searchInput) ||
        product.textContent.trim().toLowerCase().endsWith(searchInput) ||
        product.textContent.toLowerCase().includes(searchInput)
      ) {
        if (searchInput.length >= 1) {
         
          product.classList.add("found");

          // show the first result
          document.querySelectorAll(".found")[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });


        }
      } else {
        product.classList.remove("found");
      }
    });
  });
}


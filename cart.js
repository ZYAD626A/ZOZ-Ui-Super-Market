let data;
if (localStorage.getItem("favProducts")) {
  data = JSON.parse(localStorage.getItem("favProducts"));
} else {
  data = [];
}

function showItems() {
  let card = "";
  console.log(data);

  data.forEach((product) => {
    if (!product.numberOfOrder) {
      product.numberOfOrder = 1;
    }

    if (!product.totalProducts) {
      product.totalProducts = product.numberOfOrder * product.price;
    }
  });

  data.forEach((product, index) => {
    card += `
                 <div class="cart-item" data-id="1">
            <div class="row align-items-center">
              <div class="col-md-5 col-6">
                <h5 class="item-name mb-1">${product.title}</h5>
                <p class="item-price mb-0">
                  السعر: <span class="fw-bold">${product.price}</span> $
                </p>
              </div>
              <div class="col-md-3 col-4 mt-2 mt-md-0">
                <label class="form-label small text-secondary">العدد</label>
                <input
                  type="number"
                  class="item-quantity input_count"
                  value="${product.numberOfOrder}"
                  min="1"
                  max="${data[index].minimumOrderQuantity}"
                  step="1"
            
                />
              </div>
              <div
                class="col-md-4 col-12 mt-3 mt-md-0 d-flex justify-content-md-end justify-content-between align-items-center"
              >
                <span class="fw-bold text-dark ms-3" style="font-size: 1.2rem"
                  ><span class="item-total">${product.totalProducts}</span> ج</span
                >
                <button class="remove-btn mx-2 d-flex gap-1" onclick = "removeProduct(${index})">
                  <i class="bi bi-trash3"></i> إزالة
                </button>
                <button class="btn btn-primary" onclick ="showMore(${index})">المزيد </button>
              </div>
            </div>
          </div>
        `;
  });

  let parentElement = document.getElementById("parentElement");
  if (data.length === 0) {
    parentElement.innerHTML = `
              <div
            id="emptyCartMessage"
            class="alert"
            style="
              background-color: #f9f1cb;
              color: #5e4b1e;
              display: inline-block;
            "
            role="alert"
          >
            🛍️ العربة فارغة حالياً. تصفح المنتجات وأضفها هنا!
            <a href="./index.html" class ="btn btn-danger">تسوق ألان</a>
          </div>
    `;
  } else {
    parentElement.innerHTML = card;
  }
  inputs();
  summraize();
}

window.onload = () => showItems();

function removeProduct(index) {
  data.splice(index, 1);
  localStorage.setItem("favProducts", JSON.stringify(data));
  showItems();
}

function showMore(index) {
  Swal.fire({
  title: data[index].title,
  html: `
    <div style="text-align:right">
      <p><strong>السعر:</strong> ${data[index].price} $</p>
      <p><strong>الخصم:</strong> ${data[index].discountPercentage}%</p>
      <p><strong>التقييم:</strong> ⭐ ${data[index].rating}</p>
      <p><strong>الحالة:</strong> ${data[index].availabilityStatus}</p>
      <p><strong>الشحن:</strong> ${data[index].shippingInformation}</p>
      <p><strong>المخزون:</strong> ${data[index].stock} قطعة</p>
      <p><strong>الحد الأدنى للطلب:</strong> ${data[index].minimumOrderQuantity}</p>
      <p><strong>الضمان:</strong> ${data[index].warrantyInformation}</p>
    </div>
  `,
  imageUrl: data[index].thumbnail,
  imageWidth: 200,
  confirmButtonText: "إضافة للعربة 🛒",
  showCloseButton: true
});
}

function inputs() {
  let input_count = document.querySelectorAll(".input_count");
  input_count.forEach((input, index) => {
    input.addEventListener("input", () => {
      let value = Number(input.value);

      if (value <= data[index].minimumOrderQuantity && value > 1) {
        data[index].numberOfOrder = value;
        data[index].totalProducts = value * data[index].price;

        localStorage.setItem("favProducts", JSON.stringify(data));
        summraize();
      } else {
        input.value = 1;
      }
    });

    input.onblur = () => showItems();
  });
}
inputs();
function summraize() {
  let shipping = 75;
  let subtotal = 0;

  let subtotal_span = document.getElementById("subtotal");
  let totalAmount_span = document.getElementById("totalAmount");
  let typeOfShipping = document.getElementById("typeOfShipping");

  data.forEach((product) => {
    let price = Number(product.price) || 0;
    let quantity = Number(product.numberOfOrder) || 1;

    subtotal += price * quantity;
  });

  subtotal_span.textContent = Math.round(subtotal);
  totalAmount_span.textContent = Math.round(subtotal + shipping);
  typeOfShipping.textContent = shipping === 0 ? "مجاني" : shipping + "ج";
}
summraize();

// Header elements
const uiModeToggle = document.getElementById("ui-mode");

// Cash Register elements
const productNameSelector = document.getElementById("product-name-selector");
const qtySelector = document.getElementById("qty-selector");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const warningText1 = document.getElementById("warning-text1");
const csAvailableProductsTable = document.getElementById(
  "cs-available-products"
);
const cartDisplayTable = document.getElementById("cart-display");
const warningText2 = document.getElementById("warning-text2");
const cancelBtn = document.getElementById("cancel");
const proceedBtn = document.getElementById("proceed");
const totaBill = document.getElementById("total-bill");

// Stock Management elements
const itemNameInput = document.getElementById("item-name");
const itemQtyInput = document.getElementById("item-qty");
const sellingPriceInput = document.getElementById("selling-price");
const addToStockBtn = document.querySelector(".add-newproduct button");
const itemToEditSelector = document.getElementById("item-to-edit");
const newQuantityInput = document.getElementById("new-item-quantity");
const newSellingPriceInput = document.getElementById("new-selling-price");
const updateProductBtn = document.querySelector(".update-product button");
const deleteProductSelector = document.getElementById("delete-product-select");
const deleteProductBtn = document.querySelector(".delete-product button");
const sortTableSelector = document.getElementById("sort-table");
const resultText1 = document.getElementById("result-text1");
const stockProductsTable = document.getElementById("stock-table");
const resultText2 = document.getElementById("warning-text3");

let stock = [];
let cart = [];
let transactions = [];

makeUpdates();
function makeUpdates() {
  const productCheck = localStorage.getItem("stock");
  if (productCheck) {
    stock = JSON.parse(productCheck);
    displayCStableStock();
    displaySMtable();
    updateDeleteSelector();
    updateProductEditSelector();
    updateProductNameSelect();
    document.getElementById("qtyview").style.visibility = "hidden";
  }
}

//Cash register functions and event handlers

cancelBtn.addEventListener("click", () => {
  cart = [];
  total = 0;
  calculateBill();
  displayCart();
  makeUpdates();
  totaBill.style.visibility = "hidden";
});

addToCartBtn.addEventListener("click", () => {
  const productName = productNameSelector.value;
  const productQty = qtySelector.value;
  addToCart(productName, productQty);
});

updateProductNameSelect();
function updateProductNameSelect() {
  productNameSelector.innerHTML = `
  <option value="null" selected>--Select--</option>
  `;
  stock.forEach(({ product }) => {
    productNameSelector.innerHTML += `
    <option value="${product}">${product}</option>
    `;

    productNameSelector.addEventListener("change", () => {
      maxQty = stock.find((obj) => obj.product === productNameSelector.value);
      document.getElementById("qtyview").style.visibility = "visible";
      document.getElementById("qtyview").innerText = `Max: ` + maxQty.qty;
      qtySelector.max = maxQty.qty;
    });
  });
}

function addToCart(name, theQty) {
  const selectedQty = parseFloat(theQty);
  const selectedProduct = stock.find((obj) => obj.product === name);
  if (selectedProduct.qty >= selectedQty) {
    const cartProduct = {
      product: selectedProduct.product,
      quantity: selectedQty,
      unitPrice: parseFloat(selectedProduct.sellingPrice),
      amount: selectedQty * selectedProduct.sellingPrice,
    };
    cart.push(cartProduct);
    calculateBill();
    displayCart();
    clearInputs();
  } else if (selectedProduct.qty < selectedQty) {
    warningText1.style.visibility = "visible";
    warningText1.innerText = `Quantity too high, there is only ${selectedProduct.qty} left in stock`;
    setTimeout(() => {
      warningText1.style.visibility = "hidden";
    }, 5000);
  } else if (qtySelector.value == "") {
    warningText1.style.visibility = "visible";
    warningText1.innerText = `Fill in all fields beore pressing "Add to Cart"`;
    setTimeout(() => {
      warningText1.style.visibility = "hidden";
    }, 5000);
  }
}

let total = 0;
function calculateBill() {
  if (cart.length >= 1) {
    cart.forEach((item) => {
      total += item.amount;
    });
    let formatedTotal = Intl.NumberFormat("en-MW", {
      style: "currency",
      currency: "MWK",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(total);
    console.log(`the total is ` + formatedTotal);
    totaBill.innerText = `Total: ${formatedTotal}`;
    totaBill.style.visibility = "visible";
  } else {
    console.log("cart is empty!");
  }
}

proceedBtn.addEventListener("click", () => {
  makeTransaction();
});

function makeTransaction() {
  if (cart.length > 0) {
    const transaction = {
      date: new Date(),
      products: cart,
      total: total,
    };
    transactions.push(transaction);
    console.log(transactions);
    cart.forEach((item) => {
      const stockIndex = stock.findIndex((product) => {
        product.product === item.product;
      });
      stock[stockIndex].qty -= item.qty;
    });
    makeUpdates();
  }
}

function displayCart() {
  cartDisplayTable.innerHTML = `
  <tr>
              <th class="product-th">Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
  </tr>
  `;
  cart.forEach((obj) => {
    cartDisplayTable.innerHTML +=
      `
   <tr>
   <td>${obj.product}</td>
   <td>${obj.quantity}</td>
   <td>` +
      Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
      }).format(obj.unitPrice) +
      `</td><td>
   ` +
      Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
      }).format(obj.amount) +
      `</td></tr>`;
  });
}

//Stock functions and events handlers

addToStockBtn.onclick = () => {
  addToStock(itemNameInput.value, itemQtyInput.value, sellingPriceInput.value);
};

function addToStock(name, quantity, price) {
  if (
    itemNameInput.value !== "" &&
    itemQtyInput.value !== "" &&
    sellingPriceInput.value !== ""
  ) {
    const existingProduct = stock.find(
      (product) => product.product.toLowerCase() === name.toLowerCase()
    );
    if (existingProduct) {
      resultText1.innerText = "Product already exists in stock, update it";
      resultText1.style.visibility = "visible";
      resultText1.style.color = "red";
      setTimeout(() => {
        resultText1.style.visibility = "hidden";
      }, 5000);
    } else {
      const newProduct = {
        product: name.toUpperCase(),
        qty: parseFloat(quantity),
        sellingPrice: parseFloat(price),
      };
      stock.unshift(newProduct);
      resultText1.innerText = "Product added successfuly";
      resultText1.style.visibility = "visible";
      resultText1.style.color = "green";
      setTimeout(() => {
        resultText1.style.visibility = "hidden";
      }, 5000);
      localStorage.clear();
      localStorage.setItem("stock", JSON.stringify(stock));
      makeUpdates();
      clearInputs();
    }
  } else {
    resultText1.innerText =
      "Fill all fields before pressing 'Add to Stock' button";
    resultText1.style.visibility = "visible";
    resultText1.style.color = "red";
    setTimeout(() => {
      resultText1.style.visibility = "hidden";
    }, 5000);
  }
}

updateProductBtn.addEventListener("click", () => {
  if (
    itemToEditSelector.value === "null" ||
    newQuantityInput.value === "" ||
    newSellingPriceInput.value === ""
  ) {
    resultText2.innerText = "Select product to edit first";
    resultText2.style.visibility = "visible";
    resultText2.style.color = "red";
    setTimeout(() => {
      resultText2.style.visibility = "hidden";
    }, 5000);
  } else {
    const productName = itemToEditSelector.value;
    const quantityNew = newQuantityInput.value;
    const priceNew = newSellingPriceInput.value;
    updateStockProduct(productName, quantityNew, priceNew);
  }
});

function updateStockProduct(name, newQuantity, newSellingPrice) {
  let theProduct = stock.find((obj) => obj.product === name);
  stock = stock.filter((obj) => obj.product !== name);
  theProduct = {
    product: name,
    qty: parseFloat(newQuantity),
    sellingPrice: parseFloat(newSellingPrice),
  };
  stock.unshift(theProduct);
  localStorage.clear();
  localStorage.setItem("stock", JSON.stringify(stock));
  makeUpdates();
  clearInputs();
}

deleteProductBtn.addEventListener("click", () => {
  const selectedProduct = deleteProductSelector.value;
  if (deleteProductSelector.value !== "null") {
    deleteProduct(selectedProduct);
  }
});

function deleteProduct(name) {
  stock = stock.filter((obj) => obj.product !== name);
  localStorage.clear();
  localStorage.setItem("stock", JSON.stringify(stock));
  makeUpdates();
}

function displayCStableStock() {
  csAvailableProductsTable.innerHTML = `<tr>
              <th class="product-th">Product</th>
              <th class="qty-th">Qty</th>
              <th class="price-th">Price</th>
            </tr>`;
  stock.forEach(({ product, qty, sellingPrice }) => {
    csAvailableProductsTable.innerHTML +=
      `
                <tr>
              <td>${product}</td>
              <td>${qty}</td>
              <td>` +
      Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
      }).format(sellingPrice) +
      `</td> 
            </tr>
`;
  });
}

sortTableSelector.addEventListener("change", displaySMtable);

function displaySMtable() {
  let copiedStock = [...stock];
  let sortedArray;
  switch (sortTableSelector.value) {
    case "Name":
      sortedArray = copiedStock.sort((a, b) => {
        if (a.product === b.product) return 0;
        if (a.product > b.product) return 1;
        return -1;
      });
      break;
    case "last added":
      sortedArray = copiedStock;
      break;
    case "quantity hf":
      sortedArray = copiedStock.sort((a, b) => {
        if (a.qty === b.qty) return 0;
        if (a.qty > b.qty) return -1;
        return 1;
      });
      break;
    case "quantity lf":
      sortedArray = copiedStock.sort((a, b) => {
        if (a.qty === b.qty) return 0;
        if (a.qty > b.qty) return 1;
        return -1;
      });
      break;
    default:
      sortedArray = stock;
  }
  stockProductsTable.innerHTML = `
  <tr>
            <th class="product-th">Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
  `;
  sortedArray.forEach(({ product, qty, sellingPrice }) => {
    stockProductsTable.innerHTML +=
      `
       <tr>
              <td>${product}</td>
              <td>${qty}</td>
              <td>` +
      Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
      }).format(sellingPrice) +
      `</td> 
      <td>` +
      Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
      }).format(sellingPrice * qty) +
      `</td>
            </tr>
    `;
  });
}

function updateDeleteSelector() {
  deleteProductSelector.innerHTML = ` <option disabled selected value="null">--Select--</option>`;
  stock.forEach(({ product }) => {
    const option = document.createElement("option");
    option.innerText = product;
    option.value = product;
    deleteProductSelector.append(option);
  });
}

function updateProductEditSelector() {
  itemToEditSelector.innerHTML = `<option disabled selected value="null">--Select--</option>`;
  stock.forEach((obj) => {
    const option = document.createElement("option");
    option.innerText = obj.product;
    option.value = obj.product;
    itemToEditSelector.append(option);
  });

  itemToEditSelector.addEventListener("change", () => {
    const selectedProduct = stock.find(
      (obj) => obj.product === itemToEditSelector.value
    );
    if (selectedProduct) {
      newQuantityInput.value = selectedProduct.qty;
      newSellingPriceInput.value = selectedProduct.sellingPrice;
    }
  });
}

function clearInputs() {
  itemNameInput.value = "";
  itemQtyInput.value = "";
  sellingPriceInput.value = "";
  newSellingPriceInput.value = "";
  newQuantityInput.value = "";
  qtySelector.value = "";
  makeUpdates();
}

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
const totalBill = document.getElementById("total-bill");

//Transactions and receipts elements
const expenseNameInput = document.getElementById("expense-name");
const expenseCostInput = document.getElementById("expense-cost");
const expenseDescriptionTextarea = document.getElementById(
  "expense-description"
);
const enterExpenseButton = document.getElementById("enter-expense");
const receiptsDisplay = document.getElementById("receipts-display");

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
let expenses = [];

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

  const transCheck = localStorage.getItem("transactions");
  if (transCheck) {
    transactions = JSON.parse(transCheck);
    displayReceipts();
  }

  const expenseCheck = localStorage.getItem("expenses");
  if (expenseCheck) {
    expenses = JSON.parse(expenseCheck);
    displayExpenses();
  }
}

//Cash register functions and event handlers

cancelBtn.addEventListener("click", () => {
  clearCart();
});

function clearCart() {
  cart = [];
  total = 0;
  calculateBill();
  displayCart();
  makeUpdates();
  totalBill.style.visibility = "hidden";
}

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
  stock.forEach(({ product, qty }) => {
    if (qty > 0) {
      productNameSelector.innerHTML += `
      <option value="${product}">${product}</option>
      `;

      productNameSelector.addEventListener("change", () => {
        maxQty = stock.find((obj) => obj.product === productNameSelector.value);
        document.getElementById("qtyview").style.visibility = "visible";
        document.getElementById("qtyview").innerText = `Max: ` + maxQty.qty;
        qtySelector.max = maxQty.qty;
      });
    }
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
    }).format(total);
    totalBill.innerText = `Total: ${formatedTotal}`;
    totalBill.style.visibility = "visible";
  } else {
    console.log("cart is empty!");
  }
}

proceedBtn.addEventListener("click", () => {
  makeTransaction();
});

function makeTransaction() {
  const dateForTrans = new Date();
  const transDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateForTrans);

  const timeOfTrans = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(dateForTrans);

  const transId =
    new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(dateForTrans)
      .replace(/[/:-\s,]/g, "") +
    String(transactions.length + 1).padStart(4, "0");

  if (cart.length > 0) {
    const trans = {
      date: transDate,
      time: timeOfTrans,
      id: transId,
      products: cart,
      cartValue: total,
    };

    cart.forEach((item) => {
      const stockIndex = stock.findIndex(
        (product) => product.product === item.product
      );
      stock[stockIndex].qty -= item.quantity;
    });
    transactions.unshift(trans);
    console.log(transactions);

    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("stock", JSON.stringify(stock));
    cart = [];
    total = 0;
    clearCart();
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

//trans and receipts functions

function deleteReceipt(idNumber) {
  const transIndex = transactions.findIndex((trans) => trans.id == idNumber);
  if (transIndex !== -1) {
    const transProducts = transactions[transIndex].products;
    transProducts.forEach((product) => {
      const stockIndex = stock.findIndex(
        (item) => item.product === product.product
      );
      if (stockIndex !== -1) {
        stock[stockIndex].qty += product.quantity;
      } else {
        console.error(`Product '${product.product}' not found in stock`);
      }
    });

    transactions.splice(transIndex, 1);

    localStorage.setItem("stock", JSON.stringify(stock));
    localStorage.setItem("transactions", JSON.stringify(transactions));

    makeUpdates();
    clearInputs();
  } else {
    console.error(`Transaction with ID '${idNumber}' not found`);
  }
}
enterExpenseButton.addEventListener("click", () => {
  addExpense();
});
function addExpense() {
  const d = new Date();
  const dateCreated = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const timeCreated = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
  const expenseName = expenseNameInput.value;
  const expenseValue = parseFloat(expenseCostInput.value);
  const expenseNote = expenseDescriptionTextarea.value;

  if (expenseCostInput && expenseCostInput) {
    const expensedata = {
      time: timeCreated,
      date: dateCreated,
      title: expenseName,
      cost: expenseValue,
      note: expenseNote,
    };

    expenses.unshift(expensedata);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    makeUpdates();
  }
}

function displayReceipts() {
  receiptsDisplay.innerHTML = "";
  transactions.forEach((receipt) => {
    const receiptDiv = document.createElement("div");
    receiptDiv.setAttribute("class", "receipt");

    const headerDiv = document.createElement("div");
    headerDiv.setAttribute("class", "header");

    const dateTimeP = document.createElement("p");
    const dateSpan = document.createElement("span");
    dateSpan.innerText = `Date: ${receipt.date}`;
    const timeSpan = document.createElement("span");
    timeSpan.innerText = `Time: ${receipt.time}`;
    dateTimeP.appendChild(dateSpan);
    dateTimeP.appendChild(timeSpan);

    const transIdTotalP = document.createElement("p");
    const transIdSpan = document.createElement("span");
    transIdSpan.innerText = `Trans ID: ${receipt.id}`;
    const totalSpan = document.createElement("span");
    totalSpan.innerText = `Total: ${Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MWK",
    }).format(receipt.cartValue)}`;

    transIdTotalP.appendChild(totalSpan);
    transIdTotalP.appendChild(transIdSpan);

    const deleteIcon = document.createElement("p");
    deleteIcon.innerHTML = `<img src="images/delete_black.svg" title="Delete Receipt (NB: This cannot be undone)" style="cursor: pointer;" onclick="deleteReceipt(${receipt.id})"> `;
    deleteIcon.setAttribute("class", "delete-icon");

    headerDiv.appendChild(dateTimeP);
    headerDiv.appendChild(transIdTotalP);
    headerDiv.appendChild(deleteIcon);

    const productsDiv = document.createElement("div");
    productsDiv.setAttribute("class", "products");

    const tabeleForProducts = document.createElement("table");
    const tableHeader = document.createElement("tr");

    tableHeader.innerHTML = `
    <th>Product</th>
    <th>Price</th>
    <th>Amount</th>
    `;
    tabeleForProducts.appendChild(tableHeader);
    receipt.products.forEach((cartItem) => {
      tabeleForProducts.innerHTML += `
                    <tr>
                    <td>${cartItem.product} (${cartItem.quantity})</td>
                    <td>${Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "MWK",
                    }).format(cartItem.unitPrice)}</td>
                    <td>${Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "MWK",
                    }).format(cartItem.amount)}</td>
                    </tr>
    `;
    });
    productsDiv.appendChild(tabeleForProducts);

    receiptDiv.appendChild(headerDiv);
    receiptDiv.appendChild(productsDiv);

    receiptsDisplay.appendChild(receiptDiv);
  });
}

function displayExpenses() {
  expensesDisplay.innerHTML = "";
  expenses.forEach((expense) => {
    expensesDisplay.innerHTML += `
    <div class="expense">
              <div class="header">
                <p>
                  <span>Title: ${expense.title}</span>
                  <span>Date: ${expense.date}</span>
                </p>
                <p>
                  <span>Cost: ${Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "MWK",
                  }).format(expense.cost)}</span>
                  <span>Time: ${expense.time}</span>
                </p>
              </div>
              <hr />
              <div class="note">${expense.note}</div>
            </div>
    `;
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

  localStorage.setItem("stock", JSON.stringify(stock));
  clearInputs();
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
  const allInputs = document.querySelectorAll("input");
  allInputs.forEach((inp) => {
    inp.value = "";
  });
  expenseDescriptionTextarea.value = "";

  makeUpdates();
}

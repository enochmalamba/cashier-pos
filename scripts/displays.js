const timeDisplay = document.getElementById("time-display");
const cashRegisterBtn = document.getElementById("cash-register-btn");
const transactionsBtn = document.getElementById("transactions-btn");
const stockManagementBtn = document.getElementById("stock-management-btn");
const administrationBtn = document.getElementById("adminstration-btn");
const adminSection = document.getElementById("adminstration");
const cashRegisterSection = document.getElementById("cash-register");
const transSection = document.getElementById("transactions");
const stocksSection = document.getElementById("stock-management");
const receiptDivBtn = document.getElementById("receipts-display-btn");
const expensesDivBtn = document.getElementById("expenses-display-btn");
const expensesDisplay = document.getElementById("expenses-display");

function displayTime() {
  const now = new Date();

  const options = { hour: "numeric", minute: "numeric", hour12: false };
  const timeString = now.toLocaleTimeString("en-US", options);

  const dateOptions = { weekday: "short", day: "numeric", month: "short" };
  const dateString = now.toLocaleDateString("en-US", dateOptions);

  const formattedString = `${timeString}, ${dateString}`;

  timeDisplay.innerText = formattedString;
}

setInterval(displayTime, 1000);

displayTime();

function hideSections() {
  adminSection.style.display = "none";
  transSection.style.display = "none";
  cashRegisterSection.style.display = "none";
  stocksSection.style.display = "none";
}

function removeActiveClass() {
  administrationBtn.className = "";
  transactionsBtn.className = "";
  cashRegisterBtn.className = "";
  stockManagementBtn.className = "";
}

administrationBtn.onclick = () => {
  removeActiveClass();
  hideSections();
  administrationBtn.className = "active";
  adminSection.style.display = "block";
};
stockManagementBtn.onclick = () => {
  removeActiveClass();
  hideSections();
  stockManagementBtn.className = "active";
  stocksSection.style.display = "flex";
};
transactionsBtn.onclick = () => {
  removeActiveClass();
  hideSections();
  transactionsBtn.className = "active";
  transSection.style.display = "flex";
};
cashRegisterBtn.onclick = () => {
  removeActiveClass();
  hideSections();
  cashRegisterBtn.className = "active";
  cashRegisterSection.style.display = "flex";
};

function hideDivs() {
  expensesDisplay.style.display = "none";
  receiptsDisplay.style.display = "none";
}

function removeClass() {
  receiptDivBtn.classList = "";
  expensesDivBtn.classList = "";
}

receiptDivBtn.onclick = () => {
  removeClass();
  hideDivs();
  receiptDivBtn.classList = "active";
  receiptsDisplay.style.display = "flex";
};

expensesDivBtn.onclick = () => {
  removeClass();
  hideDivs();
  expensesDivBtn.classList = "active";
  expensesDisplay.style.display = "block";
};

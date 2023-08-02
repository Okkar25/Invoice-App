// selectors
const products = [
  {
    id: 1,
    name: "AirPods Max",
    price: 550,
  },
  {
    id: 2,
    name: "MacBook Pro 14-inch",
    price: 2000,
  },
  {
    id: 3,
    name: "iPad Air 5",
    price: 600,
  },
  {
    id: 4,
    name: "Apple Watch Series 8",
    price: 400,
  },
  {
    id: 5,
    name: "Apple Vision Pro",
    price: 3500,
  },
];

const app = document.querySelector("#app");
const formRecord = document.querySelector("#formRecord");
const product = document.querySelector("#product");
const quantity = document.querySelector("#quantity");
const recordTable = document.querySelector("#recordTable");
const recordRows = document.querySelector("#record-rows");
const recordTotal = document.querySelector(".record-total");
const recordTax = document.querySelector(".record-tax");
const recordSubtotal = document.querySelector(".record-subtotal");
// offcanvas
const inventory = document.querySelector("#inventory");
const newItem = document.querySelector("#newItem");
const newItemName = document.querySelector("#newItemName");
const newItemPrice = document.querySelector("#newItemPrice");

// ============================== function ===================================

// ------------------- Displaying item blocks in offcanvas -------------------

const createItem = (name, price) => {
  const div = document.createElement("div");
  div.className =
    "border border-2 border-info p-2 mb-3 d-flex justify-content-between item-list";
  div.innerHTML += `
  <p class="mb-0 item-name">${name}</p>
  <p class="text-black mb-0 item-price">$ ${price}</p>
  `;

  inventory.append(div);
};

// ------------ Creating new Record rows with products from select box --------------

const createRow = (productId, quantity) => {
  // Collecting information
  // finding product's id-name-price from product.value (select-option-value)
  const currentProduct = products.find((el) => el.id == productId);
  let cost = quantity.valueAsNumber * currentProduct.price;
  const tableRow = document.createElement("tr");
  tableRow.classList.add("record-row", "animate__animated", "animate__fadeIn");

  // custom attribute inserted to identify same product category
  tableRow.setAttribute("product-id", productId);

  tableRow.innerHTML = `
      <td class="record-number"></td>
      <td class="record-product">${currentProduct.name}</td>
      <td class="record-price dollar">${currentProduct.price}</td>

      <td>
      <span><i class="record-quantity-control record-quantity-minus bi bi-dash"></i></span>
      <span class="record-quantity">${quantity.valueAsNumber}</span>
      <span><i class="record-quantity-control record-quantity-plus bi bi-plus"></i></span>
      </td>

      <td class="position-relative w-25">
      <span class="record-cost dollar">${cost}</span>
      <button class="record-row-delete btn btn-sm btn-primary position-absolute bg-danger border-0 rounded-3">
      <i class="bi bi-trash3-fill"></i>
      </button>
      </td>
      `;

  // quantity control increment / decrement

  const recordQtyPlus = tableRow.querySelector(".record-quantity-plus");
  const recordQtyMinus = tableRow.querySelector(".record-quantity-minus");
  const renewQuantity = tableRow.querySelector(".record-quantity");
  const renewPrice = tableRow.querySelector(".record-price");
  const renewCost = tableRow.querySelector(".record-cost");

  recordQtyPlus.addEventListener("click", () => {
    renewQuantity.innerText = parseFloat(renewQuantity.innerText) + 1;
    let incrementCost = renewQuantity.innerText * renewPrice.innerText;
    renewCost.innerText = incrementCost;
    calculateTotal();
    calculateTax();
    calculateSubtotal();
  });

  recordQtyMinus.addEventListener("click", () => {
    if (renewQuantity.innerText > 1) {
      renewQuantity.innerText = renewQuantity.innerText - 1;
      let decrementCost = renewQuantity.innerText * renewPrice.innerText;
      renewCost.innerText = decrementCost;
      calculateTotal();
      calculateTax();
      calculateSubtotal();
    } else {
      tableRow.remove();
      calculateTotal();
      calculateTax();
      calculateSubtotal();
    }
  });

  // Deleting unwanted product row
  const rowDelete = tableRow.querySelector(".record-row-delete");

  rowDelete.addEventListener("click", () => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      tableRow.classList.replace("animate__fadeIn", "animate__zoomOut");

      tableRow.addEventListener("animationend", () => {
        tableRow.remove();
        calculateTotal();
        calculateTax();
        calculateSubtotal();
      });
    }
  });

  return tableRow;
};

// ------------------------ Calculating total cost ---------------------------

// allRecords is iterable => NodeList - array-like object
// spread operator can be used => [...allRecords]
// Spread operator is used to transform iterable such as 'NodeList' (array-like object) into "Array"

const calculateTotal = () => {
  const allRecords = document.querySelectorAll(".record-cost");

  recordTotal.innerText = [...allRecords].reduce(
    (pv, cv) => pv + parseFloat(cv.innerText),
    0
  );
};

// Calculating Tax

const calculateTax = () => {
  let tax = recordTotal.innerText * 0.05;
  recordTax.innerText = tax;
};

// Calculating Subtotal

const calculateSubtotal = () => {
  let subtotal =
    parseFloat(recordTotal.innerText) + parseFloat(recordTax.innerText);
  recordSubtotal.innerText = subtotal;
};

// ================================= Process =================================

// ----------- Adding new items into products, select, offcanvas -------------

newItem.addEventListener("submit", () => {
  let newItemId = products[products.length - 1].id + 1;
  let newItemObj = {
    id: newItemId,
    name: newItemName.value,
    price: newItemPrice.valueAsNumber,
  };
  // product array update
  products.push(newItemObj); // adding new item into products array
  // console.log(products);

  // adding new item into offcanvas (blocks)
  // createItem(newItemName.value, newItemPrice.valueAsNumber);
  createItem(newItemObj.name, newItemObj.price);

  // adding items into select
  // Option (innerText, value) => Option (new product name , new product value)
  product.append(new Option(newItemObj.name, newItemId));
  // product.append(new Option(newItemName.value, newItemObj.id));
  newItem.reset();
});

// ---------- Inserting products (array items) into select - option -----------

products.forEach((el) => {
  // adding items into select
  product.append(new Option(el.name, el.id)); // new Option (innerText, value)

  // Adding items from select into offcanvas
  createItem(el.name, el.price);
});

// -------------- Adding products into record / show total cost ----------------

formRecord.addEventListener("submit", (event) => {
  event.preventDefault();

  // Updating quantity and cost if product added is identical
  const isExistRow = document.querySelector(`[product-id='${product.value}']`);

  if (isExistRow) {
    let currentQuantity = isExistRow.querySelector(".record-quantity");
    let currentPrice = isExistRow.querySelector(".record-price");
    let currentCost = isExistRow.querySelector(".record-cost");

    let updatedQuantity =
      parseFloat(currentQuantity.innerText) + quantity.valueAsNumber;

    let updatedCost = updatedQuantity * currentPrice.innerText;

    currentQuantity.innerText = updatedQuantity;
    currentCost.innerText = updatedCost;
  } else {
    // create new row
    recordRows.append(createRow(product.value, quantity));
  }

  // clearing value in product and quantity spaces with FormData
  formRecord.reset();

  calculateTotal();
  calculateTax();
  calculateSubtotal();
});

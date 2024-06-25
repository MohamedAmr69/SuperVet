const qty = document.getElementById("qty");

const plus = document.getElementById("plus");
const minus = document.getElementById("minus");
const item_qty = +document.getElementById("stock").value;

plus.addEventListener("click", () => {
  qty.value = +qty.value + 1;
  const qty_diff = item_qty - qty.value;
  if (qty_diff < 0) {
    document.getElementById("availability").innerHTML = "Out of stock";
    document.getElementById("availability").style.color = "red";
  } else {
    document.getElementById("availability").innerHTML = "Available";
    document.getElementById("availability").style.color = "green";
  }
});
minus.addEventListener("click", () => {
  qty.value -= 1;
  const qty_diff = item_qty - qty.value;

  if (qty_diff < 0) {
    document.getElementById("availability").innerHTML = "Out of stock";
    document.getElementById("availability").style.color = "red";
  } else {
    document.getElementById("availability").innerHTML = "Available";
    document.getElementById("availability").style.color = "green";
  }
});

qty.addEventListener("change", () => {
  const qty_diff = item_qty - qty.value;
  if (qty_diff < 0) {
    document.getElementById("availability").innerHTML = "Out of stock";
    document.getElementById("availability").style.color = "red";
  } else {
    document.getElementById("availability").innerHTML = "Available";
    document.getElementById("availability").style.color = "green";
  }
});

document
  .getElementById("addToCartForm")
  .addEventListener("submit", function (event) {
    const qty = document.getElementById("qty").value;
    document.getElementById("cartQty").value = qty;
  });

const buyFromCart = document.getElementById("buyFromCart");
const totalPrice = document.getElementById("totalPrice");

if (totalPrice === 0) {
  buyFromCart.disabled = true;
}

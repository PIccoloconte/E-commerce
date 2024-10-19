import { ReduceArrayFromLocalStorage,UpdateSubtotalPrice,UpdateShippingPrice,GetDiscountPrice } from "./utils_script/utils.js";

let cart = JSON.parse(localStorage.getItem('cart')) || [];

//DOM to display products
const orderummary = document.querySelector(".order__summary__products");

//check-out price
const checkoutSub = document.querySelector(".checkout__sub");
const checkoutShipping = document.querySelector(".checkout__shipping");
const checkoutTotal = document.querySelector(".checkout__total");

//credits card element
const cardNumberValue = document.getElementById("card__number");
const expirationValue = document.getElementById("expiration");
const cvvValue = document.getElementById("cvv");

//delete the same product inside local storage, but count the product as deleted
ReduceArrayFromLocalStorage(cart).forEach(product =>{
    const checkOutProd = document.createElement("div");
    checkOutProd.classList.add("checkOut__product");
    
    const {
        product: {
            images,
            title
        }
        } = product;

    checkOutProd.innerHTML =  
    `   
        <div>
            <img src="${images[0]}" alt="Product 1">
        </div>
        <p>${title}</p>
        <p>${product.eliminated + 1 || 1}</p>
        <p>$${isOnSale(product.product)}</p>
        
    `
    orderummary.appendChild(checkOutProd);

    CalcFinalPrice();
})

//check if product is onsale;
function isOnSale(product) {
    if (product.onSaleProp) 
    {
        return GetDiscountPrice(product);
    } 
    else 
    {
        return product.price;
    }
}

//calculation of the final price 
function CalcFinalPrice(){
    const subtotal =  UpdateSubtotalPrice(cart);
    const shipping = UpdateShippingPrice(subtotal);
    checkoutSub.textContent = `$${subtotal.toFixed(2)}`;
    checkoutShipping.textContent = shipping === 0 ? "Free" : "$" + shipping;
    checkoutTotal.textContent = `$${(subtotal + shipping).toFixed(2)}`
}

//formatting credit card input to have only numbers and space every 4 characters
cardNumberValue.addEventListener('input', function() {
    formatCreditCard(this);//equilave a passare formatCreditCard
});
//formatting expiration to have "MM/YYYY"
expirationValue.addEventListener('input', function() {
    formatExpirationDate(this);
});
//formatting expiration to have max 3 numbers
cvvValue.addEventListener("input",function(){
    formatCVV(this);
})

// formatting credit card
function formatCreditCard(input) {
    // delete non-numeric characters
    var unformatted = input.value.replace(/\D/g, '');

    // max 16 characters
    if (unformatted.length > 16) {
        unformatted = unformatted.slice(0, 16);
    }
    
    // spacing after 4 characters
    var formatted = unformatted.replace(/(\d{4})/g, '$1 ').trim();

    input.value = formatted;
}

// formatting expiring
function formatExpirationDate(input) {
    // delete non-numeric characters
    var unformatted = input.value.replace(/\D/g, '');

    // max 6 characters
    if (unformatted.length > 6) {
        unformatted = unformatted.slice(0, 6);
    }
    
    // add / after 2 characters
    var formatted = unformatted.replace(/^(\d{2})/, '$1/').trim();

    input.value = formatted;
}

// Formatting CVV
function formatCVV(input) {
    // delete non-numeric characters
    var unformatted = input.value.replace(/\D/g, '');

    // max 3 characters
    if (unformatted.length > 3) {
        unformatted = unformatted.slice(0, 3);
    }
    input.value = unformatted;
}






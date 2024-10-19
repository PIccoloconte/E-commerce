import { ReduceArrayFromLocalStorage,UpdateShippingPrice,UpdateSubtotalPrice,GetDiscountPrice } from "./utils_script/utils.js";
import { getElement } from "./utils_script/getElement.js";
import { UpdateCartIcon } from "./main.js";

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsContainer = getElement("#products__container");

const priceSubTotal = document.querySelector(".subtotal");
const priceTotal = document.querySelector(".total");
const shippingPrice = document.querySelector(".shipping");
const checkOutBtn = document.querySelector(".checkoutBtn");

ReduceArrayFromLocalStorage(cart).forEach(product => {
    
    const productRow = document.createElement("div");
    productRow.classList.add("product__row");
    const {
        product: {
            id,
            images,
            price,
            title
        }
        } = product;
    
    productRow.dataset.productId = id;
    
    productRow.innerHTML =
    `
        <a href="product.html" class="product__item">
            <img src="${images[0]}" alt="Product Image" class="product-image">
            <span class="product__name">${title}</span>
        </a>
        ${product.product.onSaleProp ?
            ` <div class="product__item">$${GetDiscountPrice(product.product)}</div> `
            :

            ` <div class="product__item">$${price}</div> `
        }
        
        <div class="product__item">
            <button class= "qtyBnt deleteElement">${ChangeBtnSymbol(product.eliminated + 1)}</i></button>
            <input class = "quantityInput" disabled type="text" value="${product.eliminated + 1 || 0}">
            <button class= "qtyBnt plusQty"><i class="ri-add-line"></i></button>
        </div>
        
        ${product.product.onSaleProp ?
            ` <div class="product__item product__subtotal">$${(GetDiscountPrice(product.product) * (product.eliminated + 1)).toFixed(2)}</div> `
            :

            ` <div class="product__item product__subtotal">$${((price)*(product.eliminated + 1)).toFixed(2)}</div> `
        }
        
    `    
    productsContainer.appendChild(productRow);

    //get btn to increase or decrease amount of product
    const qtyBnt = productRow.querySelectorAll(".qtyBnt");

    qtyBnt.forEach( btn  =>{
        btn.addEventListener("click",(e) =>{
            ControlQtyCart(e,productRow,product.product);
        })
    })

    //get the final price
    CalcFinalPrice();

    ////Set product value to localStorage when click it
    productRow.addEventListener("click",function(){
        localStorage.setItem('product', JSON.stringify(product.product));
    })
});

//checkout button event
checkOutBtn.addEventListener("click", function() {
    window.location.href = "checkOut.html";
});

//change minus icon 
function ChangeBtnSymbol(number){
    if(number > 1){
       return ` <i class="ri-subtract-line"></i>`
    }
    else{
       return `<i class="ri-delete-bin-line"></i>`
    }
}

//check if i pressed plus or minus
function ControlQtyCart(e,productRow,product){
    
    const quantityInput = productRow.querySelector(".quantityInput");
    const deleteQtyBtn = productRow.querySelector(".deleteElement");
    const productPriceSubtotal = productRow.querySelector(".product__subtotal");

    //delete $ before numbers
    let numbers = productPriceSubtotal.textContent.match(/\d+(\.\d+)?/g);
    
    let curretPriceTotal = parseFloat(numbers[0]);

    //plus btn
    if(e.currentTarget.classList.contains("plusQty")){
        quantityInput.value = parseInt(quantityInput.value) + 1;

        //update subtotal price of current product
        productPriceSubtotal.innerHTML  = ` $${(curretPriceTotal + parseFloat(isOnSalePrice(product))).toFixed(2)}`

        cart.push({product});
        localStorage.setItem('cart', JSON.stringify(cart));

        //update cart number icon
        UpdateCartIcon(cart.length);

        CalcFinalPrice();
          
    }
        
    if(quantityInput.value > 1){
            deleteQtyBtn.innerHTML = ` <i class="ri-subtract-line"></i> `  
    }

    //minus btn
    if(e.currentTarget.classList.contains("deleteElement")){
        quantityInput.value = parseInt(quantityInput.value) - 1;

        //update subtotal price of current product
        productPriceSubtotal.innerHTML  = ` $${(curretPriceTotal - isOnSalePrice(product)).toFixed(2)}`

        if (quantityInput.value < 1)
        {
            productRow.remove();
        }

        if( quantityInput.value < 2){
            deleteQtyBtn.innerHTML = ` <i class="fa fa-trash"></i> `
        }
        
        // get product id DOM
        const productId = parseInt(productRow.dataset.productId);
            
        //find id DOM = id API
        const indexToRemove = cart.findIndex(item => item.product.id === productId);
        
        if (indexToRemove !== -1) {
            cart.splice(indexToRemove, 1);
            
            localStorage.setItem('cart', JSON.stringify(cart));
            CalcFinalPrice();
        }

        //update cart number icon
        UpdateCartIcon(cart.length);
    }
}

//get final price   
function CalcFinalPrice(){
    const subtotal =  UpdateSubtotalPrice(cart);
    const shipping = UpdateShippingPrice(subtotal);
    priceSubTotal.textContent = `$${subtotal.toFixed(2)}`;
    shippingPrice.textContent = shipping === 0 ? "Free" : "$" + shipping;
    priceTotal.textContent = `$${(subtotal + shipping).toFixed(2)}`
}

//look if product have onSaleProd attributes
function isOnSalePrice(product){
    if(product.onSaleProp){
         return GetDiscountPrice(product);
     }
    else{
        return product.price;
    }
}









import { getElement,getElements} from "./utils_script/getElement.js";
import { GetDiscountPrice,AddToCart } from "./utils_script/utils.js";
import { UpdateWhishlistIcon } from "./main.js";

const whishlistContainer = getElement("#whishlist__container");

let whishlist = JSON.parse(localStorage.getItem('whishlist')) || [];

function DisplayWishlist(){

    whishlistContainer.innerHTML = ``;

    whishlist.forEach(item => {
        const {product} = item
        //console.log(product);
        
        const productDOM = document.createElement("div");
        productDOM.classList.add("product");

        productDOM.dataset.productId = product.id;

        productDOM.innerHTML = 
        `
            <div class="product__container">
                <a href="product.html">
                    <img class="product__container__image" src="${product.images[0]}" loading="lazy" alt="">
                </a>
                <button id="product__container__wishlistBtn"><i class="ri-delete-bin-line"></i></button>
            </div>
            <div>
                <div class="product__name">${product.title}</div>
                <div class="product__price">
                ${
                    product.onSaleProp ?
                    `
                        <span class="product__price__onsale">$${GetDiscountPrice(product)}</span> 
                        <span class="product__price__normal">$${product.price}</span>
                    `
                    :
                    `
                        <span class="product__price__onsale">$${product.price}</span> 
                    `
                }
                    
                </div>
                <button class="addToCartBtn">Add to Cart</button>
            </div>
        `
        whishlistContainer.appendChild(productDOM);

        //add to cart button
        productDOM.lastElementChild.lastElementChild.addEventListener("click", () => AddToCart(product))
        
        //Set product value to localStorage when click it
        productDOM.addEventListener("click", function(){
                    
            localStorage.setItem('product', JSON.stringify(product));
        })

        const removeBtns = productDOM.querySelectorAll("#product__container__wishlistBtn");
        
        removeBtns.forEach(btn => {
            btn.addEventListener("click" ,(e) =>{
                RemoveProductToWhihlist(e,productDOM);
            })
        })
    });
}

function RemoveProductToWhihlist(e,productDOM){
    productDOM.remove();

    const productId = parseInt(productDOM.dataset.productId);

    //find id DOM = id API
    const indexToRemove = whishlist.findIndex(item => item.product.id === productId);
    
    //remove item to API
    whishlist.splice(indexToRemove, 1);
            
    localStorage.setItem('whishlist', JSON.stringify(whishlist));

    //Update whishlist number icon
    UpdateWhishlistIcon(whishlist.length);

}

window.addEventListener("DOMContentLoaded",DisplayWishlist);



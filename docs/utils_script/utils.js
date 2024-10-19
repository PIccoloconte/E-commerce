import { UpdateCartIcon,UpdateWhishlistIcon } from "../main.js";

//get reviews stars
const GetRatingInStars = (prod) =>{
    let starsHTML = "";
    
    for(let i = 1; i <= prod.rating ; i++){
       starsHTML += "&#9733;"
    }
    for (let i = prod.rating  ; i < 5; i++) {
        starsHTML += "&#9734"; 
    }

   return starsHTML;
}

//get discount price
function GetDiscountPrice(prod){
    return (prod.price - ((prod.price * prod.discountPercentage) / 100)).toFixed(2) 
}

//add to cart funciont
function AddToCart(product) {
    // check if "cart" exist inside local storage, if false , create an array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // add product to local storage
    cart.push({ product });
    
    // save local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    console.log(`${product.title} aggiunto al carrello!`);

    //Update cart number icon
    UpdateCartIcon(cart.length);
}

//add to whishlist
function AddToWhishlist(product) {
    let whishlist = JSON.parse(localStorage.getItem('whishlist')) || [];
    
    //check if product.id is already into the array
    let isProductInWhishlist = whishlist.some(item => item.product.id === product.id);
    
    if (isProductInWhishlist) {
        return;
    } 
    else {
        whishlist.push({ product });

        localStorage.setItem('whishlist', JSON.stringify(whishlist));
    }

    //Update whishlist number icon
    UpdateWhishlistIcon(whishlist.length);
}

//delete the same product inside local storage, but count the product as deleted
function ReduceArrayFromLocalStorage(cart){
    const cartWithoutDupli = cart.reduce((total, obj) => {
        // check if product already exists inside local storage
        const foundIndex = total.findIndex(item => item.product.id === obj.product.id);
      
        if (foundIndex !== -1) {
          // if product already exists, increase eliminated count by 1
          total[foundIndex].eliminated++;
        } else {
          // if not exists yet , create an eliminated attribute and set the value to 0 
          total.push({ ...obj, eliminated: 0 });
        }
        return total;
    }, []);
    return cartWithoutDupli;
}

//subtotal price
function UpdateSubtotalPrice(cart) {
    let subtotal = 0;
    cart.forEach(product => {
        let { price } = product.product;

        if(product.product.hasOwnProperty('onSaleProp'))
        {
            price = GetDiscountPrice(product.product);
        }
        else
        {
            price = price;
        }
        subtotal += parseFloat(price);
    });
    
    return subtotal;
}

//shipping price
function UpdateShippingPrice(totalPrice) {
    let shippingCost = calculateShippingCost(totalPrice);
    return shippingCost;
}

//shipping cost
function calculateShippingCost(totalPrice) {
    if(totalPrice === 0 ){
        return 0;
    }
    if (totalPrice <= 30) {
        return 10;
    } else if (totalPrice < 100) {
        return 5;
    } else {
        return 0;
    }
}

export {
    GetRatingInStars,
    GetDiscountPrice,
    AddToCart,
    AddToWhishlist,
    ReduceArrayFromLocalStorage,
    UpdateSubtotalPrice,
    UpdateShippingPrice
}

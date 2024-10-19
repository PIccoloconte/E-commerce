import { getElement,getElements} from "./utils_script/getElement.js";
import { GetRatingInStars ,GetDiscountPrice,AddToCart,AddToWhishlist } from "./utils_script/utils.js";
import { UpdateWhishlistIcon } from "./main.js";

const animated_bgs = document.querySelectorAll('.animated-bg');
const animated_bg_texts = document.querySelectorAll('.animated-bg-text');
const whishlistIcon = getElement(".purchase__addToWhishlist");

let whishlist = JSON.parse(localStorage.getItem('whishlist'));

const dataProd = JSON.parse(localStorage.getItem('product'));


const countries = [
    "United States",
    "France",
    "Japan",
    "Italy",
    "Spain",
    "Germany",
    "United Kingdom",
    "Australia",
    "Canada",
    "Brazil",
    "China",
    "India",
    "Mexico",
    "Russia",
    "South Africa"
];

//get local storage
function DisplayProduct(){
    //get single product
    SetProduct();
    IsProductInWishlist();
}

function SetProduct(){

    //get dom element
    const title = getElement(".description__title");
    const images = getElement(".products__image__gallery");
    const mainImage = getElement(".products__images__main");
    const reviews = getElement(".description__reviews");
    const description = getElement(".description__info");
    const priceEl = getElement(".description__price");
    
    const imgList = [
        dataProd.images[0],
        dataProd.images[1],
        dataProd.images[2],
        dataProd.images[3],
    ]
    
    //text and description values
    title.textContent = dataProd.title;
    description.textContent = dataProd.description;
    
    //forEach imgage inside ImgList, build an image
    images.innerHTML = imgList.map((item)=>{
        if(!item) return;
        return `
            <div class="gallery__image">
                <img src="${item}" alt="">
            </div>
        `
    }).join("");

    mainImage.innerHTML = `<img src="${dataProd.images[0]}" alt=""> `
    
    reviews.innerHTML = 
    `
        <span class="stars">${GetRatingInStars(dataProd)}</span>
        <span>(${dataProd.reviews.length} reviews)</span>
        <span>|</span>
        <span>In stock</span>
    `

    //change image with click
    const imgsSelector = getElements(".gallery__image");

    imgsSelector.forEach((img ,idx) =>{
        img.addEventListener("click",(e)=>{
            mainImage.innerHTML = `<img src="${dataProd.images[idx]}" alt=""> `
        })
    })

    //check if dataProd is onsale
    if (dataProd.hasOwnProperty('onSaleProp')) {
        
        priceEl.innerHTML = 
        `
            <span class="onsale">$${GetDiscountPrice(dataProd)}</span> 
            <span class="normal">$${dataProd.price}</span>
            <span class="redDiscount">-${dataProd.discountPercentage +"%"}</span>
        `
    } 
    else {
        priceEl.innerHTML = 
        `<span class="normal notSale">$${dataProd.price}</span>`
    }

     //rewiews section DOM
    const rewiews = getElement(".rewiews");

    //rewiews section in product API
    dataProd.reviews.forEach(data =>{

        const productRewiew = document.createElement("div");
        productRewiew.classList.add("product__rewiew");

        productRewiew.innerHTML = 
        `
            <div>
                <span class="rewiew__user"><img src="Img/img_product/user profile img.png" alt=""></span>
                <span class="rewiew__name">${data.reviewerName}</span>
            </div>
            <p class="rewiew__rating stars">${GetRatingInStars(data)}</p>
            <p class="rewiew__data">Reviewed in ${GetRandomCoutry()} ${GetDataISO(data.date)}</p>
            <p class="rewiew__comment">${data.comment}</p>
        
        `
        rewiews.appendChild(productRewiew);
    })

    //Add to Cart
    const addTocartBtn = document.querySelector(".purchase__addToCart");

    addTocartBtn.addEventListener("click" , () => {
        
        for(let i = 0; i < amount; i++){
            AddToCart(dataProd);
        }
    })

    //delete placeholder style
    animated_bgs.forEach((bg) => bg.classList.remove('animated-bg'))
    animated_bg_texts.forEach((bg) => bg.classList.remove('animated-bg-text'))

    const placeholderRewiews = getElements(".placeholder__rewiew");

    placeholderRewiews.forEach(placeholder => {
        placeholder.remove();
    })
}

//refactoring day of the review post
function GetDataISO(isoString) {

    // get numbers before T
    let dataISO = isoString.split('T')[0];
    
    let [anno, mese, giorno] = dataISO.split('-');
    
    return `${giorno}/${mese}/${anno}`;
}

function GetRandomCoutry() {
    
    const ramdomCountrye = Math.floor(Math.random() * countries.length);
    return countries[ramdomCountrye];
}

//management of the quantity of items I want to buy
const increaseQty = getElement("#increaseQty");
const decreaseQty = getElement("#decreaseQty");
let amountToAddCart = getElement("#amountQty");
let amount = parseInt(amountToAddCart.textContent); 

increaseQty.addEventListener("click" , ()=>{
    amount++;
    amountToAddCart.textContent = amount.toString();
})

decreaseQty.addEventListener("click" , ()=>{
    if(amount > 1){
        amount--;
        amountToAddCart.textContent = amount.toString();
    }
    else{
        return;
    }
})

function IsProductInWishlist() {
    const foundProduct = whishlist.find(prod => prod.product.id === dataProd.id);
    
    if (foundProduct) {
        whishlistIcon.classList.add("inWishlist");
    } else {
        whishlistIcon.classList.remove("inWishlist");
    }
}

whishlistIcon.addEventListener("click" , () => {
    //add product to whishlist, this function check is product is already in wishlist
    AddToWhishlist(dataProd);

    if(whishlistIcon.classList.contains("inWishlist"))
    {
        whishlistIcon.classList.remove("inWishlist");

        //find id DOM = id API
        const indexToRemove = whishlist.findIndex(item => item.product.id === dataProd.id);
                
        //remove item to API
        whishlist.splice(indexToRemove, 1);
                
        localStorage.setItem('whishlist', JSON.stringify(whishlist));

        //Update whishlist number icon
        UpdateWhishlistIcon(whishlist.length);
    }
    else{
        whishlistIcon.classList.add("inWishlist");
    }
})

//only to showing placeholder effect
window.addEventListener("DOMContentLoaded",DisplayProduct);
//To change color icon if product is in whislist
window.addEventListener("DOMContentLoaded", IsProductInWishlist);

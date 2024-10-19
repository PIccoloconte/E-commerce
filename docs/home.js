import { GetRatingInStars ,GetDiscountPrice ,AddToCart ,AddToWhishlist} from "./utils_script/utils.js";
import { getElement, getElements } from "./utils_script/getElement.js";
//import { UpdateWhishlistIcon } from "/docs./main.js";
import { UpdateWhishlistIcon } from "./main.js";

const URL = "https://dummyjson.com/products/?skip=0&limit=200";
const sectionProds = document.querySelectorAll(".section__products");
const sectionClassesToCheck = ["flash-sales","best-selling","our-products"];

let editableProducts = [];

//local storage
let btnBoolean = {onSaleProd : "false" , bestProd : "false", all: "false"}
localStorage.setItem('btnBoolean', JSON.stringify(btnBoolean));

//all local storage products
let localStorageProds = [];

//products limit insede the section products
const limitProd = 12;

//get data from dummyjson api
async function GetData(){
    try{
        const res = await fetch(URL);
        const data = await res.json();
        editableProducts = data;

        //placeholder to show placerholder products before loading API products
        const cardProductsPlaceholder = getElements(".card__products");
        cardProductsPlaceholder.forEach(card => {
            card.remove();
        })
        CheckSection();
    }
    catch(error){
        console.log(error);
    }
}

GetData();

//fill the section products,onSale, bestSelling, all
function CheckSection(){
    sectionProds.forEach((section) =>{ 
        if(sectionClassesToCheck.some((cls) => section.classList.contains(cls))){
            DisplayProd(section);
        }
    })
}

//display poducts into DOM
function DisplayProd(section){

    const cardProducts = document.createElement("div");
    cardProducts.classList.add("card__products");
    section.insertBefore(cardProducts, section.querySelector('.viewProductsBtn'));

    for(let i = 0; i < editableProducts.products.length; i++){
        const product = document.createElement("div");
        product.classList.add("product");
        
        const randomProd = GetRandomProd();

        //add randomProd to localStorage future array
        localStorageProds.push(randomProd);
        
        //get the index of the array of the product to remove so as not to always have the same product
        const randomProdIndex = editableProducts.products.indexOf(randomProd);

        //delete randomProd to editableProducts array
        if (randomProdIndex !== -1) {
            editableProducts.products.splice(randomProdIndex, 1);
        }

        //max 12 products to section
        if(i < limitProd){

            //if product is on sale ,then I show sale parameters
            if(section.classList.contains(sectionClassesToCheck[0])){
                    randomProd.onSaleProp = "true";
    
                    product.innerHTML = 
                        `
                            <div class="product__container">
                                <a href="product.html">
                                    <img class="product__container__image" src=${randomProd.images[0]} width="150px" height="150px" loading="lazy" alt="">
                                </a>
                                <div class="product__container__discount">${randomProd.discountPercentage +"%"}</div>
                                <button id="product__container__wishlistBtn"><i class="ri-heart-line"></i></button>
                                <button class="addToCartBtn">Add to Cart</button>
                            </div>
                            <div class="product__name">${randomProd.title}</div>
                            <div class="product__price">
                                <span class="product__price__onsale">${GetDiscountPrice(randomProd)}</span> 
                                <span class="product__price__normal">${randomProd.price + "$"}</span>
                            </div>
                            <div class="product__rating stars">${GetRatingInStars(randomProd)}</div>
                        
                        `
            }

            //best selling products 
            else if( section.classList.contains(sectionClassesToCheck[1])){ 
                randomProd.bestSellingProp = "true";
    
                product.innerHTML = 
                `
                    <div class="product__container">
                        <a href="product.html">
                            <img class="product__container__image" src=${randomProd.images[0]} width="150px" height="150px" loading="lazy" alt="">
                        </a>    
                        <button id="product__container__wishlistBtn"><i class="ri-heart-line"></i></button>
                        <button class="addToCartBtn">Add to Cart</button>
                    </div>
                    <div class="product__name">${randomProd.title}</div>
                    <div class="product__price">
                        <span class="product__price__onsale">${randomProd.price + "$"}</span> 
                    </div>
                    <div class="product__rating stars">${GetRatingInStars(randomProd)}</div>
                
                `
            }
            else{
                product.innerHTML = 
                        `
                            <div class="product__container">
                                <a href="product.html">
                                    <img class="product__container__image" src=${randomProd.images[0]} width="150px" height="150px" loading="lazy" alt="">
                                </a>    
                                <button id="product__container__wishlistBtn"><i class="ri-heart-line"></i></button>
                                <button class="addToCartBtn">Add to Cart</button>
                            </div>
                            <div class="product__name">${randomProd.title}</div>
                            <div class="product__price">
                                <span class="product__price__onsale">${randomProd.price + "$"}</span> 
                            </div>
                            <div class="product__rating stars">${GetRatingInStars(randomProd)}</div>
                        
                        `
            }
            
            cardProducts.append(product);
        
            //Add to card button function for each product
            product.firstElementChild.lastElementChild.addEventListener("click", () => AddToCart(randomProd))
            
            const wishlistBtn = product.firstElementChild.lastElementChild.previousElementSibling;

            //check if product is in whishlist when loading page
            IsProductInWishlist(randomProd,wishlistBtn);

            //add to whishlist
            wishlistBtn.addEventListener("click",() => {
                AddToWhishlist(randomProd);

                let whishlist = JSON.parse(localStorage.getItem('whishlist')) || [];
                
                //capire perchè mi toglie due prodotti alla volta
                if(wishlistBtn.classList.contains("inWishlist"))
                    {
                        wishlistBtn.classList.remove("inWishlist");
                
                        //find id DOM = id API
                        const indexToRemove = whishlist.findIndex(item => item.product.id === randomProd.id);
                                                
                        //remove item to API
                        whishlist.splice(indexToRemove, 1);
                        
                        localStorage.setItem('whishlist', JSON.stringify(whishlist));
                
                        //Update whishlist number icon
                        UpdateWhishlistIcon(whishlist.length);
                    }
                    else{
                        wishlistBtn.classList.add("inWishlist");
                    }
            })
            
            //Set product value to localStorage when click it
            product.addEventListener("click", function(){
                
                localStorage.setItem('product', JSON.stringify(randomProd));
            })

        }
    }

    //Set all products into localStorage
    localStorage.setItem('localStorageProds', JSON.stringify(localStorageProds));
}

//function to handle click on "View Products" buttons
function handleViewProductsClick(btnType) {
    
    btnBoolean[btnType] = "true";

    // Save the button state in local storage as a JSON string
    localStorage.setItem('btnBoolean', JSON.stringify(btnBoolean));
    
    window.location.href = "productsPage.html";
}

// Handle click on "View Products" button in the "Flash Sales" section
document.querySelector('.flash-sales .viewProductsBtn').addEventListener('click', function() {
    handleViewProductsClick('onSaleProd');
});

// Handle click on "View Products" button in the "best selling" section
document.querySelector('.best-selling .viewProductsBtn').addEventListener('click', function() {
    handleViewProductsClick('bestProd');
});

// Handle click on "View Products" button in the "all products" section
document.querySelector('.our-products .viewProductsBtn').addEventListener('click', function() {
    handleViewProductsClick('all');
});

//get random product from editableProducts array
function GetRandomProd(){
    const random = Math.floor(Math.random() * (editableProducts.products.length));
    return editableProducts.products[random];
}

//big img interactions
const iphoneImg = getElement(".iphone");
const macImg = getElement(".mac");
const t_max = getElement(".t-max");
const rolexCellini = getElement(".rolex-cellini");
const americanBall = getElement(".american-ball");
const gucciImg = getElement(".gucci");
const jordan1 = getElement(".jordan1");

iphoneImg.addEventListener("click" , () => {
    DisplayProductImage(124);
})
macImg.addEventListener("click" , () => {
    DisplayProductImage(78);
})
t_max.addEventListener("click" , () => {
    DisplayProductImage(116);
})
rolexCellini.addEventListener("click" , () => {
    DisplayProductImage(95);
})
americanBall.addEventListener("click" , () => {
    DisplayProductImage(137);
})
gucciImg.addEventListener("click" , () => {
    DisplayProductImage(10);
})
jordan1.addEventListener("click" , () => {
    DisplayProductImage(88);
})

//async function to dispay big img products
async function DisplayProductImage(id){
    const resImg = await fetch(`https://dummyjson.com/products/${id}`);
    const dataImg = await resImg.json();

    //Set img product value to localStorage when i click it
    localStorage.setItem('product', JSON.stringify(dataImg));
    window.location.href = "product.html"
}

//IMAGE CAROUSEL
//big img carousel function > 1200px
const carouselImages = getElement('.carousel__images');
const images = getElements('.carousel__images__image');
const carouselNav = getElement("#carousel__nav");
let activateFirstDot = 0;
let currentIndex = 0;
let autoScrollInterval;
let direction = 1; // 1 to go right, -1 to go left
let startX = 0; // touch starting position , only for mobile

for(let i = 0; i < images.length; i++){
    //create dot navigation
    const dot = document.createElement("div");
    dot.classList.add("nav__dot");
    carouselNav.append(dot);
    
    dot.addEventListener("click", () => {
        clearInterval(autoScrollInterval); //stop autoscroll 

        RemoveActiveDots();
        dot.classList.add("active");
        ScrollWithDots(i);

        currentIndex = i;
        startAutoScroll(); // start autoscroll
    });

    // active fist dot after loading page
    if (activateFirstDot <= 0) {
        dot.classList.add("active");
        activateFirstDot++;
    }
}

//scroll carousel 
function ScrollWithDots(i) {
    carouselImages.scroll({ left: i * images[0].offsetWidth, behavior: 'smooth' });
}

function RemoveActiveDots() {
    const dots = getElements(".nav__dot");
    dots.forEach(dot => {
        dot.classList.remove("active");
    });
}

function startAutoScroll() {
    
    autoScrollInterval = setInterval(() => {
        // Change direction on last images of array
        if (currentIndex === images.length - 1) {
            direction = -1;
        }
        // change direction on fisrt images of array
        else if (currentIndex === 0) {
            direction = 1;
        }

        // change index by direction
        currentIndex += direction;

        RemoveActiveDots(); 

        // Get array index via active dot 
        const activeDot = carouselNav.children[currentIndex]; 
        activeDot.classList.add("active"); 
        ScrollWithDots(currentIndex); 
    }, 5000); 
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

//mobile scroll carousel
carouselImages.addEventListener('touchstart', (e) => {
    stopAutoScroll();
    startX = e.touches[0].clientX; //Start touch position
});

carouselImages.addEventListener('touchmove', (e) => {
    const touchMoveX = e.touches[0].clientX;
    const moveDiff = startX - touchMoveX; //Difference between start and finish touch position

    if (Math.abs(moveDiff) > 50) { // Threshold per evitare movimenti accidentali
        if (moveDiff > 0) {

            //RIght swipe
            if (currentIndex < images.length - 1) {
                currentIndex++;
            }
        } else {
            // left swipe
            if (currentIndex > 0) {
                currentIndex--;
            }
        }

        RemoveActiveDots(); 
        const activeDot = carouselNav.children[currentIndex];
        activeDot.classList.add("active");
        ScrollWithDots(currentIndex);
        startX = touchMoveX; // Reset start touching point
        stopAutoScroll();
    }
});

carouselImages.addEventListener('touchend', () => {
    startAutoScroll(); //Start autoscroll after finish touching
});

//start autoscroll on loading page
window.addEventListener("DOMContentLoaded",startAutoScroll());

//CARDS PRODUCTS SECTION
//card products btn slider function > 1024px
const sectionBtnLeft = getElements(".section__description__btn .left");
const sectionBtnRight = getElements(".section__description__btn .right");

let leftPxCorrection;

//activate on resize screen
window.addEventListener('resize', function() {
    
    //to big img carousel
    carouselImages.style.transform = `translateX(${0}%)`;

    //to section slider products
    sectionProds.forEach((section) =>{

        //card products
        const cardProducts = section.lastElementChild.previousSibling;
        cardProducts.style.left = `0px`

        //calc section max-with minus cardsProducts max-wwith to have the perfect repositioning of the products
        leftPxCorrection = `${section.offsetWidth - cardProducts.offsetWidth}px`
    })
})

//left btn slider procuts
sectionBtnLeft.forEach((btn) => {
    btn.addEventListener("click" , (e) =>{

        //get card products
        const cardProducts = e.currentTarget.parentNode.parentNode.nextElementSibling;
        cardProducts.style.left = `0px`
    })
})

//right btn slider procuts
sectionBtnRight.forEach((btn) => {
    btn.addEventListener("click" , (e) =>{

        //get card products
        const cardProducts = e.currentTarget.parentNode.parentNode.nextElementSibling;
        
        //get section product
        const section = e.currentTarget.parentNode.parentNode.parentNode;
        
        leftPxCorrection = `${section.offsetWidth - cardProducts.offsetWidth}px`
        cardProducts.style.left = leftPxCorrection
    })
})


//WISHLIST SECTION
function IsProductInWishlist(randomProd,wishlistBtn){

    let whishlist = JSON.parse(localStorage.getItem('whishlist')) || [];

    const foundProduct = whishlist.find(prod => prod.product.id === randomProd.id);
    
    if (foundProduct) {
        wishlistBtn.classList.add("inWishlist");
    } else {
        wishlistBtn.classList.remove("inWishlist");
    }
}



//TIMER SECTION
//timer function ins section "products in sale"
const now = new Date().getTime();

//calc 3 days to change the products in sale    
const futureDate = now + (3 * 24 * 60 * 60 * 1000);

const targetDate = new Date(futureDate).getTime();

function updateTimer() {
    
    const currentTime = new Date().getTime();
    const timeDifference = targetDate - currentTime;

    // calc days, hours, minutes and seconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Add 0 if value is < 10
    const paddedDays = padNumber(days);
    const paddedHours = padNumber(hours);
    const paddedMinutes = padNumber(minutes);
    const paddedSeconds = padNumber(seconds);

    document.getElementById("days").innerHTML = paddedDays + "&nbsp<span>:</span>&nbsp<p>Days</p>";
    document.getElementById("hours").innerHTML = paddedHours + "&nbsp<span>:</span>&nbsp<p>Hours</p>";
    document.getElementById("minutes").innerHTML = paddedMinutes + "&nbsp<span>:</span>&nbsp<p>Minutes</p>";
    document.getElementById("seconds").innerHTML = paddedSeconds + "<p>Seconds</p>";

    if (timeDifference < 0) {
        window.location.href = "product.html"
    }
}

function padNumber(number) {
    return number < 10 ? '0' + number : number;
}

// update timer
const timerInterval = setInterval(updateTimer, 1000);

//start on loading page
updateTimer();
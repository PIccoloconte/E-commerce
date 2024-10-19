import { getElement, getElements } from "./utils_script/getElement.js";
import { GetRatingInStars ,GetDiscountPrice ,AddToCart} from "./utils_script/utils.js";

let allProds = JSON.parse(localStorage.getItem('localStorageProds'));
let btnBoolean = JSON.parse(localStorage.getItem('btnBoolean'));

//background cover when opening the downbar filter
const backgroundCover = getElement("#background__cover");
const openDownbar = getElement("#openDownbar");
const closeDownbar = getElement("#closeDownbar");
const downbar = getElement("#downbar");

//management of downbar button and style
openDownbar.addEventListener("click" , () => {
    downbar.classList.add("show");
    backgroundCover.classList.add("show");
    document.body.style.overflow = `hidden`;
})
closeDownbar.addEventListener("click" , () => {
    downbar.classList.remove("show");
    backgroundCover.classList.remove("show");
    document.body.style.overflow = `auto`;
})

//categories list DOM
const filterAside = getElement("#filter__aside");
const categoriesList = getElement("#categories__list");
const categoriesListDownbar = getElement("#downbar__categories");

//search area DOM
const searchValueDOM = getElement(".header__actions__search");

//products area DOM
const containerProds = getElement(".container__productsPage");

//function to filter through the "search bar", if it is not used, all products will be returned
function FilterProducts(){

    let filteredProducts;
    
    //search bar value
    const searchValue = localStorage.getItem("searchValue") || '';
    const searchValueLower = searchValue.toLowerCase();

    //set corret search value into DOM
    searchValueDOM.value = searchValue;

    //filter products by search value and category
    filteredProducts = allProds.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchValueLower);
        
        return matchesSearch ; 
    });

    //filter by Category
    filteredProducts = FilterByCategory(filteredProducts);

    //filter products by price
    filteredProducts = FilterByPrice(filteredProducts);

    //filter producs by BTN(onSaleProd,bestProd,all)
    FilterProductsByProperty(filteredProducts);
}

//Filter products by index.html BTN(onSaleProd,bestProd,all)
function FilterProductsByProperty(arrayProds) {
    const filteredProds = arrayProds.filter(prod => {
        if (btnBoolean.onSaleProd === "true" && prod.hasOwnProperty("onSaleProp")) {
            return true;
        }
        if (btnBoolean.bestProd === "true" && prod.hasOwnProperty("bestSellingProp")) {
            return true; 
        }
        if (btnBoolean.onSaleProd !== "true" && btnBoolean.bestProd !== "true") {
            return true; 
        }
        return false; 
    });
        //check if at least 1 prod exist , otherwise create a message
        if(filteredProds.length === 0){
            
            //activate placeholder not avaliable item
            const itemNotAvaliable = getElement("#itemNotAvaliable");
            itemNotAvaliable.style.display = 'block';

            //remove filters 
            openDownbar.style.display = 'none';
            filterAside.style.display = 'none';
        }
        
        DisplayProds(filteredProds);
};

//Display products
function DisplayProds(array){
    
    containerProds.innerHTML = "";

    array.forEach(prod => {
        
        const newProd = document.createElement("div");
        newProd.classList.add("products__item");
    
        newProd.innerHTML = 
        `
            <a href="product.html" class="product__image">
                <img src="${prod.images[0]}" loading="lazy" alt="Product Image">
            </a>
            <div class="product__details">
                <h3>${prod.title}</h3>
                <p>${prod.description}</p>
                <p class="stars">${GetRatingInStars(prod)}</p>
                ${
                    prod.onSaleProp ?
                    `
                        <div>
                            <span class="red600">$${GetDiscountPrice(prod)}</span>
                            <span class="normal">$${prod.price}</span>
                        </div>
    
                     ` 
                    :
                     ` 
                        <div>
                            <span class="red600">$${prod.price}</span>
                        </div>
    
                     ` 
                }
                
                <button id="productsPage__addToCart">Add to cart</button>
            </div>
        
        `
        containerProds.append(newProd);

        //display single product
        newProd.addEventListener("click",function(){
            localStorage.setItem('product', JSON.stringify(prod));
        })

        //take btn AddToCart
        newProd.lastElementChild.lastElementChild.addEventListener("click", () => AddToCart(prod));
    });
}

//Set checkbox by category
function SetCategories(){
    
    categoriesListDownbar.innerHTML ="";
    categoriesList.innerHTML = "";

    const categories = (["all",...new Set(allProds.map((product) => product.category))].sort());
    
    categories.map((category) =>{
        const newItemCategory = document.createElement("li");
        newItemCategory.innerHTML = 
        `
            <input type="checkbox" id="${category}" class="categoryCheckbox">
            <label for="${category}">${category}</label>
        `
        
        if (window.innerWidth < 1024) {
            categoriesListDownbar.appendChild(newItemCategory);
        } else {
            categoriesList.appendChild(newItemCategory);
        }

    })
}

//Filter products by category
function FilterByCategory(filteredProducts){
    const checkboxes = document.querySelectorAll('details input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', FilterProducts);
        //toggle checkbox "All"
        checkboxes[0].checked = false;
    });
    
    const activeCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    if (activeCheckboxes.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return activeCheckboxes.some(checkbox => {
                const category = checkbox.nextElementSibling.textContent;
                return category === 'all' || product.category === category;
            });
        });
    }
    else{
        //toggle checkbox "All"
        checkboxes[0].checked = true;
    }
    return filteredProducts;
}

//filter by price function, return an array
function FilterByPrice(products) {
    const priceRadio = getElements(".priceRadio");

    priceRadio.forEach(radio =>{
        if(radio.checked){
            if(radio.classList.contains("cheapest")){
                products.sort((a, b) => a.price - b.price);
            }
            if(radio.classList.contains("expensive")){
                products.sort((a, b) => b.price - a.price);
            }
        }
    }) 
    return products
}

//change radio or checkbox section
const priceRadio = getElements(".priceRadio");
priceRadio.forEach(radio =>{
    radio.addEventListener("change",FilterProducts);
})

document.addEventListener("DOMContentLoaded", () => {
    
    // Una volta che SetCategories ha completato il suo lavoro, aggiungi gli event listener ai checkbox
    const checkboxes = document.querySelectorAll('details input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', FilterProducts);
    });
});

window.addEventListener("resize" , ChangeCheckedRadioAll);
window.addEventListener("DOMContentLoaded" , ChangeCheckedRadioAll);
    
//Change checked "All" radio when changing screen size
function ChangeCheckedRadioAll(){
    const priceRadio = getElements(".priceRadio");

    if (window.innerWidth < 1024) {
        priceRadio[0].checked = false;
        priceRadio[3].checked = true;
    } else {
        priceRadio[0].checked = true;
        priceRadio[3].checked = false;
    }
}

window.addEventListener("DOMContentLoaded",SetCategories());
window.addEventListener("DOMContentLoaded", FilterProducts());





















































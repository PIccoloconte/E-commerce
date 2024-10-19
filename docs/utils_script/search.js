import { getElement } from "./getElement.js";

//clear value after changing page
localStorage.setItem("searchValue","");

//search area DOM
const searchValue = getElement(".header__actions__search");
const searchForm = getElement(".header__actions__form");

searchForm.addEventListener("submit", function (e) {
    //new add 
    localStorage.setItem("searchValue","");

    e.preventDefault();
    const value = searchValue.value;
    localStorage.setItem("searchValue", value);

    //if i'm already on the Products page, i load the FilterProducts script with a promise to prevent crash
    /*if (window.location.pathname === "/productsPage.html") {
        import("/productsPage.js").then((module) => {
            const { FilterProducts } = module;
            FilterProducts();
        }).catch((error) => {
            console.error("Error loading module:", error);
        });
    } */
    
    /*else {*/
        // all page less than productsPage.html
        window.location.href = "productsPage.html"; 
    //}
    let btnBoolean = {onSaleProd : "false" , bestProd : "false", all: "false"}
    localStorage.setItem('btnBoolean', JSON.stringify(btnBoolean));     

});



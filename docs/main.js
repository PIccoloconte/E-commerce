import { getElement ,getElements } from "./utils_script/getElement.js";

//toggle aside bars
const sidebar = document.querySelector(".sidebar");
const barsButton = document.querySelector(".header__top__bars");
const asideCloseBTn = document.querySelector(".sidebar__close__btn");
const backgroundCover = getElement("#background__cover");

barsButton.addEventListener("click", ()=> {
    sidebar.classList.add("show");
    asideCloseBTn.classList.add("show");

    //add dark background when open aside
    backgroundCover.classList.add("show");
    document.body.style.overflow = `hidden`;
});

asideCloseBTn.addEventListener("click",()=> {
    sidebar.classList.remove("show");
    asideCloseBTn.classList.remove("show");

    backgroundCover.classList.remove("show");
    document.body.style.overflow = `auto`;
});


//Card number icon for all HTML pages
const cartNumebrIcon = getElement("#cart__amount");

let cart = JSON.parse(localStorage.getItem('cart')) || [];

cartNumebrIcon.textContent = cart.length.toString();

//call this function when add or remove products to the cart
function UpdateCartIcon(cartAmount){
    cartNumebrIcon.textContent = cartAmount.toString();
}


//Whishlist number icon for all HTML pages
const whishlistNumberIcon = getElement("#whishlist__amount");

let whishlist = JSON.parse(localStorage.getItem('whishlist')) || [];

whishlistNumberIcon.textContent = whishlist.length.toString();

function UpdateWhishlistIcon(wishlistAmount){
    whishlistNumberIcon.textContent = wishlistAmount.toString();
}


//Modal activate function
const openModalBtns = getElements(".modal__open");
const closeModalBtn = getElements(".close__modal");
let modalID;

openModalBtns.forEach((btn) =>{
    btn.addEventListener("click" , (e) =>{
        if (e.currentTarget.classList.contains("privacy")) {
            //get the name of the class privacy
            modalID = e.currentTarget.classList[1];
            OpenModal(modalID);
        }
        else if(e.currentTarget.classList.contains("termOfUs")){
            modalID = e.currentTarget.classList[1];
            OpenModal(modalID);
        }
        else if(e.currentTarget.classList.contains("faq")){
            modalID = e.currentTarget.classList[1];
            OpenModal(modalID);
        }
    })
})

function OpenModal(modalIDName){
    const modal = getElement("#" + modalIDName);
    modal.showModal();
    modal.scrollTop = 0;
}
closeModalBtn.forEach((btn) =>{
    btn.addEventListener("click" , () =>{
        const modalOpen = getElements(".modal");
        modalOpen.forEach(modal => {
            modal.close();
        })
    })
})

//FAQ item display
const faqItems = getElements('.faq__item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    // Toggle visibility of the answer on question click
    question.addEventListener('click', () => {
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        question.classList.toggle("open")
    });
});

export {
    UpdateCartIcon,
    UpdateWhishlistIcon
}
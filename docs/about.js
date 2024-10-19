import { getElement, getElements } from "./utils_script/getElement.js";

const images = getElements('.profile__img');
const navigation = getElement("#navigation");
const slider = getElement(".slider");

//creating dots and scrollIntoView section
function SlideImageWithDots(sliderRatio){

    for(let i = 0 ; i < sliderRatio  ; i++){
        const dot = document.createElement("div");
        dot.classList.add("dot");
        navigation.append(dot);

        dot.addEventListener("click", ((index) => {
            return () => {
                
                RemoveActiveDots();
                dot.classList.add("active");

                slider.scroll({ left: index * images[0].offsetWidth , behavior: 'smooth' });
            };
        })(i));
    }
}
//change active dot
function RemoveActiveDots(){
    const dots = getElements(".dot");
    dots.forEach(dot => {
        dot.classList.remove("active");
    });
}

//calc the ratio beetween all images(width + gap) and the current size of slider div to find how many dots need to create
function CalcRatioSliderImg(){
    images[0].offsetWidth; 
    
    //300px (img width) * 12(images.lenght) + gap beetween img
    let sliderWidthOffScreen = (images[0].offsetWidth * images.length + 90) - slider.offsetWidth;
    
    //sliderWidthOffScreen / [300px (img width) + gap]
    const sliderImgRatio = sliderWidthOffScreen / (images[0].offsetWidth + 10); 
    
    SlideImageWithDots(sliderImgRatio + 1)
}

//put the class="active" to the first dot
function ActivateFirstDot(){
    const firstDot = getElement(".dot");
    if (firstDot) {
        firstDot.classList.add("active");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    CalcRatioSliderImg();
    ActivateFirstDot();
})



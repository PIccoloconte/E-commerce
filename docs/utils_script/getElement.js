//get single DOM element
const getElement = (selection) => {
    const element = document.querySelector(selection);
    if (element) return element;
    throw new Error("no element selected");
  };
  
//get multiple DOM elements
const getElements = (selection) => {
  const element = document.querySelectorAll(selection);
  if (element) return element;
  throw new Error("no element selected");
};



export { getElement,getElements};
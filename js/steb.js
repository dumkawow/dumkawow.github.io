'use strict';

const smModal = document.querySelector('.sm-modal'),
      formFFFF = smModal.querySelector('[data-fff]'),
      formBTN = smModal.querySelector('[data-mbtn]');


const smInt = setInterval(showSM, 3000);

function showSM() {
    smModal.classList.add('sm-active');
    smModal.classList.remove('sm-hide');
    clearInterval(smInt);
}

function closeSM() {
    smModal.classList.add('sm-hide');
    smModal.classList.remove('sm-active');
}

formFFFF.addEventListener('click', (e) => {
    e.preventDefault();
});

formBTN.addEventListener('click', closeSM);

const fixHeader = document.querySelector('.header');

function FHshow() {
    fixHeader.classList.add('fix');
}

function FHhide() {
    fixHeader.classList.remove('fix');
}

window.addEventListener('scroll', (e) => {
    if (window.pageYOffset > 250) {
        FHshow();
    } else {FHhide();}
});





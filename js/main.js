'use strict';
import form from './modules/form';
import calculator from './modules/calculator';
import cardMenu from './modules/cardmenu';
import modal from './modules/modal';
import slider from './modules/slider';
import tabs from './modules/tabs';
import timer from './modules/timer';
import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 300000);

    form('form', modalTimerId, '.modal');
    cardMenu();
    calculator();
    modal('.modal', '[data-modal]', modalTimerId);
    slider({
        container: '.offer__slider',
        wrapper: '.offer__slider-wrapper',
        field: '.offer_slide-inner',
        slides: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        nextArrow: '.offer__slider-next',
        totalCounter:'#total',
        currentCounter: '#current',
    });
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    timer('.timer', '2020-11-11');
});



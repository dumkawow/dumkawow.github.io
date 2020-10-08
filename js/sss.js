'use strict';

const menuItem = document.querySelectorAll('.menu__item'),
      menuBtns = document.querySelectorAll('[data-bbb]');



    function hide() {
        menuItem.forEach(item => {
            item.classList.add('hide');
        });
    }

    hide();

    function show(i) {
        menuItem[i].classList.remove('hide');
        menuItem[i].classList.add('active');
    }

    menuBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            hide();

            show(i);
        });
    });




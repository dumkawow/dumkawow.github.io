'use strict';


window.addEventListener('DOMContentLoaded', () => {

    // tabs

const getTabs = document.querySelector('.tabheader__items'), //tabsParent
      tabs = document.querySelectorAll('.tabcontent'), // tabsContent
      tabsMenu = document.querySelectorAll('.tabheader__item'); // tabs

    function hideTab() {
    tabs.forEach(item => {
        item.style.display = 'none';
    });

    tabsMenu.forEach(item => {
        item.classList.remove('tabheader__item_active');
    });
    }
    hideTab();

    function showTab(i = 0) {
        tabs[i].style.display = '';
        tabsMenu[i].classList.add('tabheader__item_active');
    }
    showTab();  

    getTabs.addEventListener('click', (e) => {
        if(e.target && e.target.classList.contains('tabheader__item')) {
            tabsMenu.forEach((item, i) => {
                if(e.target == item) {
                    hideTab();
                    showTab(i);
                }
            });
        }
    });
      
    // Modal

    const modal = document.querySelector('.modal'),
          modalShow = document.querySelectorAll('[data-modal]');


    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showModal() {

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

    }

    modalShow.forEach(btn => {
        btn.addEventListener('click', showModal);
    });

    modal.addEventListener('click', (e) => {
        if(e.target == modal || e.target.getAttribute('data-close') == '') {
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape' && modal.style.display == 'block') {
            hideModal();
        }
    });


    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


    // timer

    const deadline = '2120-09-13';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              day = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t/ (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / (1000 * 60) % 60)),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'day': day,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } return num;
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              day = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              setTime = setInterval(updateClock, 1000);

        updateClock();
        
        function updateClock() {
            const t = getTimeRemaining(endtime);

            day.innerHTML = getZero(t.day);
            hours.innerHTML = t.hours;
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(setTime);
            }
        }
    }
    setClock('.timer', deadline);


    // CardMenu

    class CardMenu {
        constructor(src, alt, title, descr, price, parentSelector, ...clasess) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parentSelector = document.querySelector(parentSelector);
            this.clasess = clasess;
        }

        render() {
            const element = document.createElement('div');

            if(this.clasess.length === 0) {
                this.clasess = 'menu__item';
                element.classList.add(this.clasess);
            } else {
                this.clasess.forEach(className => element.classList.add(className));
            }

            element.innerHTML = 
            `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parentSelector.append(element);
        }

    }

    const bd = async (url) =>  {
        const res = await fetch(url);

        return await res.json();
    };
    
    bd('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {

            const element = document.createElement('div');
            element.classList.add('menu__item');

            element.innerHTML = `
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>
            `;
            document.querySelector('.menu .container').append(element);
        });
    });

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        succes: 'СПАСИБО ЗА ЗАЯВКe',
        fail: 'fail'
    };

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        showModal();

        const thxModal = document.createElement('div');
        thxModal.classList.add('modal__dialog');
        thxModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title"> ${message} </div>
            </div>
        `;
        document.querySelector('.modal').append(thxModal);

        setTimeout(() => {
            hideModal();
            prevModalDialog.classList.remove('hide');
            thxModal.remove();
        }, 4000);
    }

    const postData = async (url, data) => {
        let req = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await req.json();
    };
    forms.forEach(form => {
        bindPostData(form);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                margin: o auto;
                display: block;    
            `;
            form.append(statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
            });
        });
    }


    // slider

    let slideIndex = 1;
    let offset = 0;

    const slideWrapper = document.querySelector('.offer__slider-wrapper'),
          slideInner = slideWrapper.querySelector('.offer_slide-inner'),
          slide = slideWrapper.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          width = window.getComputedStyle(slideWrapper).width,
          slider = document.querySelector('.offer__slider');
    
    slide.forEach((slide) => slide.style.width = width);
    const t = 100 * slide.length + '%';
    slideInner.style.cssText = `
        width: ${t};
        display: flex;
        transition: .7s all;
    `;
    slideWrapper.style.overflow = 'hidden';
    slider.style.position = 'relative';

    function setCounter() {
        if (slide.length < 10) {
            total.textContent = `0${slide.length}`;
            current.textContent = `0${slideIndex}`;
        } else {
            total.textContent = slide.length;
            current.textContent = slideIndex;
        }
    }
    setCounter();
    function toggleActiveIndicator(arr) {
        arr.style.cssText = `
            opacity: 1;
            width: 25px
        `;
    }
    function toggleDots() {
        dots.forEach(item => {
            item.style.opacity = '.5';
            item.style.width = '10px';
        });
        toggleActiveIndicator(dots[slideIndex - 1]);
    }
    function deteleNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    function toggleSlide(pos) {
            slideInner.style.transform = `translateX(-${pos}px)`;
    }

    function savePosSlide(pos) {
        localStorage.setItem('position', pos);
        if (localStorage.getItem('position' !== 0)) {
            offset = pos;
        }
    }


    const indicators = document.createElement('ul'),
          dots = [];
          indicators.classList.add('carousel-indicators');
          slider.append(indicators);

    for (let i = 0; i < slide.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        dots.push(dot);
        indicators.append(dot);

        if (i == 0) {
            toggleActiveIndicator(dot);
        }
    }

    next.addEventListener('click', () => {
        if (slideIndex == slide.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        setCounter();

        if (offset == deteleNotDigits(width) * (slide.length - 1)) {
            offset = 0;
        } else {
            offset += deteleNotDigits(width);
        }

        slideInner.style.transform = `translateX(-${offset}px)`;
        toggleDots();
    });

    prev.addEventListener('click', () => {
        if (slideIndex == 1) {
            slideIndex = slide.length;
        } else {
            slideIndex--;
        }

        setCounter();

        if (offset == 0) {
            offset = deteleNotDigits(width) * (slide.length - 1);
        } else {
            offset -= deteleNotDigits(width);
        }

        slideInner.style.transform = `translateX(-${offset}px)`;
        toggleDots();
        savePosSlide(offset);
    });

    dots.forEach(item => {
        item.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            setCounter();
            offset = deteleNotDigits(width) * (slideTo - 1);

            slideInner.style.transform = `translateX(-${offset}px)`;
            toggleDots();
        });
    });


    // if (gender === 'female') {
    //     res.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    // } else {
    //     result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio); 
    // }

    // Calculator

   const result = document.querySelector('.calculating__result span');
   let gender = 'female', height, weight, age, ratio;

   if (localStorage.getItem('ratio')) {
       ratio = +localStorage.getItem('ratio');
   } else {
       ratio = +localStorage.setItem('ratio', 1.375);
   }
   if (localStorage.getItem('id')) {
       gender = localStorage.getItem('id');
   } else {
       gender = localStorage.setItem('id', 'female');
   }

   function calcResult() {
       if (!height || !weight || !age) {
           result.textContent = '';
           return;
       }
       if (gender === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio); 
        }
   }
   calcResult();

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('id') === localStorage.getItem('id')) {
                elem.classList.add(activeClass);
            }
        }); 
    }


   function getStaticInfo(selector, activeClass) {
       const elements = document.querySelectorAll(selector);

       elements.forEach(elem => {
           elem.addEventListener('click', (e) => {
               if (e.target.getAttribute('data-ratio')) {
                   ratio = +e.target.getAttribute('data-ratio');
                   localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
               } else {
                    gender = e.target.getAttribute('id');
                    localStorage.setItem('id', e.target.getAttribute('id'));
               }
               elements.forEach(item => {
                   item.classList.remove(activeClass);
               });
               e.target.classList.add(activeClass);
               calcResult();
           });
       });
   }

   function getDinamycInfo(selector) {
       const input = document.querySelector(selector);

       input.addEventListener('input', () => {
           switch (input.getAttribute('id')) {
                case 'height':
                   height = +input.value;
                   break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
           }
           calcResult();
       });
   }
   getDinamycInfo('#height');
   getDinamycInfo('#weight');
   getDinamycInfo('#age');

   getStaticInfo('#gender div', 'calculating__choose-item_active');
   getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');
   
   initLocalSettings('#gender div', 'calculating__choose-item_active');
   initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
});



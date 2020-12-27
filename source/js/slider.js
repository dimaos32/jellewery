'use strict';

(function () {
  var DESKTOP_MAX_SLIDER_WIDTH = 1200; // px
  var DESKTOP_MIN_SLIDER_WIDTH = 900; // px

  var DESKTOP_MAX_PRODUCTS_PER_SLIDE = 4;
  var DESKTOP_MIN_PRODUCTS_PER_SLIDE = 3;
  var PRODUCTS_PER_SLIDE = 2;

  var slidesQuantity = 3;
  var currentSlide = 0;

  var sliderFrame = document.querySelector('.slider__wrapper');
  var slider = sliderFrame.querySelector('.slider__list');
  var products = slider.querySelectorAll('.slider__list li');
  var previewSlideBtn = sliderFrame.querySelector('.slider__control-arrow--preview');
  var nextSlideBtn = sliderFrame.querySelector('.slider__control-arrow--next');
  var pagination = sliderFrame.querySelector('.slider__pagination');
  var paginationBtns = pagination.querySelectorAll('.slider__control-pagination');
  var currentPaginationBtn = pagination.querySelector('.slider__control-pagination--current');

  var productsPerFrame = function () {
    if (sliderFrame.offsetWidth === DESKTOP_MAX_SLIDER_WIDTH) {
      return DESKTOP_MAX_PRODUCTS_PER_SLIDE;
    } else if (sliderFrame.offsetWidth === DESKTOP_MIN_SLIDER_WIDTH) {
      return DESKTOP_MIN_PRODUCTS_PER_SLIDE;
    }

    return PRODUCTS_PER_SLIDE;
  };

  var renderPagination = function (Q) {
    var fragment = document.createDocumentFragment();

    pagination.innerHTML = '';

    for (var i = 0; i < Q; i++) {
      var pageElement = document.createElement('li');
      var pageBtn = document.createElement('button');
      pageBtn.textContent = i + 1;
      pageBtn.dataset.page = i;
      pageBtn.classList.add('slider__control-pagination');

      if (i === 0) {
        pageBtn.classList.add('slider__control-pagination--current');
      }

      pageElement.append(pageBtn);
      fragment.append(pageElement);
    }

    pagination.append(fragment);
    paginationBtns = pagination.querySelectorAll('.slider__control-pagination');
  };

  var renderSliderControls = function () {
    slidesQuantity = Math.ceil(products.length / productsPerFrame());

    slider.style.transform = 'translate(0px)';
    renderPagination(slidesQuantity);
  };

  var changeSlide = function (element) {
    var shift = sliderFrame.offsetWidth * element.dataset.page;

    currentPaginationBtn = pagination.querySelector('.slider__control-pagination--current');

    currentPaginationBtn.classList.remove('slider__control-pagination--current');
    element.classList.add('slider__control-pagination--current');

    slider.style.transform = 'translate(-' + shift + 'px)';
  };

  var onPaginationClick = function (evt) {
    var target = evt.target.closest('.slider__control-pagination');

    currentPaginationBtn = pagination.querySelector('.slider__control-pagination--current');

    if (target && target !== currentPaginationBtn) {
      currentSlide = target.dataset.page;
      changeSlide(target);
    }
  };

  renderSliderControls();

  window.addEventListener('resize', renderSliderControls);

  previewSlideBtn.addEventListener('click', function () {
    if (currentSlide === 0) {
      currentSlide = slidesQuantity;
    }

    currentSlide--;

    for (var i = 0; i < paginationBtns.length; i++) {
      if (paginationBtns[i].dataset.page === currentSlide + '') {
        var target = paginationBtns[i];
        break;
      }
    }

    changeSlide(target);
  });

  nextSlideBtn.addEventListener('click', function () {
    currentSlide++;

    if (currentSlide === slidesQuantity) {
      currentSlide = 0;
    }

    for (var i = 0; i < paginationBtns.length; i++) {
      if (paginationBtns[i].dataset.page === currentSlide + '') {
        var target = paginationBtns[i];
        break;
      }
    }

    changeSlide(target);
  });

  pagination.addEventListener('click', onPaginationClick);
})();

'use strict';

(function () {
  var SLIDER_WIDTH_ON_DESKTOP_MAX = 1200; // px
  var SLIDER_WIDTH_ON_DESKTOP_MIN = 900; // px
  var SLIDER_WIDTH_ON_MOBILE = 320; // px

  var PRODUCTS_PER_SLIDE_ON_DESKTOP_MAX = 4;
  var PRODUCTS_PER_SLIDE_ON_DESKTOP_MIN = 3;
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

  var getProductsPerFrame = function () {
    if (sliderFrame.offsetWidth === SLIDER_WIDTH_ON_DESKTOP_MAX) {
      return PRODUCTS_PER_SLIDE_ON_DESKTOP_MAX;
    } else if (sliderFrame.offsetWidth === SLIDER_WIDTH_ON_DESKTOP_MIN) {
      return PRODUCTS_PER_SLIDE_ON_DESKTOP_MIN;
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
    slidesQuantity = Math.ceil(products.length / getProductsPerFrame());
    slider.style.transform = 'translate(0px)';

    previewSlideBtn.classList.remove('slider__control-arrow--nojs');
    nextSlideBtn.classList.remove('slider__control-arrow--nojs');

    renderPagination(slidesQuantity);
  };

  var changeSlide = function (element) {
    var shift = sliderFrame.offsetWidth * element.dataset.page;

    currentPaginationBtn = pagination.querySelector('.slider__control-pagination--current');

    currentPaginationBtn.classList.remove('slider__control-pagination--current');
    element.classList.add('slider__control-pagination--current');

    slider.style.transform = 'translate(-' + shift + 'px)';
  };

  var getTargetPaginationBtn = function () {
    return Array.from(paginationBtns).find(function (item) {
      return (item.dataset.page === currentSlide + '');
    });
  };

  var onPreviewSlideBtnClick = function () {
    var target = getTargetPaginationBtn();

    if (currentSlide === 0) {
      currentSlide = slidesQuantity;
    }

    currentSlide--;

    changeSlide(target);
  };

  var onNextSlideBtnClick = function () {
    var target = getTargetPaginationBtn();

    currentSlide++;

    if (currentSlide === slidesQuantity) {
      currentSlide = 0;
    }

    changeSlide(target);
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

  previewSlideBtn.addEventListener('click', onPreviewSlideBtnClick);
  nextSlideBtn.addEventListener('click', onNextSlideBtnClick);
  pagination.addEventListener('click', onPaginationClick);
})();

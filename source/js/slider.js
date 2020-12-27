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

  var fingerDounX = null;

  var sliderFrame = document.querySelector('.slider__wrapper');
  var slider = sliderFrame.querySelector('.slider__list');
  var products = slider.querySelectorAll('.slider__list li');
  var previewSlideBtn = sliderFrame.querySelector('.slider__control-arrow--preview');
  var nextSlideBtn = sliderFrame.querySelector('.slider__control-arrow--next');
  var pagination = sliderFrame.querySelector('.slider__pagination');
  var paginationBtns = pagination.querySelectorAll('.slider__control-pagination');
  var currentPaginationBtn = pagination.querySelector('.slider__control-pagination--current');

  var currentSliderFrameWidth = sliderFrame.offsetWidth;

  var isMobile = currentSliderFrameWidth === SLIDER_WIDTH_ON_MOBILE;

  var getProductsPerFrame = function () {
    if (currentSliderFrameWidth === SLIDER_WIDTH_ON_DESKTOP_MAX) {
      return PRODUCTS_PER_SLIDE_ON_DESKTOP_MAX;
    } else if (currentSliderFrameWidth === SLIDER_WIDTH_ON_DESKTOP_MIN) {
      return PRODUCTS_PER_SLIDE_ON_DESKTOP_MIN;
    }

    return PRODUCTS_PER_SLIDE;
  };

  var renderPagination = function (Q) {
    var fragment = document.createDocumentFragment();

    if (isMobile) {
      var pagesElement = document.createElement('li');
      var currentPageElement = document.createElement('span');
      currentPageElement.textContent = currentSlide + 1;
      pagesElement.textContent = ' of ' + slidesQuantity;
      pagesElement.insertAdjacentElement('afterbegin', currentPageElement);
      fragment.append(pagesElement);
    } else {
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

      paginationBtns = pagination.querySelectorAll('.slider__control-pagination');
    }

    pagination.append(fragment);
  };

  var renderSliderControls = function () {
    slidesQuantity = Math.ceil(products.length / getProductsPerFrame());
    isMobile = currentSliderFrameWidth === SLIDER_WIDTH_ON_MOBILE;
    currentSlide = 0;
    slider.style.transform = 'translate(0px)';

    previewSlideBtn.classList.remove('slider__control-arrow--nojs');
    nextSlideBtn.classList.remove('slider__control-arrow--nojs');

    pagination.innerHTML = '';

    renderPagination(slidesQuantity);
  };

  var getTargetPaginationBtn = function () {
    return Array.from(paginationBtns).find(function (item) {
      return (item.dataset.page === currentSlide + '');
    });
  };

  var changeSlide = function () {
    var shift = currentSliderFrameWidth * currentSlide;

    if (isMobile) {
      var currentPaginationPage = pagination.querySelector('span');

      currentPaginationPage.textContent = currentSlide + 1;
    } else {
      paginationBtns = pagination.querySelectorAll('.slider__control-pagination');

      var target = getTargetPaginationBtn();

      currentPaginationBtn = pagination.querySelector('.slider__control-pagination--current');

      currentPaginationBtn.classList.remove('slider__control-pagination--current');
      target.classList.add('slider__control-pagination--current');
    }

    slider.style.transform = 'translate(-' + shift + 'px)';
  };

  var switchPreviewSlide = function () {
    paginationBtns = pagination.querySelectorAll('.slider__control-pagination');

    var target = getTargetPaginationBtn();

    if (currentSlide === 0) {
      currentSlide = slidesQuantity;
    }

    currentSlide--;

    changeSlide(target);
  };

  var switchNextSlide = function () {
    paginationBtns = pagination.querySelectorAll('.slider__control-pagination');

    var target = getTargetPaginationBtn();

    currentSlide++;

    if (currentSlide === slidesQuantity) {
      currentSlide = 0;
    }

    changeSlide(target);
  };

  var onWindowResize = function () {
    if (currentSliderFrameWidth !== sliderFrame.offsetWidth) {
      currentSliderFrameWidth = sliderFrame.offsetWidth;
      renderSliderControls();
    }
  };

  var onPreviewSlideBtnClick = function () {
    switchPreviewSlide();
  };

  var onNextSlideBtnClick = function () {
    switchNextSlide();
  };

  var onTouchStart = function (evt) {
    fingerDounX = evt.touches[0].clientX;
  };

  var onTouchMove = function (evt) {
    if (!fingerDounX) {
      return;
    }

    var fingerUpX = evt.touches[0].clientX;
    var swipeLengthX = fingerDounX - fingerUpX;

    if (swipeLengthX > 0) {
      switchPreviewSlide();
    } else {
      switchNextSlide();
    }

    fingerDounX = null;
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

  window.addEventListener('resize', onWindowResize);

  previewSlideBtn.addEventListener('click', onPreviewSlideBtnClick);
  nextSlideBtn.addEventListener('click', onNextSlideBtnClick);

  slider.addEventListener('touchstart', onTouchStart, false);
  slider.addEventListener('touchmove', onTouchMove, false);

  pagination.addEventListener('click', onPaginationClick);
})();

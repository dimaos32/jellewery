'use strict';

(function () {
  var HTML = document.querySelector('html');

  var openModal = function (modal) {
    if (document.body.offsetHeight > window.innerHeight) {
      document.body.dataset.scrollY = self.pageYOffset;
      document.body.style.top = document.body.dataset.scrollY * -1 + 'px';

      document.body.classList.add('page--block-scroll');
    }

    modal.classList.remove('modal--closed');
    modal.classList.add('modal--opened');
  };

  var closeModal = function (modal) {
    modal.classList.add('modal--closed');
    modal.classList.remove('modal--opened');

    if (document.body.offsetHeight > window.innerHeight) {
      document.body.classList.remove('page--block-scroll');

      document.body.style.top = 0;
      HTML.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.body.dataset.scrollY);
      HTML.style.scrollBehavior = 'smooth';
    }
  };

  window.utils = {
    openModal: openModal,
    closeModal: closeModal,
  };
})();

'use strict';

(function () {
  var header = document.querySelector('.header');
  var menuToggle = header.querySelector('.header__menu-toggle');
  var navigation = header.querySelector('.navigation');
  var loginLink = navigation.querySelector('.navigation__link--login');

  header.classList.add('header--menu-closed');
  menuToggle.classList.add('header__menu-toggle--closed');
  navigation.classList.add('navigation--closed');

  var closeMenu = function () {
    if (header.classList.contains('header--menu-opened')) {
      header.classList.remove('header--menu-opened');
      header.classList.add('header--menu-closed');
      menuToggle.classList.remove('header__menu-toggle--opened');
      menuToggle.classList.add('header__menu-toggle--closed');
      navigation.classList.remove('navigation--opened');
      navigation.classList.add('navigation--closed');

      header.removeEventListener('click', onNavigationClick);
      loginLink.removeEventListener('focusout', onLoginLinkFocusout);
      document.removeEventListener('keydown', onOpenMenuEscPress);
    }
  };

  var openMenu = function () {
    if (header.classList.contains('header--menu-closed')) {
      header.classList.add('header--menu-opened');
      header.classList.remove('header--menu-closed');
      menuToggle.classList.add('header__menu-toggle--opened');
      menuToggle.classList.remove('header__menu-toggle--closed');
      navigation.classList.add('navigation--opened');
      navigation.classList.remove('navigation--closed');

      header.addEventListener('click', onNavigationClick);
      loginLink.addEventListener('focusout', onLoginLinkFocusout);
      document.addEventListener('keydown', onOpenMenuEscPress);
    }
  };

  var onOpenMenuEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMenu();
    }
  };

  var onToggleMenuClick = function () {
    if (header.classList.contains('header--menu-opened')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  var onFocusCange = function () {
    if (!document.activeElement.closest('.header')) {
      menuToggle.focus();
    }

    document.removeEventListener('focusin', onFocusCange);
  };

  var onLoginLinkFocusout = function () {
    document.addEventListener('focusin', onFocusCange);
  };

  var onNavigationClick = function (evt) {
    if ((evt.target.closest('a[href]') || evt.target.closest('.header')) && evt.target !== menuToggle) {
      closeMenu();
    }
  };

  menuToggle.addEventListener('click', onToggleMenuClick);
})();

'use strict';

(function () {
  if (document.querySelector('.faq__questions')) {
    var questions = document.querySelector('.faq__questions');

    var onQuestionClick = function (evt) {
      var target = evt.target.closest('.faq__question');

      if (evt.target.closest('.faq__questions a')) {
        evt.preventDefault();

        target.classList.toggle('faq__question--opened');
        target.classList.toggle('faq__question--closed');
      }
    };

    questions.addEventListener('click', onQuestionClick);
  }
})();

'use strict';

(function () {
  if (document.querySelector('.slider__wrapper')) {
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
    var currentPaginationBtn = pagination.querySelector('.slider__control-pagination:disabled');

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
            pageBtn.disabled = true;
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
      var target;

      if (isMobile) {
        var currentPaginationPage = pagination.querySelector('span');

        currentPaginationPage.textContent = currentSlide + 1;
      } else {
        paginationBtns = pagination.querySelectorAll('.slider__control-pagination');

        target = getTargetPaginationBtn();

        currentPaginationBtn = pagination.querySelector('.slider__control-pagination:disabled');

        currentPaginationBtn.disabled = false;
        target.disabled = true;
      }

      slider.style.transform = 'translate(-' + shift + 'px)';
    };

    var switchPreviewSlide = function () {
      paginationBtns = pagination.querySelectorAll('.slider__control-pagination');

      if (currentSlide === 0) {
        currentSlide = slidesQuantity;
      }

      currentSlide--;

      changeSlide();
    };

    var switchNextSlide = function () {
      paginationBtns = pagination.querySelectorAll('.slider__control-pagination');

      currentSlide++;

      if (currentSlide === slidesQuantity) {
        currentSlide = 0;
      }

      changeSlide();
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

    var onSliderTouchStart = function (evt) {
      fingerDounX = evt.touches[0].clientX;
    };

    var onSliderTouchMove = function (evt) {
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

    var onSliderFocus = function (evt) {
      var target = evt.target.closest('.slider__list li');
      var targetPos = Array.from(products).indexOf(target);
      var targetSlide = Math.floor(targetPos / getProductsPerFrame());

      if (currentSlide !== targetSlide) {
        currentSlide = targetSlide;
        changeSlide();
        document.querySelector('.slider').append(sliderFrame);
        evt.target.focus();
      }
    };

    var onPaginationClick = function (evt) {
      var target = evt.target.closest('.slider__control-pagination');

      currentPaginationBtn = pagination.querySelector('.slider__control-pagination:disabled');

      if (target && target !== currentPaginationBtn) {
        currentSlide = target.dataset.page;
        changeSlide();
      }
    };

    renderSliderControls();

    window.addEventListener('resize', onWindowResize);

    previewSlideBtn.addEventListener('click', onPreviewSlideBtnClick);
    nextSlideBtn.addEventListener('click', onNextSlideBtnClick);

    slider.addEventListener('touchstart', onSliderTouchStart);
    slider.addEventListener('touchmove', onSliderTouchMove);

    slider.addEventListener('focusin', onSliderFocus);

    pagination.addEventListener('click', onPaginationClick);
  }
})();

'use strict';

(function () {
  if (document.querySelector('.catalog__filter')) {
    var catalogFilter = document.querySelector('.catalog__filter-overlay');
    var catalogFilterOpenBtn = document.querySelector('.catalog__filter-open-btn');
    var catalogFilterCloseBtn = document.querySelector('.catalog__filter-close-btn');
    var catalogFilterFirstActiveElement = document.querySelector('.catalog__filter legend');

    var onCatalogFilterClick = function (evt) {
      var target = evt.target.closest('.catalog__filter-fildset');

      if (evt.target.closest('.catalog__filter-fildset legend')) {
        evt.preventDefault();

        target.classList.toggle('catalog__filter-fildset--opened');
        target.classList.toggle('catalog__filter-fildset--closed');
      }

      if (evt.target === catalogFilter) {
        closeFilter();
      }
    };

    var onOpenFilterEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeFilter();
      }
    };

    var closeFilter = function () {
      catalogFilter.classList.remove('catalog__filter-overlay--opened');
      catalogFilter.classList.add('catalog__filter-overlay--closed');

      catalogFilterCloseBtn.removeEventListener('click', oncatalogFilterCloseBtnClick);
      document.removeEventListener('keydown', onOpenFilterEscPress);
    };

    var openFilter = function () {
      catalogFilter.classList.add('catalog__filter-overlay--opened');
      catalogFilter.classList.remove('catalog__filter-overlay--closed');

      catalogFilterCloseBtn.addEventListener('click', oncatalogFilterCloseBtnClick);
      catalogFilterFirstActiveElement.addEventListener('focusout', onCatalogFilterFirstActiveElementFocusout);
      catalogFilterCloseBtn.addEventListener('focusout', onCatalogFilterCloseBtnFocusout);
      document.addEventListener('keydown', onOpenFilterEscPress);
    };

    var oncatalogFilterOpenBtnClick = function (evt) {
      evt.preventDefault();

      openFilter();
    };

    var oncatalogFilterCloseBtnClick = function () {
      closeFilter();

      catalogFilterCloseBtn.removeEventListener('click', oncatalogFilterCloseBtnClick);
    };

    var onCatalogFilterFirstActiveElementFocusCange = function () {
      if (!document.activeElement.closest('.catalog__filter')) {
        catalogFilterCloseBtn.focus();
      }

      document.removeEventListener('focusin', onCatalogFilterFirstActiveElementFocusCange);
    };

    var onCatalogFilterCloseBtnFocusCange = function () {
      if (!document.activeElement.closest('.catalog__filter')) {
        catalogFilterFirstActiveElement.focus();
      }

      document.removeEventListener('focusin', onCatalogFilterCloseBtnFocusCange);
    };

    var onCatalogFilterFirstActiveElementFocusout = function () {
      document.addEventListener('focusin', onCatalogFilterFirstActiveElementFocusCange);
    };

    var onCatalogFilterCloseBtnFocusout = function () {
      document.addEventListener('focusin', onCatalogFilterCloseBtnFocusCange);
    };

    catalogFilter.addEventListener('click', onCatalogFilterClick);
    catalogFilterOpenBtn.addEventListener('click', oncatalogFilterOpenBtnClick);
  }
})();

'use strict';

(function () {
  if (document.querySelector('.modal--add-to-cart')) {
    var overlay = document.querySelector('.modal--add-to-cart');
    var closeBtn = overlay.querySelector('.modal__close-btn');
    var modalOpenBtn = document.querySelector('.product__add-to-cart-btn');

    var onModalOpenBtnClick = function (evt) {
      evt.preventDefault();

      window.utils.openModal(overlay);

      closeBtn.addEventListener('click', onModalCloseBtnClick);
      overlay.addEventListener('click', onOverlayClick);
      document.addEventListener('keydown', onOpenModalEscPress);
    };

    var onModalCloseBtnClick = function () {
      closeBtn.removeEventListener('click', onModalCloseBtnClick);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onOpenModalEscPress);

      window.utils.closeModal(overlay);
    };

    var onOverlayClick = function (evt) {
      if (evt.target === overlay) {
        closeBtn.removeEventListener('click', onModalCloseBtnClick);
        overlay.removeEventListener('click', onOverlayClick);
        document.removeEventListener('keydown', onOpenModalEscPress);

        window.utils.closeModal(overlay);
      }
    };

    var onOpenModalEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();

        closeBtn.removeEventListener('click', onModalCloseBtnClick);
        overlay.removeEventListener('click', onOverlayClick);
        document.removeEventListener('keydown', onOpenModalEscPress);

        window.utils.closeModal(overlay);
      }
    };

    modalOpenBtn.addEventListener('click', onModalOpenBtnClick);
  }
})();

'use strict';

(function () {
  if (document.querySelector('.modal--login')) {
    var overlay = document.querySelector('.modal--login');
    var closeBtn = document.querySelector('.modal__close-btn');
    var modalOpenBtnHeaderLink = document.querySelector('.header__login-link');
    var modalOpenBtnHeaderBtn = document.querySelector('.header__login-btn');
    var modalOpenBtnNav = document.querySelector('.navigation__link--login');

    var onModalOpenBtnClick = function (evt) {
      evt.preventDefault();

      window.utils.openModal(overlay);

      closeBtn.addEventListener('click', onModalCloseBtnClick);
      overlay.addEventListener('click', onOverlayClick);
      document.addEventListener('keydown', onOpenModalEscPress);
    };

    var onModalCloseBtnClick = function () {
      closeBtn.removeEventListener('click', onModalCloseBtnClick);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onOpenModalEscPress);

      window.utils.closeModal(overlay);
    };

    var onOverlayClick = function (evt) {
      if (evt.target === overlay) {
        closeBtn.removeEventListener('click', onModalCloseBtnClick);
        overlay.removeEventListener('click', onOverlayClick);
        document.removeEventListener('keydown', onOpenModalEscPress);

        window.utils.closeModal(overlay);
      }
    };

    var onOpenModalEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();

        closeBtn.removeEventListener('click', onModalCloseBtnClick);
        overlay.removeEventListener('click', onOverlayClick);
        document.removeEventListener('keydown', onOpenModalEscPress);

        window.utils.closeModal(overlay);
      }
    };

    modalOpenBtnHeaderLink.addEventListener('click', onModalOpenBtnClick);
    modalOpenBtnHeaderBtn.addEventListener('click', onModalOpenBtnClick);
    modalOpenBtnNav.addEventListener('click', onModalOpenBtnClick);
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLW1lbnUuanMiLCJmYXEuanMiLCJzbGlkZXIuanMiLCJjYXRhbG9nLWZpbHRlci5qcyIsImFkZC10by1jYXJ0LmpzIiwibG9naW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuICB2YXIgb3Blbk1vZGFsID0gZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuc2Nyb2xsWSA9IHNlbGYucGFnZVlPZmZzZXQ7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZICogLTEgKyAncHgnO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuICAgIH1cblxuICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLS1jbG9zZWQnKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC0tb3BlbmVkJyk7XG4gIH07XG5cbiAgdmFyIGNsb3NlTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC0tY2xvc2VkJyk7XG4gICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtLW9wZW5lZCcpO1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IDA7XG4gICAgICBIVE1MLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZKTtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnc21vb3RoJztcbiAgICB9XG4gIH07XG5cbiAgd2luZG93LnV0aWxzID0ge1xuICAgIG9wZW5Nb2RhbDogb3Blbk1vZGFsLFxuICAgIGNsb3NlTW9kYWw6IGNsb3NlTW9kYWwsXG4gIH07XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xuICB2YXIgbWVudVRvZ2dsZSA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tZW51LXRvZ2dsZScpO1xuICB2YXIgbmF2aWdhdGlvbiA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbicpO1xuICB2YXIgbG9naW5MaW5rID0gbmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbl9fbGluay0tbG9naW4nKTtcblxuICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLS1tZW51LWNsb3NlZCcpO1xuICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fbWVudS10b2dnbGUtLWNsb3NlZCcpO1xuICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuXG4gIHZhciBjbG9zZU1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ2hlYWRlci0tbWVudS1vcGVuZWQnKSkge1xuICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlci0tbWVudS1vcGVuZWQnKTtcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gICAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLW9wZW5lZCcpO1xuICAgICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnJlbW92ZSgnbmF2aWdhdGlvbi0tb3BlbmVkJyk7XG4gICAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuXG4gICAgICBoZWFkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk5hdmlnYXRpb25DbGljayk7XG4gICAgICBsb2dpbkxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBvbkxvZ2luTGlua0ZvY3Vzb3V0KTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5NZW51RXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ2hlYWRlci0tbWVudS1jbG9zZWQnKSkge1xuICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci0tbWVudS1vcGVuZWQnKTtcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gICAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fbWVudS10b2dnbGUtLW9wZW5lZCcpO1xuICAgICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGlvbi0tb3BlbmVkJyk7XG4gICAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuXG4gICAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk5hdmlnYXRpb25DbGljayk7XG4gICAgICBsb2dpbkxpbmsuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBvbkxvZ2luTGlua0ZvY3Vzb3V0KTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5NZW51RXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb25PcGVuTWVudUVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjbG9zZU1lbnUoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9uVG9nZ2xlTWVudUNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChoZWFkZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoZWFkZXItLW1lbnUtb3BlbmVkJykpIHtcbiAgICAgIGNsb3NlTWVudSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcGVuTWVudSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb25Gb2N1c0NhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5jbG9zZXN0KCcuaGVhZGVyJykpIHtcbiAgICAgIG1lbnVUb2dnbGUuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25Gb2N1c0NhbmdlKTtcbiAgfTtcblxuICB2YXIgb25Mb2dpbkxpbmtGb2N1c291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25Gb2N1c0NhbmdlKTtcbiAgfTtcblxuICB2YXIgb25OYXZpZ2F0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKChldnQudGFyZ2V0LmNsb3Nlc3QoJ2FbaHJlZl0nKSB8fCBldnQudGFyZ2V0LmNsb3Nlc3QoJy5oZWFkZXInKSkgJiYgZXZ0LnRhcmdldCAhPT0gbWVudVRvZ2dsZSkge1xuICAgICAgY2xvc2VNZW51KCk7XG4gICAgfVxuICB9O1xuXG4gIG1lbnVUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblRvZ2dsZU1lbnVDbGljayk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhcV9fcXVlc3Rpb25zJykpIHtcbiAgICB2YXIgcXVlc3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhcV9fcXVlc3Rpb25zJyk7XG5cbiAgICB2YXIgb25RdWVzdGlvbkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLmZhcV9fcXVlc3Rpb24nKTtcblxuICAgICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmZhcV9fcXVlc3Rpb25zIGEnKSkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnZmFxX19xdWVzdGlvbi0tb3BlbmVkJyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1jbG9zZWQnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcXVlc3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25RdWVzdGlvbkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3dyYXBwZXInKSkge1xuICAgIHZhciBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NQVggPSAxMjAwOyAvLyBweFxuICAgIHZhciBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NSU4gPSA5MDA7IC8vIHB4XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9NT0JJTEUgPSAzMjA7IC8vIHB4XG5cbiAgICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUFYID0gNDtcbiAgICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUlOID0gMztcbiAgICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFID0gMjtcblxuICAgIHZhciBzbGlkZXNRdWFudGl0eSA9IDM7XG4gICAgdmFyIGN1cnJlbnRTbGlkZSA9IDA7XG5cbiAgICB2YXIgZmluZ2VyRG91blggPSBudWxsO1xuXG4gICAgdmFyIHNsaWRlckZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fd3JhcHBlcicpO1xuICAgIHZhciBzbGlkZXIgPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19saXN0Jyk7XG4gICAgdmFyIHByb2R1Y3RzID0gc2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2xpc3QgbGknKTtcbiAgICB2YXIgcHJldmlld1NsaWRlQnRuID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1hcnJvdy0tcHJldmlldycpO1xuICAgIHZhciBuZXh0U2xpZGVCdG4gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLWFycm93LS1uZXh0Jyk7XG4gICAgdmFyIHBhZ2luYXRpb24gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19wYWdpbmF0aW9uJyk7XG4gICAgdmFyIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcbiAgICB2YXIgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbjpkaXNhYmxlZCcpO1xuXG4gICAgdmFyIGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGg7XG5cbiAgICB2YXIgaXNNb2JpbGUgPSBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX01PQklMRTtcblxuICAgIHZhciBnZXRQcm9kdWN0c1BlckZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NQVgpIHtcbiAgICAgICAgcmV0dXJuIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01BWDtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01JTikge1xuICAgICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUlOO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFO1xuICAgIH07XG5cbiAgICB2YXIgcmVuZGVyUGFnaW5hdGlvbiA9IGZ1bmN0aW9uIChRKSB7XG4gICAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICB2YXIgcGFnZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdmFyIGN1cnJlbnRQYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgY3VycmVudFBhZ2VFbGVtZW50LnRleHRDb250ZW50ID0gY3VycmVudFNsaWRlICsgMTtcbiAgICAgICAgcGFnZXNFbGVtZW50LnRleHRDb250ZW50ID0gJyBvZiAnICsgc2xpZGVzUXVhbnRpdHk7XG4gICAgICAgIHBhZ2VzRWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyYmVnaW4nLCBjdXJyZW50UGFnZUVsZW1lbnQpO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmQocGFnZXNFbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgUTsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICB2YXIgcGFnZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgIHBhZ2VCdG4udGV4dENvbnRlbnQgPSBpICsgMTtcbiAgICAgICAgICBwYWdlQnRuLmRhdGFzZXQucGFnZSA9IGk7XG4gICAgICAgICAgcGFnZUJ0bi5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIHBhZ2VCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhZ2VFbGVtZW50LmFwcGVuZChwYWdlQnRuKTtcbiAgICAgICAgICBmcmFnbWVudC5hcHBlbmQocGFnZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICAgICAgfVxuXG4gICAgICBwYWdpbmF0aW9uLmFwcGVuZChmcmFnbWVudCk7XG4gICAgfTtcblxuICAgIHZhciByZW5kZXJTbGlkZXJDb250cm9scyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNsaWRlc1F1YW50aXR5ID0gTWF0aC5jZWlsKHByb2R1Y3RzLmxlbmd0aCAvIGdldFByb2R1Y3RzUGVyRnJhbWUoKSk7XG4gICAgICBpc01vYmlsZSA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fTU9CSUxFO1xuICAgICAgY3VycmVudFNsaWRlID0gMDtcbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKDBweCknO1xuXG4gICAgICBwcmV2aWV3U2xpZGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLWFycm93LS1ub2pzJyk7XG4gICAgICBuZXh0U2xpZGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLWFycm93LS1ub2pzJyk7XG5cbiAgICAgIHBhZ2luYXRpb24uaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgIHJlbmRlclBhZ2luYXRpb24oc2xpZGVzUXVhbnRpdHkpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0VGFyZ2V0UGFnaW5hdGlvbkJ0biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHBhZ2luYXRpb25CdG5zKS5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAoaXRlbS5kYXRhc2V0LnBhZ2UgPT09IGN1cnJlbnRTbGlkZSArICcnKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgY2hhbmdlU2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2hpZnQgPSBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCAqIGN1cnJlbnRTbGlkZTtcbiAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICB2YXIgY3VycmVudFBhZ2luYXRpb25QYWdlID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25QYWdlLnRleHRDb250ZW50ID0gY3VycmVudFNsaWRlICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgICB0YXJnZXQgPSBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuKCk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbjpkaXNhYmxlZCcpO1xuXG4gICAgICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKC0nICsgc2hpZnQgKyAncHgpJztcbiAgICB9O1xuXG4gICAgdmFyIHN3aXRjaFByZXZpZXdTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgaWYgKGN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSBzbGlkZXNRdWFudGl0eTtcbiAgICAgIH1cblxuICAgICAgY3VycmVudFNsaWRlLS07XG5cbiAgICAgIGNoYW5nZVNsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBzd2l0Y2hOZXh0U2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgIGN1cnJlbnRTbGlkZSsrO1xuXG4gICAgICBpZiAoY3VycmVudFNsaWRlID09PSBzbGlkZXNRdWFudGl0eSkge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSAwO1xuICAgICAgfVxuXG4gICAgICBjaGFuZ2VTbGlkZSgpO1xuICAgIH07XG5cbiAgICB2YXIgb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggIT09IHNsaWRlckZyYW1lLm9mZnNldFdpZHRoKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGg7XG4gICAgICAgIHJlbmRlclNsaWRlckNvbnRyb2xzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvblByZXZpZXdTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc3dpdGNoUHJldmlld1NsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvbk5leHRTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc3dpdGNoTmV4dFNsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvblNsaWRlclRvdWNoU3RhcnQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBmaW5nZXJEb3VuWCA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgfTtcblxuICAgIHZhciBvblNsaWRlclRvdWNoTW92ZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmICghZmluZ2VyRG91blgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmluZ2VyVXBYID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgIHZhciBzd2lwZUxlbmd0aFggPSBmaW5nZXJEb3VuWCAtIGZpbmdlclVwWDtcblxuICAgICAgaWYgKHN3aXBlTGVuZ3RoWCA+IDApIHtcbiAgICAgICAgc3dpdGNoUHJldmlld1NsaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2hOZXh0U2xpZGUoKTtcbiAgICAgIH1cblxuICAgICAgZmluZ2VyRG91blggPSBudWxsO1xuICAgIH07XG5cbiAgICB2YXIgb25TbGlkZXJGb2N1cyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5zbGlkZXJfX2xpc3QgbGknKTtcbiAgICAgIHZhciB0YXJnZXRQb3MgPSBBcnJheS5mcm9tKHByb2R1Y3RzKS5pbmRleE9mKHRhcmdldCk7XG4gICAgICB2YXIgdGFyZ2V0U2xpZGUgPSBNYXRoLmZsb29yKHRhcmdldFBvcyAvIGdldFByb2R1Y3RzUGVyRnJhbWUoKSk7XG5cbiAgICAgIGlmIChjdXJyZW50U2xpZGUgIT09IHRhcmdldFNsaWRlKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IHRhcmdldFNsaWRlO1xuICAgICAgICBjaGFuZ2VTbGlkZSgpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJykuYXBwZW5kKHNsaWRlckZyYW1lKTtcbiAgICAgICAgZXZ0LnRhcmdldC5mb2N1cygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25QYWdpbmF0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbjpkaXNhYmxlZCcpO1xuXG4gICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gY3VycmVudFBhZ2luYXRpb25CdG4pIHtcbiAgICAgICAgY3VycmVudFNsaWRlID0gdGFyZ2V0LmRhdGFzZXQucGFnZTtcbiAgICAgICAgY2hhbmdlU2xpZGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVuZGVyU2xpZGVyQ29udHJvbHMoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG5cbiAgICBwcmV2aWV3U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblByZXZpZXdTbGlkZUJ0bkNsaWNrKTtcbiAgICBuZXh0U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk5leHRTbGlkZUJ0bkNsaWNrKTtcblxuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25TbGlkZXJUb3VjaFN0YXJ0KTtcbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25TbGlkZXJUb3VjaE1vdmUpO1xuXG4gICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBvblNsaWRlckZvY3VzKTtcblxuICAgIHBhZ2luYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblBhZ2luYXRpb25DbGljayk7XG4gIH1cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fZmlsdGVyJykpIHtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXItb3ZlcmxheScpO1xuICAgIHZhciBjYXRhbG9nRmlsdGVyT3BlbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXItb3Blbi1idG4nKTtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlci1jbG9zZS1idG4nKTtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXIgbGVnZW5kJyk7XG5cbiAgICB2YXIgb25DYXRhbG9nRmlsdGVyQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2F0YWxvZ19fZmlsdGVyLWZpbGRzZXQnKTtcblxuICAgICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlci1maWxkc2V0IGxlZ2VuZCcpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tb3BlbmVkJyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBjYXRhbG9nRmlsdGVyKSB7XG4gICAgICAgIGNsb3NlRmlsdGVyKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbk9wZW5GaWx0ZXJFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xvc2VGaWx0ZXIoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNsb3NlRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2F0YWxvZ0ZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdjYXRhbG9nX19maWx0ZXItb3ZlcmxheS0tb3BlbmVkJyk7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1jbG9zZWQnKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyQ2xvc2VCdG5DbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuRmlsdGVyRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB2YXIgb3BlbkZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhdGFsb2dGaWx0ZXIuY2xhc3NMaXN0LmFkZCgnY2F0YWxvZ19fZmlsdGVyLW92ZXJsYXktLW9wZW5lZCcpO1xuICAgICAgY2F0YWxvZ0ZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdjYXRhbG9nX19maWx0ZXItb3ZlcmxheS0tY2xvc2VkJyk7XG5cbiAgICAgIGNhdGFsb2dGaWx0ZXJDbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uY2F0YWxvZ0ZpbHRlckNsb3NlQnRuQ2xpY2spO1xuICAgICAgY2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIG9uQ2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudEZvY3Vzb3V0KTtcbiAgICAgIGNhdGFsb2dGaWx0ZXJDbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNvdXQpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3BlbkZpbHRlckVzY1ByZXNzKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uY2F0YWxvZ0ZpbHRlck9wZW5CdG5DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBvcGVuRmlsdGVyKCk7XG4gICAgfTtcblxuICAgIHZhciBvbmNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2xvc2VGaWx0ZXIoKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyQ2xvc2VCdG5DbGljayk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnRGb2N1c0NhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNsb3Nlc3QoJy5jYXRhbG9nX19maWx0ZXInKSkge1xuICAgICAgICBjYXRhbG9nRmlsdGVyQ2xvc2VCdG4uZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uQ2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudEZvY3VzQ2FuZ2UpO1xuICAgIH07XG5cbiAgICB2YXIgb25DYXRhbG9nRmlsdGVyQ2xvc2VCdG5Gb2N1c0NhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNsb3Nlc3QoJy5jYXRhbG9nX19maWx0ZXInKSkge1xuICAgICAgICBjYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBvbkNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkZvY3VzQ2FuZ2UpO1xuICAgIH07XG5cbiAgICB2YXIgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkZvY3Vzb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIGNhdGFsb2dGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNhdGFsb2dGaWx0ZXJDbGljayk7XG4gICAgY2F0YWxvZ0ZpbHRlck9wZW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNhdGFsb2dGaWx0ZXJPcGVuQnRuQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1hZGQtdG8tY2FydCcpKSB7XG4gICAgdmFyIG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWFkZC10by1jYXJ0Jyk7XG4gICAgdmFyIGNsb3NlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Nsb3NlLWJ0bicpO1xuICAgIHZhciBtb2RhbE9wZW5CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdF9fYWRkLXRvLWNhcnQtYnRuJyk7XG5cbiAgICB2YXIgb25Nb2RhbE9wZW5CdG5DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB3aW5kb3cudXRpbHMub3Blbk1vZGFsKG92ZXJsYXkpO1xuXG4gICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfTtcblxuICAgIHZhciBvbk1vZGFsQ2xvc2VCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcblxuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgfTtcblxuICAgIHZhciBvbk92ZXJsYXlDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBvdmVybGF5KSB7XG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbk9wZW5Nb2RhbEVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG1vZGFsT3BlbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxPcGVuQnRuQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1sb2dpbicpKSB7XG4gICAgdmFyIG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWxvZ2luJyk7XG4gICAgdmFyIGNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19jbG9zZS1idG4nKTtcbiAgICB2YXIgbW9kYWxPcGVuQnRuSGVhZGVyTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2xvZ2luLWxpbmsnKTtcbiAgICB2YXIgbW9kYWxPcGVuQnRuSGVhZGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbG9naW4tYnRuJyk7XG4gICAgdmFyIG1vZGFsT3BlbkJ0bk5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uX19saW5rLS1sb2dpbicpO1xuXG4gICAgdmFyIG9uTW9kYWxPcGVuQnRuQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgd2luZG93LnV0aWxzLm9wZW5Nb2RhbChvdmVybGF5KTtcblxuICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB2YXIgb25Nb2RhbENsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG92ZXJsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgIH07XG5cbiAgICB2YXIgb25PdmVybGF5Q2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnRhcmdldCA9PT0gb3ZlcmxheSkge1xuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25PcGVuTW9kYWxFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBtb2RhbE9wZW5CdG5IZWFkZXJMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbE9wZW5CdG5DbGljayk7XG4gICAgbW9kYWxPcGVuQnRuSGVhZGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbE9wZW5CdG5DbGljayk7XG4gICAgbW9kYWxPcGVuQnRuTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbE9wZW5CdG5DbGljayk7XG4gIH1cbn0pKCk7XG4iXX0=

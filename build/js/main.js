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
    var closeBtn = overlay.querySelector('.modal__close-btn');
    var loginForm = overlay.querySelector('.login__form');
    var userEmail = overlay.querySelector('#email');
    var userPassword = overlay.querySelector('#password');
    var modalOpenBtnHeaderLink = document.querySelector('.header__login-link');
    var modalOpenBtnHeaderBtn = document.querySelector('.header__login-btn');
    var modalOpenBtnNav = document.querySelector('.navigation__link--login');

    var isStorageSupport = true;
    var storage = '';

    var onLoginFormSubmit = function () {
      var email = overlay.querySelector('#email');

      if (isStorageSupport) {
        localStorage.setItem('email', email.value);
      }
    };

    var onModalOpenBtnClick = function (evt) {
      evt.preventDefault();

      window.utils.openModal(overlay);

      if (userEmail.value) {
        userPassword.focus();
      } else {
        userEmail.focus();
      }

      closeBtn.addEventListener('click', onModalCloseBtnClick);
      overlay.addEventListener('click', onOverlayClick);
      loginForm.addEventListener('submit', onLoginFormSubmit);
      document.addEventListener('keydown', onOpenModalEscPress);
    };

    var onModalCloseBtnClick = function () {
      closeBtn.removeEventListener('click', onModalCloseBtnClick);
      overlay.removeEventListener('click', onOverlayClick);
      loginForm.removeEventListener('submit', onLoginFormSubmit);
      document.removeEventListener('keydown', onOpenModalEscPress);

      window.utils.closeModal(overlay);
    };

    var onOverlayClick = function (evt) {
      if (evt.target === overlay) {
        closeBtn.removeEventListener('click', onModalCloseBtnClick);
        overlay.removeEventListener('click', onOverlayClick);
        loginForm.removeEventListener('submit', onLoginFormSubmit);
        document.removeEventListener('keydown', onOpenModalEscPress);

        window.utils.closeModal(overlay);
      }
    };

    var onOpenModalEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();

        closeBtn.removeEventListener('click', onModalCloseBtnClick);
        overlay.removeEventListener('click', onOverlayClick);
        loginForm.removeEventListener('submit', onLoginFormSubmit);
        document.removeEventListener('keydown', onOpenModalEscPress);

        window.utils.closeModal(overlay);
      }
    };

    try {
      storage = localStorage.getItem('email');
    } catch (err) {
      isStorageSupport = false;
    }

    if (storage) {
      userEmail.value = localStorage.getItem('email');
    }

    modalOpenBtnHeaderLink.addEventListener('click', onModalOpenBtnClick);
    modalOpenBtnHeaderBtn.addEventListener('click', onModalOpenBtnClick);
    modalOpenBtnNav.addEventListener('click', onModalOpenBtnClick);
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLW1lbnUuanMiLCJmYXEuanMiLCJzbGlkZXIuanMiLCJjYXRhbG9nLWZpbHRlci5qcyIsImFkZC10by1jYXJ0LmpzIiwibG9naW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG4gIHZhciBvcGVuTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZID0gc2VsZi5wYWdlWU9mZnNldDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkgKiAtMSArICdweCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG4gICAgfVxuXG4gICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtLWNsb3NlZCcpO1xuICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ21vZGFsLS1vcGVuZWQnKTtcbiAgfTtcblxuICB2YXIgY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChtb2RhbCkge1xuICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ21vZGFsLS1jbG9zZWQnKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC0tb3BlbmVkJyk7XG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gMDtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnYXV0byc7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkpO1xuICAgICAgSFRNTC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICdzbW9vdGgnO1xuICAgIH1cbiAgfTtcblxuICB3aW5kb3cudXRpbHMgPSB7XG4gICAgb3Blbk1vZGFsOiBvcGVuTW9kYWwsXG4gICAgY2xvc2VNb2RhbDogY2xvc2VNb2RhbCxcbiAgfTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XG4gIHZhciBtZW51VG9nZ2xlID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21lbnUtdG9nZ2xlJyk7XG4gIHZhciBuYXZpZ2F0aW9uID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uJyk7XG4gIHZhciBsb2dpbkxpbmsgPSBuYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uX19saW5rLS1sb2dpbicpO1xuXG4gIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gIG1lbnVUb2dnbGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gIG5hdmlnYXRpb24uY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG5cbiAgdmFyIGNsb3NlTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLS1tZW51LW9wZW5lZCcpKSB7XG4gICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyLS1tZW51LW9wZW5lZCcpO1xuICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci0tbWVudS1jbG9zZWQnKTtcbiAgICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX19tZW51LXRvZ2dsZS0tb3BlbmVkJyk7XG4gICAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fbWVudS10b2dnbGUtLWNsb3NlZCcpO1xuICAgICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCduYXZpZ2F0aW9uLS1vcGVuZWQnKTtcbiAgICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG5cbiAgICAgIGhlYWRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTmF2aWdhdGlvbkNsaWNrKTtcbiAgICAgIGxvZ2luTGluay5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIG9uTG9naW5MaW5rRm9jdXNvdXQpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1lbnVFc2NQcmVzcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLS1tZW51LWNsb3NlZCcpKSB7XG4gICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLS1tZW51LW9wZW5lZCcpO1xuICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlci0tbWVudS1jbG9zZWQnKTtcbiAgICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19tZW51LXRvZ2dsZS0tb3BlbmVkJyk7XG4gICAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLWNsb3NlZCcpO1xuICAgICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QuYWRkKCduYXZpZ2F0aW9uLS1vcGVuZWQnKTtcbiAgICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnJlbW92ZSgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG5cbiAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTmF2aWdhdGlvbkNsaWNrKTtcbiAgICAgIGxvZ2luTGluay5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIG9uTG9naW5MaW5rRm9jdXNvdXQpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1lbnVFc2NQcmVzcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvbk9wZW5NZW51RXNjUHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNsb3NlTWVudSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb25Ub2dnbGVNZW51Q2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ2hlYWRlci0tbWVudS1vcGVuZWQnKSkge1xuICAgICAgY2xvc2VNZW51KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wZW5NZW51KCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvbkZvY3VzQ2FuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNsb3Nlc3QoJy5oZWFkZXInKSkge1xuICAgICAgbWVudVRvZ2dsZS5mb2N1cygpO1xuICAgIH1cblxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBvbkZvY3VzQ2FuZ2UpO1xuICB9O1xuXG4gIHZhciBvbkxvZ2luTGlua0ZvY3Vzb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBvbkZvY3VzQ2FuZ2UpO1xuICB9O1xuXG4gIHZhciBvbk5hdmlnYXRpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoKGV2dC50YXJnZXQuY2xvc2VzdCgnYVtocmVmXScpIHx8IGV2dC50YXJnZXQuY2xvc2VzdCgnLmhlYWRlcicpKSAmJiBldnQudGFyZ2V0ICE9PSBtZW51VG9nZ2xlKSB7XG4gICAgICBjbG9zZU1lbnUoKTtcbiAgICB9XG4gIH07XG5cbiAgbWVudVRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVG9nZ2xlTWVudUNsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmFxX19xdWVzdGlvbnMnKSkge1xuICAgIHZhciBxdWVzdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmFxX19xdWVzdGlvbnMnKTtcblxuICAgIHZhciBvblF1ZXN0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmFxX19xdWVzdGlvbicpO1xuXG4gICAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmFxX19xdWVzdGlvbnMgYScpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1vcGVuZWQnKTtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhcV9fcXVlc3Rpb24tLWNsb3NlZCcpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBxdWVzdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblF1ZXN0aW9uQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fd3JhcHBlcicpKSB7XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01BWCA9IDEyMDA7IC8vIHB4XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01JTiA9IDkwMDsgLy8gcHhcbiAgICB2YXIgU0xJREVSX1dJRFRIX09OX01PQklMRSA9IDMyMDsgLy8gcHhcblxuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NQVggPSA0O1xuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NSU4gPSAzO1xuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREUgPSAyO1xuXG4gICAgdmFyIHNsaWRlc1F1YW50aXR5ID0gMztcbiAgICB2YXIgY3VycmVudFNsaWRlID0gMDtcblxuICAgIHZhciBmaW5nZXJEb3VuWCA9IG51bGw7XG5cbiAgICB2YXIgc2xpZGVyRnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX193cmFwcGVyJyk7XG4gICAgdmFyIHNsaWRlciA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2xpc3QnKTtcbiAgICB2YXIgcHJvZHVjdHMgPSBzbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fbGlzdCBsaScpO1xuICAgIHZhciBwcmV2aWV3U2xpZGVCdG4gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLWFycm93LS1wcmV2aWV3Jyk7XG4gICAgdmFyIG5leHRTbGlkZUJ0biA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5leHQnKTtcbiAgICB2YXIgcGFnaW5hdGlvbiA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3BhZ2luYXRpb24nKTtcbiAgICB2YXIgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICAgIHZhciBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uOmRpc2FibGVkJyk7XG5cbiAgICB2YXIgY3VycmVudFNsaWRlckZyYW1lV2lkdGggPSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aDtcblxuICAgIHZhciBpc01vYmlsZSA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fTU9CSUxFO1xuXG4gICAgdmFyIGdldFByb2R1Y3RzUGVyRnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01BWCkge1xuICAgICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUFYO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUlOKSB7XG4gICAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NSU47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREU7XG4gICAgfTtcblxuICAgIHZhciByZW5kZXJQYWdpbmF0aW9uID0gZnVuY3Rpb24gKFEpIHtcbiAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBwYWdlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgY3VycmVudFBhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBjdXJyZW50UGFnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUgKyAxO1xuICAgICAgICBwYWdlc0VsZW1lbnQudGV4dENvbnRlbnQgPSAnIG9mICcgKyBzbGlkZXNRdWFudGl0eTtcbiAgICAgICAgcGFnZXNFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIGN1cnJlbnRQYWdlRWxlbWVudCk7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlc0VsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBROyBpKyspIHtcbiAgICAgICAgICB2YXIgcGFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgIHZhciBwYWdlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgcGFnZUJ0bi50ZXh0Q29udGVudCA9IGkgKyAxO1xuICAgICAgICAgIHBhZ2VCdG4uZGF0YXNldC5wYWdlID0gaTtcbiAgICAgICAgICBwYWdlQnRuLmNsYXNzTGlzdC5hZGQoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgcGFnZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGFnZUVsZW1lbnQuYXBwZW5kKHBhZ2VCdG4pO1xuICAgICAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIHBhZ2luYXRpb24uYXBwZW5kKGZyYWdtZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIHJlbmRlclNsaWRlckNvbnRyb2xzID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2xpZGVzUXVhbnRpdHkgPSBNYXRoLmNlaWwocHJvZHVjdHMubGVuZ3RoIC8gZ2V0UHJvZHVjdHNQZXJGcmFtZSgpKTtcbiAgICAgIGlzTW9iaWxlID0gY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9NT0JJTEU7XG4gICAgICBjdXJyZW50U2xpZGUgPSAwO1xuICAgICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoMHB4KSc7XG5cbiAgICAgIHByZXZpZXdTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcbiAgICAgIG5leHRTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcblxuICAgICAgcGFnaW5hdGlvbi5pbm5lckhUTUwgPSAnJztcblxuICAgICAgcmVuZGVyUGFnaW5hdGlvbihzbGlkZXNRdWFudGl0eSk7XG4gICAgfTtcblxuICAgIHZhciBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocGFnaW5hdGlvbkJ0bnMpLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIChpdGVtLmRhdGFzZXQucGFnZSA9PT0gY3VycmVudFNsaWRlICsgJycpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBjaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaGlmdCA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoICogY3VycmVudFNsaWRlO1xuICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBjdXJyZW50UGFnaW5hdGlvblBhZ2UgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcblxuICAgICAgICBjdXJyZW50UGFnaW5hdGlvblBhZ2UudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICAgIHRhcmdldCA9IGdldFRhcmdldFBhZ2luYXRpb25CdG4oKTtcblxuICAgICAgICBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uOmRpc2FibGVkJyk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGFyZ2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLScgKyBzaGlmdCArICdweCknO1xuICAgIH07XG5cbiAgICB2YXIgc3dpdGNoUHJldmlld1NsaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICBpZiAoY3VycmVudFNsaWRlID09PSAwKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IHNsaWRlc1F1YW50aXR5O1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50U2xpZGUtLTtcblxuICAgICAgY2hhbmdlU2xpZGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIHN3aXRjaE5leHRTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgY3VycmVudFNsaWRlKys7XG5cbiAgICAgIGlmIChjdXJyZW50U2xpZGUgPT09IHNsaWRlc1F1YW50aXR5KSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGNoYW5nZVNsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCAhPT0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGgpIHtcbiAgICAgICAgY3VycmVudFNsaWRlckZyYW1lV2lkdGggPSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aDtcbiAgICAgICAgcmVuZGVyU2xpZGVyQ29udHJvbHMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uUHJldmlld1NsaWRlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzd2l0Y2hQcmV2aWV3U2xpZGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uTmV4dFNsaWRlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzd2l0Y2hOZXh0U2xpZGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uU2xpZGVyVG91Y2hTdGFydCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGZpbmdlckRvdW5YID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICB9O1xuXG4gICAgdmFyIG9uU2xpZGVyVG91Y2hNb3ZlID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKCFmaW5nZXJEb3VuWCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBmaW5nZXJVcFggPSBldnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgdmFyIHN3aXBlTGVuZ3RoWCA9IGZpbmdlckRvdW5YIC0gZmluZ2VyVXBYO1xuXG4gICAgICBpZiAoc3dpcGVMZW5ndGhYID4gMCkge1xuICAgICAgICBzd2l0Y2hQcmV2aWV3U2xpZGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaE5leHRTbGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBmaW5nZXJEb3VuWCA9IG51bGw7XG4gICAgfTtcblxuICAgIHZhciBvblNsaWRlckZvY3VzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLnNsaWRlcl9fbGlzdCBsaScpO1xuICAgICAgdmFyIHRhcmdldFBvcyA9IEFycmF5LmZyb20ocHJvZHVjdHMpLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgIHZhciB0YXJnZXRTbGlkZSA9IE1hdGguZmxvb3IodGFyZ2V0UG9zIC8gZ2V0UHJvZHVjdHNQZXJGcmFtZSgpKTtcblxuICAgICAgaWYgKGN1cnJlbnRTbGlkZSAhPT0gdGFyZ2V0U2xpZGUpIHtcbiAgICAgICAgY3VycmVudFNsaWRlID0gdGFyZ2V0U2xpZGU7XG4gICAgICAgIGNoYW5nZVNsaWRlKCk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXInKS5hcHBlbmQoc2xpZGVyRnJhbWUpO1xuICAgICAgICBldnQudGFyZ2V0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvblBhZ2luYXRpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uOmRpc2FibGVkJyk7XG5cbiAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSBjdXJyZW50UGFnaW5hdGlvbkJ0bikge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSB0YXJnZXQuZGF0YXNldC5wYWdlO1xuICAgICAgICBjaGFuZ2VTbGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZW5kZXJTbGlkZXJDb250cm9scygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcblxuICAgIHByZXZpZXdTbGlkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUHJldmlld1NsaWRlQnRuQ2xpY2spO1xuICAgIG5leHRTbGlkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTmV4dFNsaWRlQnRuQ2xpY2spO1xuXG4gICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblNsaWRlclRvdWNoU3RhcnQpO1xuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblNsaWRlclRvdWNoTW92ZSk7XG5cbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uU2xpZGVyRm9jdXMpO1xuXG4gICAgcGFnaW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUGFnaW5hdGlvbkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXInKSkge1xuICAgIHZhciBjYXRhbG9nRmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlci1vdmVybGF5Jyk7XG4gICAgdmFyIGNhdGFsb2dGaWx0ZXJPcGVuQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlci1vcGVuLWJ0bicpO1xuICAgIHZhciBjYXRhbG9nRmlsdGVyQ2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fZmlsdGVyLWNsb3NlLWJ0bicpO1xuICAgIHZhciBjYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlciBsZWdlbmQnKTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5jYXRhbG9nX19maWx0ZXItZmlsZHNldCcpO1xuXG4gICAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2F0YWxvZ19fZmlsdGVyLWZpbGRzZXQgbGVnZW5kJykpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2NhdGFsb2dfX2ZpbHRlci1maWxkc2V0LS1vcGVuZWQnKTtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2NhdGFsb2dfX2ZpbHRlci1maWxkc2V0LS1jbG9zZWQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC50YXJnZXQgPT09IGNhdGFsb2dGaWx0ZXIpIHtcbiAgICAgICAgY2xvc2VGaWx0ZXIoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uT3BlbkZpbHRlckVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjbG9zZUZpbHRlcigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgY2xvc2VGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1vcGVuZWQnKTtcbiAgICAgIGNhdGFsb2dGaWx0ZXIuY2xhc3NMaXN0LmFkZCgnY2F0YWxvZ19fZmlsdGVyLW92ZXJsYXktLWNsb3NlZCcpO1xuXG4gICAgICBjYXRhbG9nRmlsdGVyQ2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5GaWx0ZXJFc2NQcmVzcyk7XG4gICAgfTtcblxuICAgIHZhciBvcGVuRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2F0YWxvZ0ZpbHRlci5jbGFzc0xpc3QuYWRkKCdjYXRhbG9nX19maWx0ZXItb3ZlcmxheS0tb3BlbmVkJyk7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1jbG9zZWQnKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyQ2xvc2VCdG5DbGljayk7XG4gICAgICBjYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNvdXQpO1xuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25DYXRhbG9nRmlsdGVyQ2xvc2VCdG5Gb2N1c291dCk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuRmlsdGVyRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB2YXIgb25jYXRhbG9nRmlsdGVyT3BlbkJ0bkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIG9wZW5GaWx0ZXIoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uY2F0YWxvZ0ZpbHRlckNsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUZpbHRlcigpO1xuXG4gICAgICBjYXRhbG9nRmlsdGVyQ2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkNsaWNrKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uQ2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudEZvY3VzQ2FuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgICAgIGNhdGFsb2dGaWx0ZXJDbG9zZUJ0bi5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkZvY3VzQ2FuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgICAgIGNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnRGb2N1c291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBvbkNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnRGb2N1c0NhbmdlKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25DYXRhbG9nRmlsdGVyQ2xvc2VCdG5Gb2N1c0NhbmdlKTtcbiAgICB9O1xuXG4gICAgY2F0YWxvZ0ZpbHRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2F0YWxvZ0ZpbHRlckNsaWNrKTtcbiAgICBjYXRhbG9nRmlsdGVyT3BlbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uY2F0YWxvZ0ZpbHRlck9wZW5CdG5DbGljayk7XG4gIH1cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWFkZC10by1jYXJ0JykpIHtcbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tYWRkLXRvLWNhcnQnKTtcbiAgICB2YXIgY2xvc2VCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UtYnRuJyk7XG4gICAgdmFyIG1vZGFsT3BlbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0X19hZGQtdG8tY2FydC1idG4nKTtcblxuICAgIHZhciBvbk1vZGFsT3BlbkJ0bkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHdpbmRvdy51dGlscy5vcGVuTW9kYWwob3ZlcmxheSk7XG5cbiAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uTW9kYWxDbG9zZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChvdmVybGF5KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uT3ZlcmxheUNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC50YXJnZXQgPT09IG92ZXJsYXkpIHtcbiAgICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICAgIG92ZXJsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcblxuICAgICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChvdmVybGF5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uT3Blbk1vZGFsRXNjUHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICAgIG92ZXJsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcblxuICAgICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChvdmVybGF5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kYWxPcGVuQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbE9wZW5CdG5DbGljayk7XG4gIH1cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWxvZ2luJykpIHtcbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tbG9naW4nKTtcbiAgICB2YXIgY2xvc2VCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UtYnRuJyk7XG4gICAgdmFyIGxvZ2luRm9ybSA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignLmxvZ2luX19mb3JtJyk7XG4gICAgdmFyIHVzZXJFbWFpbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignI2VtYWlsJyk7XG4gICAgdmFyIHVzZXJQYXNzd29yZCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignI3Bhc3N3b3JkJyk7XG4gICAgdmFyIG1vZGFsT3BlbkJ0bkhlYWRlckxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19sb2dpbi1saW5rJyk7XG4gICAgdmFyIG1vZGFsT3BlbkJ0bkhlYWRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2xvZ2luLWJ0bicpO1xuICAgIHZhciBtb2RhbE9wZW5CdG5OYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbl9fbGluay0tbG9naW4nKTtcblxuICAgIHZhciBpc1N0b3JhZ2VTdXBwb3J0ID0gdHJ1ZTtcbiAgICB2YXIgc3RvcmFnZSA9ICcnO1xuXG4gICAgdmFyIG9uTG9naW5Gb3JtU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVtYWlsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcjZW1haWwnKTtcblxuICAgICAgaWYgKGlzU3RvcmFnZVN1cHBvcnQpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2VtYWlsJywgZW1haWwudmFsdWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25Nb2RhbE9wZW5CdG5DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB3aW5kb3cudXRpbHMub3Blbk1vZGFsKG92ZXJsYXkpO1xuXG4gICAgICBpZiAodXNlckVtYWlsLnZhbHVlKSB7XG4gICAgICAgIHVzZXJQYXNzd29yZC5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlckVtYWlsLmZvY3VzKCk7XG4gICAgICB9XG5cbiAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgIGxvZ2luRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvbkxvZ2luRm9ybVN1Ym1pdCk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfTtcblxuICAgIHZhciBvbk1vZGFsQ2xvc2VCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgIGxvZ2luRm9ybS5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvbkxvZ2luRm9ybVN1Ym1pdCk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgIH07XG5cbiAgICB2YXIgb25PdmVybGF5Q2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnRhcmdldCA9PT0gb3ZlcmxheSkge1xuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgICAgbG9naW5Gb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG9uTG9naW5Gb3JtU3VibWl0KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25PcGVuTW9kYWxFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgICAgbG9naW5Gb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG9uTG9naW5Gb3JtU3VibWl0KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgc3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlbWFpbCcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaXNTdG9yYWdlU3VwcG9ydCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzdG9yYWdlKSB7XG4gICAgICB1c2VyRW1haWwudmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZW1haWwnKTtcbiAgICB9XG5cbiAgICBtb2RhbE9wZW5CdG5IZWFkZXJMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbE9wZW5CdG5DbGljayk7XG4gICAgbW9kYWxPcGVuQnRuSGVhZGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbE9wZW5CdG5DbGljayk7XG4gICAgbW9kYWxPcGVuQnRuTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbE9wZW5CdG5DbGljayk7XG4gIH1cbn0pKCk7XG4iXX0=

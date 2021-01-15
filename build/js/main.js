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
    'openModal': openModal,
    'closeModal': closeModal,
  };
})();

'use strict';

(function () {
  var page = document.querySelector('.page');
  var header = page.querySelector('.header');
  var menuToggle = header.querySelector('.header__menu-toggle');
  var navigation = header.querySelector('.navigation');
  var loginLink = navigation.querySelector('.navigation__link--login');

  header.classList.add('header--menu-closed');
  menuToggle.classList.add('header__menu-toggle--closed');
  navigation.classList.add('navigation--closed');

  var closeMenu = function () {
    if (header.classList.contains('header--menu-opened')) {
      page.classList.remove('page--no-scroll');
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
      page.classList.add('page--no-scroll');
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
    var questionsList = document.querySelector('.faq__questions');
    var questions = questionsList.querySelectorAll('.faq__question');

    var onQuestionClick = function (evt) {
      var target = evt.target.closest('.faq__question');

      if (evt.target.closest('.faq__questions button')) {
        evt.preventDefault();

        target.classList.toggle('faq__question--opened');
        target.classList.toggle('faq__question--closed');
      }
    };

    questions.forEach(function (question) {
      question.classList.remove('faq__question--opened', 'faq__question--hide-icon');
      question.classList.add('faq__question--closed');
    });

    questionsList.addEventListener('click', onQuestionClick);
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

    previewSlideBtn.addEventListener('click', onPreviewSlideBtnClick, {passive: true});
    nextSlideBtn.addEventListener('click', onNextSlideBtnClick, {passive: true});

    slider.addEventListener('touchstart', onSliderTouchStart, {passive: true});
    slider.addEventListener('touchmove', onSliderTouchMove, {passive: true});

    slider.addEventListener('focusin', onSliderFocus);

    pagination.addEventListener('click', onPaginationClick);
  }
})();

'use strict';

(function () {
  if (document.querySelector('.catalog__filter')) {
    var page = document.querySelector('.page');
    var catalogFilter = page.querySelector('.catalog__filter-overlay');
    var catalogFilterFieldsets = catalogFilter.querySelectorAll('.catalog__filter-fildset');
    var catalogFilterOpenBtn = document.querySelector('.catalog__filter-open-btn');
    var catalogFilterCloseBtn = document.querySelector('.catalog__filter-close-btn');
    var catalogFilterFirstActiveElement = document.querySelector('.catalog__filter button');

    var onCatalogFilterClick = function (evt) {
      var target = evt.target.closest('.catalog__filter-fildset');

      if (evt.target.closest('.catalog__filter-group-btn')) {
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
      page.classList.remove('page--no-scroll');

      catalogFilterCloseBtn.removeEventListener('click', oncatalogFilterCloseBtnClick);
      document.removeEventListener('keydown', onOpenFilterEscPress);
    };

    var openFilter = function () {
      catalogFilter.classList.add('catalog__filter-overlay--opened');
      catalogFilter.classList.remove('catalog__filter-overlay--closed');
      page.classList.add('page--no-scroll');

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

    catalogFilterOpenBtn.classList.remove('catalog__filter-open-btn--no-js');
    catalogFilter.classList.remove('catalog__filter-overlay--no-js');

    catalogFilterFieldsets.forEach(function (catalogFilterFieldset) {
      catalogFilterFieldset.classList.remove('catalog__filter-fildset--opened', 'catalog__filter-fildset--hide-icon');
      catalogFilterFieldset.classList.add('catalog__filter-fildset--closed');
    });

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

'use strict';

(function () {
  if (document.querySelector('.product')) {
    var productPhotos = document.querySelectorAll('.product__photo');
    var productInfoTabs = document.querySelector('.product__info-tabs');
    var productInfoSlides = document.querySelector('.product__info-slides');

    var getPhotoPos = function () {
      var pos;

      for (var i = 0; i < productPhotos.length; i++) {
        if (productPhotos[i].classList.contains('product__photo--current')) {
          pos = i + 1;
        }
      }

      return pos;
    };

    var renderPagination = function () {
      var pos = getPhotoPos();
      var pagination = document.createElement('p');

      pagination.textContent = pos + ' of ' + productPhotos.length;

      productPhotos[pos - 1].append(pagination);
    };

    var onProductInfoTabClick = function (evt) {
      evt.preventDefault();

      var currentTab = productInfoTabs.querySelector('.product__info-tab--current');
      var targetTab = evt.target;
      var currentSlide = productInfoSlides.querySelector('.product__info-slide--current');
      var targetSlide = productInfoSlides.querySelector(targetTab.dataset.id);

      currentTab.classList.remove('product__info-tab--current');
      currentSlide.classList.remove('product__info-slide--current');
      targetTab.classList.add('product__info-tab--current');
      targetSlide.classList.add('product__info-slide--current');
    };

    renderPagination();

    productInfoTabs.addEventListener('click', onProductInfoTabClick);
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLW1lbnUuanMiLCJmYXEuanMiLCJzbGlkZXIuanMiLCJjYXRhbG9nLWZpbHRlci5qcyIsImFkZC10by1jYXJ0LmpzIiwibG9naW4uanMiLCJwcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuICB2YXIgb3Blbk1vZGFsID0gZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuc2Nyb2xsWSA9IHNlbGYucGFnZVlPZmZzZXQ7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZICogLTEgKyAncHgnO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuICAgIH1cblxuICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLS1jbG9zZWQnKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC0tb3BlbmVkJyk7XG4gIH07XG5cbiAgdmFyIGNsb3NlTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC0tY2xvc2VkJyk7XG4gICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtLW9wZW5lZCcpO1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IDA7XG4gICAgICBIVE1MLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZKTtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnc21vb3RoJztcbiAgICB9XG4gIH07XG5cbiAgd2luZG93LnV0aWxzID0ge1xuICAgICdvcGVuTW9kYWwnOiBvcGVuTW9kYWwsXG4gICAgJ2Nsb3NlTW9kYWwnOiBjbG9zZU1vZGFsLFxuICB9O1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZScpO1xuICB2YXIgaGVhZGVyID0gcGFnZS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XG4gIHZhciBtZW51VG9nZ2xlID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21lbnUtdG9nZ2xlJyk7XG4gIHZhciBuYXZpZ2F0aW9uID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uJyk7XG4gIHZhciBsb2dpbkxpbmsgPSBuYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uX19saW5rLS1sb2dpbicpO1xuXG4gIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gIG1lbnVUb2dnbGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gIG5hdmlnYXRpb24uY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG5cbiAgdmFyIGNsb3NlTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLS1tZW51LW9wZW5lZCcpKSB7XG4gICAgICBwYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtLW5vLXNjcm9sbCcpO1xuICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlci0tbWVudS1vcGVuZWQnKTtcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gICAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLW9wZW5lZCcpO1xuICAgICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnJlbW92ZSgnbmF2aWdhdGlvbi0tb3BlbmVkJyk7XG4gICAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuXG4gICAgICBoZWFkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk5hdmlnYXRpb25DbGljayk7XG4gICAgICBsb2dpbkxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBvbkxvZ2luTGlua0ZvY3Vzb3V0KTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5NZW51RXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ2hlYWRlci0tbWVudS1jbG9zZWQnKSkge1xuICAgICAgcGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLS1uby1zY3JvbGwnKTtcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtb3BlbmVkJyk7XG4gICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyLS1tZW51LWNsb3NlZCcpO1xuICAgICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1vcGVuZWQnKTtcbiAgICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gICAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLW9wZW5lZCcpO1xuICAgICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCduYXZpZ2F0aW9uLS1jbG9zZWQnKTtcblxuICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25OYXZpZ2F0aW9uQ2xpY2spO1xuICAgICAgbG9naW5MaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25Mb2dpbkxpbmtGb2N1c291dCk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTWVudUVzY1ByZXNzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9uT3Blbk1lbnVFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY2xvc2VNZW51KCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvblRvZ2dsZU1lbnVDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLS1tZW51LW9wZW5lZCcpKSB7XG4gICAgICBjbG9zZU1lbnUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3Blbk1lbnUoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9uRm9jdXNDYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmhlYWRlcicpKSB7XG4gICAgICBtZW51VG9nZ2xlLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uRm9jdXNDYW5nZSk7XG4gIH07XG5cbiAgdmFyIG9uTG9naW5MaW5rRm9jdXNvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uRm9jdXNDYW5nZSk7XG4gIH07XG5cbiAgdmFyIG9uTmF2aWdhdGlvbkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICgoZXZ0LnRhcmdldC5jbG9zZXN0KCdhW2hyZWZdJykgfHwgZXZ0LnRhcmdldC5jbG9zZXN0KCcuaGVhZGVyJykpICYmIGV2dC50YXJnZXQgIT09IG1lbnVUb2dnbGUpIHtcbiAgICAgIGNsb3NlTWVudSgpO1xuICAgIH1cbiAgfTtcblxuICBtZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Ub2dnbGVNZW51Q2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXFfX3F1ZXN0aW9ucycpKSB7XG4gICAgdmFyIHF1ZXN0aW9uc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmFxX19xdWVzdGlvbnMnKTtcbiAgICB2YXIgcXVlc3Rpb25zID0gcXVlc3Rpb25zTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcuZmFxX19xdWVzdGlvbicpO1xuXG4gICAgdmFyIG9uUXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9uJyk7XG5cbiAgICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9ucyBidXR0b24nKSkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnZmFxX19xdWVzdGlvbi0tb3BlbmVkJyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1jbG9zZWQnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcXVlc3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKHF1ZXN0aW9uKSB7XG4gICAgICBxdWVzdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYXFfX3F1ZXN0aW9uLS1vcGVuZWQnLCAnZmFxX19xdWVzdGlvbi0taGlkZS1pY29uJyk7XG4gICAgICBxdWVzdGlvbi5jbGFzc0xpc3QuYWRkKCdmYXFfX3F1ZXN0aW9uLS1jbG9zZWQnKTtcbiAgICB9KTtcblxuICAgIHF1ZXN0aW9uc0xpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblF1ZXN0aW9uQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fd3JhcHBlcicpKSB7XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01BWCA9IDEyMDA7IC8vIHB4XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01JTiA9IDkwMDsgLy8gcHhcbiAgICB2YXIgU0xJREVSX1dJRFRIX09OX01PQklMRSA9IDMyMDsgLy8gcHhcblxuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NQVggPSA0O1xuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NSU4gPSAzO1xuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREUgPSAyO1xuXG4gICAgdmFyIHNsaWRlc1F1YW50aXR5ID0gMztcbiAgICB2YXIgY3VycmVudFNsaWRlID0gMDtcblxuICAgIHZhciBmaW5nZXJEb3VuWCA9IG51bGw7XG5cbiAgICB2YXIgc2xpZGVyRnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX193cmFwcGVyJyk7XG4gICAgdmFyIHNsaWRlciA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2xpc3QnKTtcbiAgICB2YXIgcHJvZHVjdHMgPSBzbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fbGlzdCBsaScpO1xuICAgIHZhciBwcmV2aWV3U2xpZGVCdG4gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLWFycm93LS1wcmV2aWV3Jyk7XG4gICAgdmFyIG5leHRTbGlkZUJ0biA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5leHQnKTtcbiAgICB2YXIgcGFnaW5hdGlvbiA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3BhZ2luYXRpb24nKTtcbiAgICB2YXIgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICAgIHZhciBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uOmRpc2FibGVkJyk7XG5cbiAgICB2YXIgY3VycmVudFNsaWRlckZyYW1lV2lkdGggPSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aDtcblxuICAgIHZhciBpc01vYmlsZSA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fTU9CSUxFO1xuXG4gICAgdmFyIGdldFByb2R1Y3RzUGVyRnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01BWCkge1xuICAgICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUFYO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUlOKSB7XG4gICAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NSU47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREU7XG4gICAgfTtcblxuICAgIHZhciByZW5kZXJQYWdpbmF0aW9uID0gZnVuY3Rpb24gKFEpIHtcbiAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBwYWdlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgY3VycmVudFBhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBjdXJyZW50UGFnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUgKyAxO1xuICAgICAgICBwYWdlc0VsZW1lbnQudGV4dENvbnRlbnQgPSAnIG9mICcgKyBzbGlkZXNRdWFudGl0eTtcbiAgICAgICAgcGFnZXNFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIGN1cnJlbnRQYWdlRWxlbWVudCk7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlc0VsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBROyBpKyspIHtcbiAgICAgICAgICB2YXIgcGFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgIHZhciBwYWdlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgcGFnZUJ0bi50ZXh0Q29udGVudCA9IGkgKyAxO1xuICAgICAgICAgIHBhZ2VCdG4uZGF0YXNldC5wYWdlID0gaTtcbiAgICAgICAgICBwYWdlQnRuLmNsYXNzTGlzdC5hZGQoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgcGFnZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGFnZUVsZW1lbnQuYXBwZW5kKHBhZ2VCdG4pO1xuICAgICAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIHBhZ2luYXRpb24uYXBwZW5kKGZyYWdtZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIHJlbmRlclNsaWRlckNvbnRyb2xzID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2xpZGVzUXVhbnRpdHkgPSBNYXRoLmNlaWwocHJvZHVjdHMubGVuZ3RoIC8gZ2V0UHJvZHVjdHNQZXJGcmFtZSgpKTtcbiAgICAgIGlzTW9iaWxlID0gY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9NT0JJTEU7XG4gICAgICBjdXJyZW50U2xpZGUgPSAwO1xuICAgICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoMHB4KSc7XG5cbiAgICAgIHByZXZpZXdTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcbiAgICAgIG5leHRTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcblxuICAgICAgcGFnaW5hdGlvbi5pbm5lckhUTUwgPSAnJztcblxuICAgICAgcmVuZGVyUGFnaW5hdGlvbihzbGlkZXNRdWFudGl0eSk7XG4gICAgfTtcblxuICAgIHZhciBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocGFnaW5hdGlvbkJ0bnMpLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIChpdGVtLmRhdGFzZXQucGFnZSA9PT0gY3VycmVudFNsaWRlICsgJycpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBjaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaGlmdCA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoICogY3VycmVudFNsaWRlO1xuICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBjdXJyZW50UGFnaW5hdGlvblBhZ2UgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcblxuICAgICAgICBjdXJyZW50UGFnaW5hdGlvblBhZ2UudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICAgIHRhcmdldCA9IGdldFRhcmdldFBhZ2luYXRpb25CdG4oKTtcblxuICAgICAgICBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uOmRpc2FibGVkJyk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGFyZ2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLScgKyBzaGlmdCArICdweCknO1xuICAgIH07XG5cbiAgICB2YXIgc3dpdGNoUHJldmlld1NsaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICBpZiAoY3VycmVudFNsaWRlID09PSAwKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IHNsaWRlc1F1YW50aXR5O1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50U2xpZGUtLTtcblxuICAgICAgY2hhbmdlU2xpZGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIHN3aXRjaE5leHRTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgY3VycmVudFNsaWRlKys7XG5cbiAgICAgIGlmIChjdXJyZW50U2xpZGUgPT09IHNsaWRlc1F1YW50aXR5KSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGNoYW5nZVNsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCAhPT0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGgpIHtcbiAgICAgICAgY3VycmVudFNsaWRlckZyYW1lV2lkdGggPSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aDtcbiAgICAgICAgcmVuZGVyU2xpZGVyQ29udHJvbHMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uUHJldmlld1NsaWRlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzd2l0Y2hQcmV2aWV3U2xpZGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uTmV4dFNsaWRlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzd2l0Y2hOZXh0U2xpZGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uU2xpZGVyVG91Y2hTdGFydCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGZpbmdlckRvdW5YID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICB9O1xuXG4gICAgdmFyIG9uU2xpZGVyVG91Y2hNb3ZlID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKCFmaW5nZXJEb3VuWCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBmaW5nZXJVcFggPSBldnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgdmFyIHN3aXBlTGVuZ3RoWCA9IGZpbmdlckRvdW5YIC0gZmluZ2VyVXBYO1xuXG4gICAgICBpZiAoc3dpcGVMZW5ndGhYID4gMCkge1xuICAgICAgICBzd2l0Y2hQcmV2aWV3U2xpZGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaE5leHRTbGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBmaW5nZXJEb3VuWCA9IG51bGw7XG4gICAgfTtcblxuICAgIHZhciBvblNsaWRlckZvY3VzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLnNsaWRlcl9fbGlzdCBsaScpO1xuICAgICAgdmFyIHRhcmdldFBvcyA9IEFycmF5LmZyb20ocHJvZHVjdHMpLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgIHZhciB0YXJnZXRTbGlkZSA9IE1hdGguZmxvb3IodGFyZ2V0UG9zIC8gZ2V0UHJvZHVjdHNQZXJGcmFtZSgpKTtcblxuICAgICAgaWYgKGN1cnJlbnRTbGlkZSAhPT0gdGFyZ2V0U2xpZGUpIHtcbiAgICAgICAgY3VycmVudFNsaWRlID0gdGFyZ2V0U2xpZGU7XG4gICAgICAgIGNoYW5nZVNsaWRlKCk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXInKS5hcHBlbmQoc2xpZGVyRnJhbWUpO1xuICAgICAgICBldnQudGFyZ2V0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvblBhZ2luYXRpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uOmRpc2FibGVkJyk7XG5cbiAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSBjdXJyZW50UGFnaW5hdGlvbkJ0bikge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSB0YXJnZXQuZGF0YXNldC5wYWdlO1xuICAgICAgICBjaGFuZ2VTbGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZW5kZXJTbGlkZXJDb250cm9scygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcblxuICAgIHByZXZpZXdTbGlkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUHJldmlld1NsaWRlQnRuQ2xpY2ssIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgbmV4dFNsaWRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25OZXh0U2xpZGVCdG5DbGljaywge3Bhc3NpdmU6IHRydWV9KTtcblxuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25TbGlkZXJUb3VjaFN0YXJ0LCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblNsaWRlclRvdWNoTW92ZSwge3Bhc3NpdmU6IHRydWV9KTtcblxuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25TbGlkZXJGb2N1cyk7XG5cbiAgICBwYWdpbmF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25QYWdpbmF0aW9uQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgdmFyIHBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZScpO1xuICAgIHZhciBjYXRhbG9nRmlsdGVyID0gcGFnZS5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fZmlsdGVyLW92ZXJsYXknKTtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlckZpZWxkc2V0cyA9IGNhdGFsb2dGaWx0ZXIucXVlcnlTZWxlY3RvckFsbCgnLmNhdGFsb2dfX2ZpbHRlci1maWxkc2V0Jyk7XG4gICAgdmFyIGNhdGFsb2dGaWx0ZXJPcGVuQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlci1vcGVuLWJ0bicpO1xuICAgIHZhciBjYXRhbG9nRmlsdGVyQ2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fZmlsdGVyLWNsb3NlLWJ0bicpO1xuICAgIHZhciBjYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlciBidXR0b24nKTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5jYXRhbG9nX19maWx0ZXItZmlsZHNldCcpO1xuXG4gICAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2F0YWxvZ19fZmlsdGVyLWdyb3VwLWJ0bicpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tb3BlbmVkJyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBjYXRhbG9nRmlsdGVyKSB7XG4gICAgICAgIGNsb3NlRmlsdGVyKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbk9wZW5GaWx0ZXJFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xvc2VGaWx0ZXIoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNsb3NlRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2F0YWxvZ0ZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdjYXRhbG9nX19maWx0ZXItb3ZlcmxheS0tb3BlbmVkJyk7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1jbG9zZWQnKTtcbiAgICAgIHBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS0tbm8tc2Nyb2xsJyk7XG5cbiAgICAgIGNhdGFsb2dGaWx0ZXJDbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uY2F0YWxvZ0ZpbHRlckNsb3NlQnRuQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3BlbkZpbHRlckVzY1ByZXNzKTtcbiAgICB9O1xuXG4gICAgdmFyIG9wZW5GaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1vcGVuZWQnKTtcbiAgICAgIGNhdGFsb2dGaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnY2F0YWxvZ19fZmlsdGVyLW92ZXJsYXktLWNsb3NlZCcpO1xuICAgICAgcGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLS1uby1zY3JvbGwnKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyQ2xvc2VCdG5DbGljayk7XG4gICAgICBjYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNvdXQpO1xuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25DYXRhbG9nRmlsdGVyQ2xvc2VCdG5Gb2N1c291dCk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuRmlsdGVyRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB2YXIgb25jYXRhbG9nRmlsdGVyT3BlbkJ0bkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIG9wZW5GaWx0ZXIoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uY2F0YWxvZ0ZpbHRlckNsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUZpbHRlcigpO1xuXG4gICAgICBjYXRhbG9nRmlsdGVyQ2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkNsaWNrKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uQ2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudEZvY3VzQ2FuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgICAgIGNhdGFsb2dGaWx0ZXJDbG9zZUJ0bi5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkZvY3VzQ2FuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgICAgIGNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnRGb2N1c291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBvbkNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnRGb2N1c0NhbmdlKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25DYXRhbG9nRmlsdGVyQ2xvc2VCdG5Gb2N1c0NhbmdlKTtcbiAgICB9O1xuXG4gICAgY2F0YWxvZ0ZpbHRlck9wZW5CdG4uY2xhc3NMaXN0LnJlbW92ZSgnY2F0YWxvZ19fZmlsdGVyLW9wZW4tYnRuLS1uby1qcycpO1xuICAgIGNhdGFsb2dGaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnY2F0YWxvZ19fZmlsdGVyLW92ZXJsYXktLW5vLWpzJyk7XG5cbiAgICBjYXRhbG9nRmlsdGVyRmllbGRzZXRzLmZvckVhY2goZnVuY3Rpb24gKGNhdGFsb2dGaWx0ZXJGaWVsZHNldCkge1xuICAgICAgY2F0YWxvZ0ZpbHRlckZpZWxkc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2NhdGFsb2dfX2ZpbHRlci1maWxkc2V0LS1vcGVuZWQnLCAnY2F0YWxvZ19fZmlsdGVyLWZpbGRzZXQtLWhpZGUtaWNvbicpO1xuICAgICAgY2F0YWxvZ0ZpbHRlckZpZWxkc2V0LmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2dfX2ZpbHRlci1maWxkc2V0LS1jbG9zZWQnKTtcbiAgICB9KTtcblxuICAgIGNhdGFsb2dGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNhdGFsb2dGaWx0ZXJDbGljayk7XG4gICAgY2F0YWxvZ0ZpbHRlck9wZW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNhdGFsb2dGaWx0ZXJPcGVuQnRuQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1hZGQtdG8tY2FydCcpKSB7XG4gICAgdmFyIG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWFkZC10by1jYXJ0Jyk7XG4gICAgdmFyIGNsb3NlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Nsb3NlLWJ0bicpO1xuICAgIHZhciBtb2RhbE9wZW5CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdF9fYWRkLXRvLWNhcnQtYnRuJyk7XG5cbiAgICB2YXIgb25Nb2RhbE9wZW5CdG5DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB3aW5kb3cudXRpbHMub3Blbk1vZGFsKG92ZXJsYXkpO1xuXG4gICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfTtcblxuICAgIHZhciBvbk1vZGFsQ2xvc2VCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcblxuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgfTtcblxuICAgIHZhciBvbk92ZXJsYXlDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBvdmVybGF5KSB7XG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbk9wZW5Nb2RhbEVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG1vZGFsT3BlbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxPcGVuQnRuQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1sb2dpbicpKSB7XG4gICAgdmFyIG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWxvZ2luJyk7XG4gICAgdmFyIGNsb3NlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Nsb3NlLWJ0bicpO1xuICAgIHZhciBsb2dpbkZvcm0gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbl9fZm9ybScpO1xuICAgIHZhciB1c2VyRW1haWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNlbWFpbCcpO1xuICAgIHZhciB1c2VyUGFzc3dvcmQgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNwYXNzd29yZCcpO1xuICAgIHZhciBtb2RhbE9wZW5CdG5IZWFkZXJMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbG9naW4tbGluaycpO1xuICAgIHZhciBtb2RhbE9wZW5CdG5IZWFkZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19sb2dpbi1idG4nKTtcbiAgICB2YXIgbW9kYWxPcGVuQnRuTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmlnYXRpb25fX2xpbmstLWxvZ2luJyk7XG5cbiAgICB2YXIgaXNTdG9yYWdlU3VwcG9ydCA9IHRydWU7XG4gICAgdmFyIHN0b3JhZ2UgPSAnJztcblxuICAgIHZhciBvbkxvZ2luRm9ybVN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbWFpbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignI2VtYWlsJyk7XG5cbiAgICAgIGlmIChpc1N0b3JhZ2VTdXBwb3J0KSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdlbWFpbCcsIGVtYWlsLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uTW9kYWxPcGVuQnRuQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgd2luZG93LnV0aWxzLm9wZW5Nb2RhbChvdmVybGF5KTtcblxuICAgICAgaWYgKHVzZXJFbWFpbC52YWx1ZSkge1xuICAgICAgICB1c2VyUGFzc3dvcmQuZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXJFbWFpbC5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICBsb2dpbkZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0Jywgb25Mb2dpbkZvcm1TdWJtaXQpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB2YXIgb25Nb2RhbENsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG92ZXJsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICBsb2dpbkZvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VibWl0Jywgb25Mb2dpbkZvcm1TdWJtaXQpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChvdmVybGF5KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uT3ZlcmxheUNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC50YXJnZXQgPT09IG92ZXJsYXkpIHtcbiAgICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICAgIG92ZXJsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICAgIGxvZ2luRm9ybS5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvbkxvZ2luRm9ybVN1Ym1pdCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcblxuICAgICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChvdmVybGF5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uT3Blbk1vZGFsRXNjUHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICAgIG92ZXJsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICAgIGxvZ2luRm9ybS5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvbkxvZ2luRm9ybVN1Ym1pdCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcblxuICAgICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChvdmVybGF5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZW1haWwnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlzU3RvcmFnZVN1cHBvcnQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc3RvcmFnZSkge1xuICAgICAgdXNlckVtYWlsLnZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VtYWlsJyk7XG4gICAgfVxuXG4gICAgbW9kYWxPcGVuQnRuSGVhZGVyTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxPcGVuQnRuQ2xpY2spO1xuICAgIG1vZGFsT3BlbkJ0bkhlYWRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxPcGVuQnRuQ2xpY2spO1xuICAgIG1vZGFsT3BlbkJ0bk5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxPcGVuQnRuQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3QnKSkge1xuICAgIHZhciBwcm9kdWN0UGhvdG9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3RfX3Bob3RvJyk7XG4gICAgdmFyIHByb2R1Y3RJbmZvVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0X19pbmZvLXRhYnMnKTtcbiAgICB2YXIgcHJvZHVjdEluZm9TbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdF9faW5mby1zbGlkZXMnKTtcblxuICAgIHZhciBnZXRQaG90b1BvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwb3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvZHVjdFBob3Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocHJvZHVjdFBob3Rvc1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ3Byb2R1Y3RfX3Bob3RvLS1jdXJyZW50JykpIHtcbiAgICAgICAgICBwb3MgPSBpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcG9zO1xuICAgIH07XG5cbiAgICB2YXIgcmVuZGVyUGFnaW5hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwb3MgPSBnZXRQaG90b1BvcygpO1xuICAgICAgdmFyIHBhZ2luYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgIHBhZ2luYXRpb24udGV4dENvbnRlbnQgPSBwb3MgKyAnIG9mICcgKyBwcm9kdWN0UGhvdG9zLmxlbmd0aDtcblxuICAgICAgcHJvZHVjdFBob3Rvc1twb3MgLSAxXS5hcHBlbmQocGFnaW5hdGlvbik7XG4gICAgfTtcblxuICAgIHZhciBvblByb2R1Y3RJbmZvVGFiQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIGN1cnJlbnRUYWIgPSBwcm9kdWN0SW5mb1RhYnMucXVlcnlTZWxlY3RvcignLnByb2R1Y3RfX2luZm8tdGFiLS1jdXJyZW50Jyk7XG4gICAgICB2YXIgdGFyZ2V0VGFiID0gZXZ0LnRhcmdldDtcbiAgICAgIHZhciBjdXJyZW50U2xpZGUgPSBwcm9kdWN0SW5mb1NsaWRlcy5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdF9faW5mby1zbGlkZS0tY3VycmVudCcpO1xuICAgICAgdmFyIHRhcmdldFNsaWRlID0gcHJvZHVjdEluZm9TbGlkZXMucXVlcnlTZWxlY3Rvcih0YXJnZXRUYWIuZGF0YXNldC5pZCk7XG5cbiAgICAgIGN1cnJlbnRUYWIuY2xhc3NMaXN0LnJlbW92ZSgncHJvZHVjdF9faW5mby10YWItLWN1cnJlbnQnKTtcbiAgICAgIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9kdWN0X19pbmZvLXNsaWRlLS1jdXJyZW50Jyk7XG4gICAgICB0YXJnZXRUYWIuY2xhc3NMaXN0LmFkZCgncHJvZHVjdF9faW5mby10YWItLWN1cnJlbnQnKTtcbiAgICAgIHRhcmdldFNsaWRlLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RfX2luZm8tc2xpZGUtLWN1cnJlbnQnKTtcbiAgICB9O1xuXG4gICAgcmVuZGVyUGFnaW5hdGlvbigpO1xuXG4gICAgcHJvZHVjdEluZm9UYWJzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Qcm9kdWN0SW5mb1RhYkNsaWNrKTtcbiAgfVxufSkoKTtcbiJdfQ==

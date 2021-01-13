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

      if (evt.target.closest('.faq__questions a')) {
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

      if (evt.target.closest('.catalog__filter-fildset button')) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLW1lbnUuanMiLCJmYXEuanMiLCJzbGlkZXIuanMiLCJjYXRhbG9nLWZpbHRlci5qcyIsImFkZC10by1jYXJ0LmpzIiwibG9naW4uanMiLCJwcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuICB2YXIgb3Blbk1vZGFsID0gZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuc2Nyb2xsWSA9IHNlbGYucGFnZVlPZmZzZXQ7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZICogLTEgKyAncHgnO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuICAgIH1cblxuICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLS1jbG9zZWQnKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC0tb3BlbmVkJyk7XG4gIH07XG5cbiAgdmFyIGNsb3NlTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC0tY2xvc2VkJyk7XG4gICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtLW9wZW5lZCcpO1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IDA7XG4gICAgICBIVE1MLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZKTtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnc21vb3RoJztcbiAgICB9XG4gIH07XG5cbiAgd2luZG93LnV0aWxzID0ge1xuICAgICdvcGVuTW9kYWwnOiBvcGVuTW9kYWwsXG4gICAgJ2Nsb3NlTW9kYWwnOiBjbG9zZU1vZGFsLFxuICB9O1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZScpO1xuICB2YXIgaGVhZGVyID0gcGFnZS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XG4gIHZhciBtZW51VG9nZ2xlID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21lbnUtdG9nZ2xlJyk7XG4gIHZhciBuYXZpZ2F0aW9uID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uJyk7XG4gIHZhciBsb2dpbkxpbmsgPSBuYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uX19saW5rLS1sb2dpbicpO1xuXG4gIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gIG1lbnVUb2dnbGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gIG5hdmlnYXRpb24uY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG5cbiAgdmFyIGNsb3NlTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLS1tZW51LW9wZW5lZCcpKSB7XG4gICAgICBwYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtLW5vLXNjcm9sbCcpO1xuICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlci0tbWVudS1vcGVuZWQnKTtcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gICAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLW9wZW5lZCcpO1xuICAgICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnJlbW92ZSgnbmF2aWdhdGlvbi0tb3BlbmVkJyk7XG4gICAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuXG4gICAgICBoZWFkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk5hdmlnYXRpb25DbGljayk7XG4gICAgICBsb2dpbkxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBvbkxvZ2luTGlua0ZvY3Vzb3V0KTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5NZW51RXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ2hlYWRlci0tbWVudS1jbG9zZWQnKSkge1xuICAgICAgcGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLS1uby1zY3JvbGwnKTtcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtb3BlbmVkJyk7XG4gICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyLS1tZW51LWNsb3NlZCcpO1xuICAgICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1vcGVuZWQnKTtcbiAgICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gICAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLW9wZW5lZCcpO1xuICAgICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCduYXZpZ2F0aW9uLS1jbG9zZWQnKTtcblxuICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25OYXZpZ2F0aW9uQ2xpY2spO1xuICAgICAgbG9naW5MaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25Mb2dpbkxpbmtGb2N1c291dCk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTWVudUVzY1ByZXNzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9uT3Blbk1lbnVFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY2xvc2VNZW51KCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvblRvZ2dsZU1lbnVDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLS1tZW51LW9wZW5lZCcpKSB7XG4gICAgICBjbG9zZU1lbnUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3Blbk1lbnUoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9uRm9jdXNDYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmhlYWRlcicpKSB7XG4gICAgICBtZW51VG9nZ2xlLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uRm9jdXNDYW5nZSk7XG4gIH07XG5cbiAgdmFyIG9uTG9naW5MaW5rRm9jdXNvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uRm9jdXNDYW5nZSk7XG4gIH07XG5cbiAgdmFyIG9uTmF2aWdhdGlvbkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICgoZXZ0LnRhcmdldC5jbG9zZXN0KCdhW2hyZWZdJykgfHwgZXZ0LnRhcmdldC5jbG9zZXN0KCcuaGVhZGVyJykpICYmIGV2dC50YXJnZXQgIT09IG1lbnVUb2dnbGUpIHtcbiAgICAgIGNsb3NlTWVudSgpO1xuICAgIH1cbiAgfTtcblxuICBtZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Ub2dnbGVNZW51Q2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXFfX3F1ZXN0aW9ucycpKSB7XG4gICAgdmFyIHF1ZXN0aW9uc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmFxX19xdWVzdGlvbnMnKTtcbiAgICB2YXIgcXVlc3Rpb25zID0gcXVlc3Rpb25zTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcuZmFxX19xdWVzdGlvbicpO1xuXG4gICAgdmFyIG9uUXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9uJyk7XG5cbiAgICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9ucyBhJykpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhcV9fcXVlc3Rpb24tLW9wZW5lZCcpO1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnZmFxX19xdWVzdGlvbi0tY2xvc2VkJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHF1ZXN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChxdWVzdGlvbikge1xuICAgICAgcXVlc3Rpb24uY2xhc3NMaXN0LnJlbW92ZSgnZmFxX19xdWVzdGlvbi0tb3BlbmVkJywgJ2ZhcV9fcXVlc3Rpb24tLWhpZGUtaWNvbicpO1xuICAgICAgcXVlc3Rpb24uY2xhc3NMaXN0LmFkZCgnZmFxX19xdWVzdGlvbi0tY2xvc2VkJyk7XG4gICAgfSk7XG5cbiAgICBxdWVzdGlvbnNMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25RdWVzdGlvbkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3dyYXBwZXInKSkge1xuICAgIHZhciBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NQVggPSAxMjAwOyAvLyBweFxuICAgIHZhciBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NSU4gPSA5MDA7IC8vIHB4XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9NT0JJTEUgPSAzMjA7IC8vIHB4XG5cbiAgICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUFYID0gNDtcbiAgICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUlOID0gMztcbiAgICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFID0gMjtcblxuICAgIHZhciBzbGlkZXNRdWFudGl0eSA9IDM7XG4gICAgdmFyIGN1cnJlbnRTbGlkZSA9IDA7XG5cbiAgICB2YXIgZmluZ2VyRG91blggPSBudWxsO1xuXG4gICAgdmFyIHNsaWRlckZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fd3JhcHBlcicpO1xuICAgIHZhciBzbGlkZXIgPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19saXN0Jyk7XG4gICAgdmFyIHByb2R1Y3RzID0gc2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2xpc3QgbGknKTtcbiAgICB2YXIgcHJldmlld1NsaWRlQnRuID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1hcnJvdy0tcHJldmlldycpO1xuICAgIHZhciBuZXh0U2xpZGVCdG4gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLWFycm93LS1uZXh0Jyk7XG4gICAgdmFyIHBhZ2luYXRpb24gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19wYWdpbmF0aW9uJyk7XG4gICAgdmFyIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcbiAgICB2YXIgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbjpkaXNhYmxlZCcpO1xuXG4gICAgdmFyIGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGg7XG5cbiAgICB2YXIgaXNNb2JpbGUgPSBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX01PQklMRTtcblxuICAgIHZhciBnZXRQcm9kdWN0c1BlckZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NQVgpIHtcbiAgICAgICAgcmV0dXJuIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01BWDtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01JTikge1xuICAgICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUlOO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFO1xuICAgIH07XG5cbiAgICB2YXIgcmVuZGVyUGFnaW5hdGlvbiA9IGZ1bmN0aW9uIChRKSB7XG4gICAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICB2YXIgcGFnZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgdmFyIGN1cnJlbnRQYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgY3VycmVudFBhZ2VFbGVtZW50LnRleHRDb250ZW50ID0gY3VycmVudFNsaWRlICsgMTtcbiAgICAgICAgcGFnZXNFbGVtZW50LnRleHRDb250ZW50ID0gJyBvZiAnICsgc2xpZGVzUXVhbnRpdHk7XG4gICAgICAgIHBhZ2VzRWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyYmVnaW4nLCBjdXJyZW50UGFnZUVsZW1lbnQpO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmQocGFnZXNFbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgUTsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICB2YXIgcGFnZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgIHBhZ2VCdG4udGV4dENvbnRlbnQgPSBpICsgMTtcbiAgICAgICAgICBwYWdlQnRuLmRhdGFzZXQucGFnZSA9IGk7XG4gICAgICAgICAgcGFnZUJ0bi5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIHBhZ2VCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhZ2VFbGVtZW50LmFwcGVuZChwYWdlQnRuKTtcbiAgICAgICAgICBmcmFnbWVudC5hcHBlbmQocGFnZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICAgICAgfVxuXG4gICAgICBwYWdpbmF0aW9uLmFwcGVuZChmcmFnbWVudCk7XG4gICAgfTtcblxuICAgIHZhciByZW5kZXJTbGlkZXJDb250cm9scyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNsaWRlc1F1YW50aXR5ID0gTWF0aC5jZWlsKHByb2R1Y3RzLmxlbmd0aCAvIGdldFByb2R1Y3RzUGVyRnJhbWUoKSk7XG4gICAgICBpc01vYmlsZSA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fTU9CSUxFO1xuICAgICAgY3VycmVudFNsaWRlID0gMDtcbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKDBweCknO1xuXG4gICAgICBwcmV2aWV3U2xpZGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLWFycm93LS1ub2pzJyk7XG4gICAgICBuZXh0U2xpZGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLWFycm93LS1ub2pzJyk7XG5cbiAgICAgIHBhZ2luYXRpb24uaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgIHJlbmRlclBhZ2luYXRpb24oc2xpZGVzUXVhbnRpdHkpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0VGFyZ2V0UGFnaW5hdGlvbkJ0biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHBhZ2luYXRpb25CdG5zKS5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAoaXRlbS5kYXRhc2V0LnBhZ2UgPT09IGN1cnJlbnRTbGlkZSArICcnKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgY2hhbmdlU2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2hpZnQgPSBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCAqIGN1cnJlbnRTbGlkZTtcbiAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICB2YXIgY3VycmVudFBhZ2luYXRpb25QYWdlID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25QYWdlLnRleHRDb250ZW50ID0gY3VycmVudFNsaWRlICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgICB0YXJnZXQgPSBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuKCk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbjpkaXNhYmxlZCcpO1xuXG4gICAgICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKC0nICsgc2hpZnQgKyAncHgpJztcbiAgICB9O1xuXG4gICAgdmFyIHN3aXRjaFByZXZpZXdTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgaWYgKGN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSBzbGlkZXNRdWFudGl0eTtcbiAgICAgIH1cblxuICAgICAgY3VycmVudFNsaWRlLS07XG5cbiAgICAgIGNoYW5nZVNsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBzd2l0Y2hOZXh0U2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgIGN1cnJlbnRTbGlkZSsrO1xuXG4gICAgICBpZiAoY3VycmVudFNsaWRlID09PSBzbGlkZXNRdWFudGl0eSkge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSAwO1xuICAgICAgfVxuXG4gICAgICBjaGFuZ2VTbGlkZSgpO1xuICAgIH07XG5cbiAgICB2YXIgb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggIT09IHNsaWRlckZyYW1lLm9mZnNldFdpZHRoKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGg7XG4gICAgICAgIHJlbmRlclNsaWRlckNvbnRyb2xzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvblByZXZpZXdTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc3dpdGNoUHJldmlld1NsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvbk5leHRTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc3dpdGNoTmV4dFNsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvblNsaWRlclRvdWNoU3RhcnQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBmaW5nZXJEb3VuWCA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgfTtcblxuICAgIHZhciBvblNsaWRlclRvdWNoTW92ZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmICghZmluZ2VyRG91blgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmluZ2VyVXBYID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgIHZhciBzd2lwZUxlbmd0aFggPSBmaW5nZXJEb3VuWCAtIGZpbmdlclVwWDtcblxuICAgICAgaWYgKHN3aXBlTGVuZ3RoWCA+IDApIHtcbiAgICAgICAgc3dpdGNoUHJldmlld1NsaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2hOZXh0U2xpZGUoKTtcbiAgICAgIH1cblxuICAgICAgZmluZ2VyRG91blggPSBudWxsO1xuICAgIH07XG5cbiAgICB2YXIgb25TbGlkZXJGb2N1cyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5zbGlkZXJfX2xpc3QgbGknKTtcbiAgICAgIHZhciB0YXJnZXRQb3MgPSBBcnJheS5mcm9tKHByb2R1Y3RzKS5pbmRleE9mKHRhcmdldCk7XG4gICAgICB2YXIgdGFyZ2V0U2xpZGUgPSBNYXRoLmZsb29yKHRhcmdldFBvcyAvIGdldFByb2R1Y3RzUGVyRnJhbWUoKSk7XG5cbiAgICAgIGlmIChjdXJyZW50U2xpZGUgIT09IHRhcmdldFNsaWRlKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IHRhcmdldFNsaWRlO1xuICAgICAgICBjaGFuZ2VTbGlkZSgpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyJykuYXBwZW5kKHNsaWRlckZyYW1lKTtcbiAgICAgICAgZXZ0LnRhcmdldC5mb2N1cygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25QYWdpbmF0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbjpkaXNhYmxlZCcpO1xuXG4gICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gY3VycmVudFBhZ2luYXRpb25CdG4pIHtcbiAgICAgICAgY3VycmVudFNsaWRlID0gdGFyZ2V0LmRhdGFzZXQucGFnZTtcbiAgICAgICAgY2hhbmdlU2xpZGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVuZGVyU2xpZGVyQ29udHJvbHMoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG5cbiAgICBwcmV2aWV3U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblByZXZpZXdTbGlkZUJ0bkNsaWNrLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgIG5leHRTbGlkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTmV4dFNsaWRlQnRuQ2xpY2ssIHtwYXNzaXZlOiB0cnVlfSk7XG5cbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uU2xpZGVyVG91Y2hTdGFydCwge3Bhc3NpdmU6IHRydWV9KTtcbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25TbGlkZXJUb3VjaE1vdmUsIHtwYXNzaXZlOiB0cnVlfSk7XG5cbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uU2xpZGVyRm9jdXMpO1xuXG4gICAgcGFnaW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUGFnaW5hdGlvbkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXInKSkge1xuICAgIHZhciBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UnKTtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlciA9IHBhZ2UucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlci1vdmVybGF5Jyk7XG4gICAgdmFyIGNhdGFsb2dGaWx0ZXJGaWVsZHNldHMgPSBjYXRhbG9nRmlsdGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nX19maWx0ZXItZmlsZHNldCcpO1xuICAgIHZhciBjYXRhbG9nRmlsdGVyT3BlbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXItb3Blbi1idG4nKTtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlci1jbG9zZS1idG4nKTtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXIgYnV0dG9uJyk7XG5cbiAgICB2YXIgb25DYXRhbG9nRmlsdGVyQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2F0YWxvZ19fZmlsdGVyLWZpbGRzZXQnKTtcblxuICAgICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlci1maWxkc2V0IGJ1dHRvbicpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tb3BlbmVkJyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBjYXRhbG9nRmlsdGVyKSB7XG4gICAgICAgIGNsb3NlRmlsdGVyKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbk9wZW5GaWx0ZXJFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xvc2VGaWx0ZXIoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNsb3NlRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2F0YWxvZ0ZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdjYXRhbG9nX19maWx0ZXItb3ZlcmxheS0tb3BlbmVkJyk7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1jbG9zZWQnKTtcbiAgICAgIHBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS0tbm8tc2Nyb2xsJyk7XG5cbiAgICAgIGNhdGFsb2dGaWx0ZXJDbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uY2F0YWxvZ0ZpbHRlckNsb3NlQnRuQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3BlbkZpbHRlckVzY1ByZXNzKTtcbiAgICB9O1xuXG4gICAgdmFyIG9wZW5GaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1vcGVuZWQnKTtcbiAgICAgIGNhdGFsb2dGaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnY2F0YWxvZ19fZmlsdGVyLW92ZXJsYXktLWNsb3NlZCcpO1xuICAgICAgcGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLS1uby1zY3JvbGwnKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyQ2xvc2VCdG5DbGljayk7XG4gICAgICBjYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNvdXQpO1xuICAgICAgY2F0YWxvZ0ZpbHRlckNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb25DYXRhbG9nRmlsdGVyQ2xvc2VCdG5Gb2N1c291dCk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuRmlsdGVyRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB2YXIgb25jYXRhbG9nRmlsdGVyT3BlbkJ0bkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIG9wZW5GaWx0ZXIoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uY2F0YWxvZ0ZpbHRlckNsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUZpbHRlcigpO1xuXG4gICAgICBjYXRhbG9nRmlsdGVyQ2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkNsaWNrKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uQ2F0YWxvZ0ZpbHRlckZpcnN0QWN0aXZlRWxlbWVudEZvY3VzQ2FuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgICAgIGNhdGFsb2dGaWx0ZXJDbG9zZUJ0bi5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25DYXRhbG9nRmlsdGVyRmlyc3RBY3RpdmVFbGVtZW50Rm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJDbG9zZUJ0bkZvY3VzQ2FuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgICAgIGNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNDYW5nZSk7XG4gICAgfTtcblxuICAgIHZhciBvbkNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnRGb2N1c291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBvbkNhdGFsb2dGaWx0ZXJGaXJzdEFjdGl2ZUVsZW1lbnRGb2N1c0NhbmdlKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uQ2F0YWxvZ0ZpbHRlckNsb3NlQnRuRm9jdXNvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgb25DYXRhbG9nRmlsdGVyQ2xvc2VCdG5Gb2N1c0NhbmdlKTtcbiAgICB9O1xuXG4gICAgY2F0YWxvZ0ZpbHRlckZpZWxkc2V0cy5mb3JFYWNoKGZ1bmN0aW9uIChjYXRhbG9nRmlsdGVyRmllbGRzZXQpIHtcbiAgICAgIGNhdGFsb2dGaWx0ZXJGaWVsZHNldC5jbGFzc0xpc3QucmVtb3ZlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tb3BlbmVkJywgJ2NhdGFsb2dfX2ZpbHRlci1maWxkc2V0LS1oaWRlLWljb24nKTtcbiAgICAgIGNhdGFsb2dGaWx0ZXJGaWVsZHNldC5jbGFzc0xpc3QuYWRkKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tY2xvc2VkJyk7XG4gICAgfSk7XG5cbiAgICBjYXRhbG9nRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DYXRhbG9nRmlsdGVyQ2xpY2spO1xuICAgIGNhdGFsb2dGaWx0ZXJPcGVuQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyT3BlbkJ0bkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tYWRkLXRvLWNhcnQnKSkge1xuICAgIHZhciBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1hZGQtdG8tY2FydCcpO1xuICAgIHZhciBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignLm1vZGFsX19jbG9zZS1idG4nKTtcbiAgICB2YXIgbW9kYWxPcGVuQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3RfX2FkZC10by1jYXJ0LWJ0bicpO1xuXG4gICAgdmFyIG9uTW9kYWxPcGVuQnRuQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgd2luZG93LnV0aWxzLm9wZW5Nb2RhbChvdmVybGF5KTtcblxuICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB2YXIgb25Nb2RhbENsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG92ZXJsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk92ZXJsYXlDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgIH07XG5cbiAgICB2YXIgb25PdmVybGF5Q2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnRhcmdldCA9PT0gb3ZlcmxheSkge1xuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25PcGVuTW9kYWxFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgb3ZlcmxheS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uT3ZlcmxheUNsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuXG4gICAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKG92ZXJsYXkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBtb2RhbE9wZW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsT3BlbkJ0bkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tbG9naW4nKSkge1xuICAgIHZhciBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1sb2dpbicpO1xuICAgIHZhciBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignLm1vZGFsX19jbG9zZS1idG4nKTtcbiAgICB2YXIgbG9naW5Gb3JtID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcubG9naW5fX2Zvcm0nKTtcbiAgICB2YXIgdXNlckVtYWlsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcjZW1haWwnKTtcbiAgICB2YXIgdXNlclBhc3N3b3JkID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcjcGFzc3dvcmQnKTtcbiAgICB2YXIgbW9kYWxPcGVuQnRuSGVhZGVyTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2xvZ2luLWxpbmsnKTtcbiAgICB2YXIgbW9kYWxPcGVuQnRuSGVhZGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbG9naW4tYnRuJyk7XG4gICAgdmFyIG1vZGFsT3BlbkJ0bk5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uX19saW5rLS1sb2dpbicpO1xuXG4gICAgdmFyIGlzU3RvcmFnZVN1cHBvcnQgPSB0cnVlO1xuICAgIHZhciBzdG9yYWdlID0gJyc7XG5cbiAgICB2YXIgb25Mb2dpbkZvcm1TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZW1haWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNlbWFpbCcpO1xuXG4gICAgICBpZiAoaXNTdG9yYWdlU3VwcG9ydCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZW1haWwnLCBlbWFpbC52YWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbk1vZGFsT3BlbkJ0bkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHdpbmRvdy51dGlscy5vcGVuTW9kYWwob3ZlcmxheSk7XG5cbiAgICAgIGlmICh1c2VyRW1haWwudmFsdWUpIHtcbiAgICAgICAgdXNlclBhc3N3b3JkLmZvY3VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1c2VyRW1haWwuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgbG9naW5Gb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG9uTG9naW5Gb3JtU3VibWl0KTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcbiAgICB9O1xuXG4gICAgdmFyIG9uTW9kYWxDbG9zZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xvc2VCdG5DbGljayk7XG4gICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgbG9naW5Gb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG9uTG9naW5Gb3JtU3VibWl0KTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcblxuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgfTtcblxuICAgIHZhciBvbk92ZXJsYXlDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBvdmVybGF5KSB7XG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgICBsb2dpbkZvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VibWl0Jywgb25Mb2dpbkZvcm1TdWJtaXQpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbk9wZW5Nb2RhbEVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsb3NlQnRuQ2xpY2spO1xuICAgICAgICBvdmVybGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25PdmVybGF5Q2xpY2spO1xuICAgICAgICBsb2dpbkZvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VibWl0Jywgb25Mb2dpbkZvcm1TdWJtaXQpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG5cbiAgICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwob3ZlcmxheSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VtYWlsJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpc1N0b3JhZ2VTdXBwb3J0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHN0b3JhZ2UpIHtcbiAgICAgIHVzZXJFbWFpbC52YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlbWFpbCcpO1xuICAgIH1cblxuICAgIG1vZGFsT3BlbkJ0bkhlYWRlckxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsT3BlbkJ0bkNsaWNrKTtcbiAgICBtb2RhbE9wZW5CdG5IZWFkZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsT3BlbkJ0bkNsaWNrKTtcbiAgICBtb2RhbE9wZW5CdG5OYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsT3BlbkJ0bkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0JykpIHtcbiAgICB2YXIgcHJvZHVjdFBob3RvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0X19waG90bycpO1xuICAgIHZhciBwcm9kdWN0SW5mb1RhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdF9faW5mby10YWJzJyk7XG4gICAgdmFyIHByb2R1Y3RJbmZvU2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3RfX2luZm8tc2xpZGVzJyk7XG5cbiAgICB2YXIgZ2V0UGhvdG9Qb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcG9zO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2R1Y3RQaG90b3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHByb2R1Y3RQaG90b3NbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9kdWN0X19waG90by0tY3VycmVudCcpKSB7XG4gICAgICAgICAgcG9zID0gaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBvcztcbiAgICB9O1xuXG4gICAgdmFyIHJlbmRlclBhZ2luYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcG9zID0gZ2V0UGhvdG9Qb3MoKTtcbiAgICAgIHZhciBwYWdpbmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICBwYWdpbmF0aW9uLnRleHRDb250ZW50ID0gcG9zICsgJyBvZiAnICsgcHJvZHVjdFBob3Rvcy5sZW5ndGg7XG5cbiAgICAgIHByb2R1Y3RQaG90b3NbcG9zIC0gMV0uYXBwZW5kKHBhZ2luYXRpb24pO1xuICAgIH07XG5cbiAgICB2YXIgb25Qcm9kdWN0SW5mb1RhYkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciBjdXJyZW50VGFiID0gcHJvZHVjdEluZm9UYWJzLnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0X19pbmZvLXRhYi0tY3VycmVudCcpO1xuICAgICAgdmFyIHRhcmdldFRhYiA9IGV2dC50YXJnZXQ7XG4gICAgICB2YXIgY3VycmVudFNsaWRlID0gcHJvZHVjdEluZm9TbGlkZXMucXVlcnlTZWxlY3RvcignLnByb2R1Y3RfX2luZm8tc2xpZGUtLWN1cnJlbnQnKTtcbiAgICAgIHZhciB0YXJnZXRTbGlkZSA9IHByb2R1Y3RJbmZvU2xpZGVzLnF1ZXJ5U2VsZWN0b3IodGFyZ2V0VGFiLmRhdGFzZXQuaWQpO1xuXG4gICAgICBjdXJyZW50VGFiLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2R1Y3RfX2luZm8tdGFiLS1jdXJyZW50Jyk7XG4gICAgICBjdXJyZW50U2xpZGUuY2xhc3NMaXN0LnJlbW92ZSgncHJvZHVjdF9faW5mby1zbGlkZS0tY3VycmVudCcpO1xuICAgICAgdGFyZ2V0VGFiLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RfX2luZm8tdGFiLS1jdXJyZW50Jyk7XG4gICAgICB0YXJnZXRTbGlkZS5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0X19pbmZvLXNsaWRlLS1jdXJyZW50Jyk7XG4gICAgfTtcblxuICAgIHJlbmRlclBhZ2luYXRpb24oKTtcblxuICAgIHByb2R1Y3RJbmZvVGFicy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUHJvZHVjdEluZm9UYWJDbGljayk7XG4gIH1cbn0pKCk7XG4iXX0=

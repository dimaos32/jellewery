'use strict';

(function () {
  var header = document.querySelector('.header');
  var menuToggle = header.querySelector('.header__menu-toggle');
  var navigation = header.querySelector('.navigation');

  header.classList.add('header--menu-closed');
  menuToggle.classList.add('header__menu-toggle--closed');
  navigation.classList.add('navigation--closed');

  var onToggleMenuClick = function () {
    header.classList.toggle('header--menu-opened');
    header.classList.toggle('header--menu-closed');
    menuToggle.classList.toggle('header__menu-toggle--opened');
    menuToggle.classList.toggle('header__menu-toggle--closed');
    navigation.classList.toggle('navigation--opened');
    navigation.classList.toggle('navigation--closed');
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
  }
})();

'use strict';

(function () {
  if (document.querySelector('.catalog__filter')) {
    var catalogFilter = document.querySelector('.catalog__filter-overlay');
    var catalogFilterOpenBtn = document.querySelector('.catalog__filter-open-btn');
    var catalogFiltercloseBtn = document.querySelector('.catalog__filter-close-btn');

    var onCatalogFilterClick = function (evt) {
      var target = evt.target.closest('.catalog__filter-fildset');

      if (evt.target.closest('.catalog__filter-fildset legend')) {
        evt.preventDefault();

        target.classList.toggle('catalog__filter-fildset--opened');
        target.classList.toggle('catalog__filter-fildset--closed');
      }
    };

    var oncatalogFilterOpenBtnClick = function (evt) {
      evt.preventDefault();

      catalogFilter.classList.add('catalog__filter-overlay--opened');
      catalogFilter.classList.remove('catalog__filter-overlay--closed');

      catalogFiltercloseBtn.addEventListener('click', oncatalogFiltercloseBtnClick);
    };

    var oncatalogFiltercloseBtnClick = function () {
      catalogFilter.classList.remove('catalog__filter-overlay--opened');
      catalogFilter.classList.add('catalog__filter-overlay--closed');

      catalogFiltercloseBtn.removeEventListener('click', oncatalogFiltercloseBtnClick);
    };

    catalogFilter.addEventListener('click', onCatalogFilterClick);
    catalogFilterOpenBtn.addEventListener('click', oncatalogFilterOpenBtnClick);
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1cmdlci1tZW51LmpzIiwiZmFxLmpzIiwic2xpZGVyLmpzIiwiY2F0YWxvZy1maWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKTtcbiAgdmFyIG1lbnVUb2dnbGUgPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbWVudS10b2dnbGUnKTtcbiAgdmFyIG5hdmlnYXRpb24gPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLm5hdmlnYXRpb24nKTtcblxuICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLS1tZW51LWNsb3NlZCcpO1xuICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fbWVudS10b2dnbGUtLWNsb3NlZCcpO1xuICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuXG4gIHZhciBvblRvZ2dsZU1lbnVDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyLS1tZW51LW9wZW5lZCcpO1xuICAgIGhlYWRlci5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1vcGVuZWQnKTtcbiAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLWNsb3NlZCcpO1xuICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnRvZ2dsZSgnbmF2aWdhdGlvbi0tb3BlbmVkJyk7XG4gICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QudG9nZ2xlKCduYXZpZ2F0aW9uLS1jbG9zZWQnKTtcbiAgfTtcblxuICBtZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Ub2dnbGVNZW51Q2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXFfX3F1ZXN0aW9ucycpKSB7XG4gICAgdmFyIHF1ZXN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXFfX3F1ZXN0aW9ucycpO1xuXG4gICAgdmFyIG9uUXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9uJyk7XG5cbiAgICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9ucyBhJykpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhcV9fcXVlc3Rpb24tLW9wZW5lZCcpO1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnZmFxX19xdWVzdGlvbi0tY2xvc2VkJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHF1ZXN0aW9ucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUXVlc3Rpb25DbGljayk7XG4gIH1cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX193cmFwcGVyJykpIHtcbiAgICB2YXIgU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUFYID0gMTIwMDsgLy8gcHhcbiAgICB2YXIgU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUlOID0gOTAwOyAvLyBweFxuICAgIHZhciBTTElERVJfV0lEVEhfT05fTU9CSUxFID0gMzIwOyAvLyBweFxuXG4gICAgdmFyIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01BWCA9IDQ7XG4gICAgdmFyIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01JTiA9IDM7XG4gICAgdmFyIFBST0RVQ1RTX1BFUl9TTElERSA9IDI7XG5cbiAgICB2YXIgc2xpZGVzUXVhbnRpdHkgPSAzO1xuICAgIHZhciBjdXJyZW50U2xpZGUgPSAwO1xuXG4gICAgdmFyIGZpbmdlckRvdW5YID0gbnVsbDtcblxuICAgIHZhciBzbGlkZXJGcmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3dyYXBwZXInKTtcbiAgICB2YXIgc2xpZGVyID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fbGlzdCcpO1xuICAgIHZhciBwcm9kdWN0cyA9IHNsaWRlci5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19saXN0IGxpJyk7XG4gICAgdmFyIHByZXZpZXdTbGlkZUJ0biA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtYXJyb3ctLXByZXZpZXcnKTtcbiAgICB2YXIgbmV4dFNsaWRlQnRuID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1hcnJvdy0tbmV4dCcpO1xuICAgIHZhciBwYWdpbmF0aW9uID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fcGFnaW5hdGlvbicpO1xuICAgIHZhciBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG4gICAgdmFyIGN1cnJlbnRQYWdpbmF0aW9uQnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcblxuICAgIHZhciBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9IHNsaWRlckZyYW1lLm9mZnNldFdpZHRoO1xuXG4gICAgdmFyIGlzTW9iaWxlID0gY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9NT0JJTEU7XG5cbiAgICB2YXIgZ2V0UHJvZHVjdHNQZXJGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUFYKSB7XG4gICAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NQVg7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NSU4pIHtcbiAgICAgICAgcmV0dXJuIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01JTjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFBST0RVQ1RTX1BFUl9TTElERTtcbiAgICB9O1xuXG4gICAgdmFyIHJlbmRlclBhZ2luYXRpb24gPSBmdW5jdGlvbiAoUSkge1xuICAgICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgICAgdmFyIHBhZ2VzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHZhciBjdXJyZW50UGFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGN1cnJlbnRQYWdlRWxlbWVudC50ZXh0Q29udGVudCA9IGN1cnJlbnRTbGlkZSArIDE7XG4gICAgICAgIHBhZ2VzRWxlbWVudC50ZXh0Q29udGVudCA9ICcgb2YgJyArIHNsaWRlc1F1YW50aXR5O1xuICAgICAgICBwYWdlc0VsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmJlZ2luJywgY3VycmVudFBhZ2VFbGVtZW50KTtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kKHBhZ2VzRWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IFE7IGkrKykge1xuICAgICAgICAgIHZhciBwYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgdmFyIHBhZ2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICBwYWdlQnRuLnRleHRDb250ZW50ID0gaSArIDE7XG4gICAgICAgICAgcGFnZUJ0bi5kYXRhc2V0LnBhZ2UgPSBpO1xuICAgICAgICAgIHBhZ2VCdG4uY2xhc3NMaXN0LmFkZCgnc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBwYWdlQnRuLmNsYXNzTGlzdC5hZGQoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGFnZUVsZW1lbnQuYXBwZW5kKHBhZ2VCdG4pO1xuICAgICAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIHBhZ2luYXRpb24uYXBwZW5kKGZyYWdtZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIHJlbmRlclNsaWRlckNvbnRyb2xzID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2xpZGVzUXVhbnRpdHkgPSBNYXRoLmNlaWwocHJvZHVjdHMubGVuZ3RoIC8gZ2V0UHJvZHVjdHNQZXJGcmFtZSgpKTtcbiAgICAgIGlzTW9iaWxlID0gY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9NT0JJTEU7XG4gICAgICBjdXJyZW50U2xpZGUgPSAwO1xuICAgICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoMHB4KSc7XG5cbiAgICAgIHByZXZpZXdTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcbiAgICAgIG5leHRTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcblxuICAgICAgcGFnaW5hdGlvbi5pbm5lckhUTUwgPSAnJztcblxuICAgICAgcmVuZGVyUGFnaW5hdGlvbihzbGlkZXNRdWFudGl0eSk7XG4gICAgfTtcblxuICAgIHZhciBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocGFnaW5hdGlvbkJ0bnMpLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIChpdGVtLmRhdGFzZXQucGFnZSA9PT0gY3VycmVudFNsaWRlICsgJycpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBjaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaGlmdCA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoICogY3VycmVudFNsaWRlO1xuXG4gICAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRQYWdpbmF0aW9uUGFnZSA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuXG4gICAgICAgIGN1cnJlbnRQYWdpbmF0aW9uUGFnZS50ZXh0Q29udGVudCA9IGN1cnJlbnRTbGlkZSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldFBhZ2luYXRpb25CdG4oKTtcblxuICAgICAgICBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKC0nICsgc2hpZnQgKyAncHgpJztcbiAgICB9O1xuXG4gICAgdmFyIHN3aXRjaFByZXZpZXdTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldFBhZ2luYXRpb25CdG4oKTtcblxuICAgICAgaWYgKGN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSBzbGlkZXNRdWFudGl0eTtcbiAgICAgIH1cblxuICAgICAgY3VycmVudFNsaWRlLS07XG5cbiAgICAgIGNoYW5nZVNsaWRlKHRhcmdldCk7XG4gICAgfTtcblxuICAgIHZhciBzd2l0Y2hOZXh0U2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuKCk7XG5cbiAgICAgIGN1cnJlbnRTbGlkZSsrO1xuXG4gICAgICBpZiAoY3VycmVudFNsaWRlID09PSBzbGlkZXNRdWFudGl0eSkge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSAwO1xuICAgICAgfVxuXG4gICAgICBjaGFuZ2VTbGlkZSh0YXJnZXQpO1xuICAgIH07XG5cbiAgICB2YXIgb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggIT09IHNsaWRlckZyYW1lLm9mZnNldFdpZHRoKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGg7XG4gICAgICAgIHJlbmRlclNsaWRlckNvbnRyb2xzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvblByZXZpZXdTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc3dpdGNoUHJldmlld1NsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvbk5leHRTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc3dpdGNoTmV4dFNsaWRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvblRvdWNoU3RhcnQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBmaW5nZXJEb3VuWCA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgfTtcblxuICAgIHZhciBvblRvdWNoTW92ZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmICghZmluZ2VyRG91blgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmluZ2VyVXBYID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgIHZhciBzd2lwZUxlbmd0aFggPSBmaW5nZXJEb3VuWCAtIGZpbmdlclVwWDtcblxuICAgICAgaWYgKHN3aXBlTGVuZ3RoWCA+IDApIHtcbiAgICAgICAgc3dpdGNoUHJldmlld1NsaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2hOZXh0U2xpZGUoKTtcbiAgICAgIH1cblxuICAgICAgZmluZ2VyRG91blggPSBudWxsO1xuICAgIH07XG5cbiAgICB2YXIgb25QYWdpbmF0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuXG4gICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gY3VycmVudFBhZ2luYXRpb25CdG4pIHtcbiAgICAgICAgY3VycmVudFNsaWRlID0gdGFyZ2V0LmRhdGFzZXQucGFnZTtcbiAgICAgICAgY2hhbmdlU2xpZGUodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVuZGVyU2xpZGVyQ29udHJvbHMoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG5cbiAgICBwcmV2aWV3U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblByZXZpZXdTbGlkZUJ0bkNsaWNrKTtcbiAgICBuZXh0U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk5leHRTbGlkZUJ0bkNsaWNrKTtcblxuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG4gICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cbiAgICBwYWdpbmF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25QYWdpbmF0aW9uQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlcicpKSB7XG4gICAgdmFyIGNhdGFsb2dGaWx0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fZmlsdGVyLW92ZXJsYXknKTtcbiAgICB2YXIgY2F0YWxvZ0ZpbHRlck9wZW5CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0YWxvZ19fZmlsdGVyLW9wZW4tYnRuJyk7XG4gICAgdmFyIGNhdGFsb2dGaWx0ZXJjbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXItY2xvc2UtYnRuJyk7XG5cbiAgICB2YXIgb25DYXRhbG9nRmlsdGVyQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2F0YWxvZ19fZmlsdGVyLWZpbGRzZXQnKTtcblxuICAgICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlci1maWxkc2V0IGxlZ2VuZCcpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tb3BlbmVkJyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdjYXRhbG9nX19maWx0ZXItZmlsZHNldC0tY2xvc2VkJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbmNhdGFsb2dGaWx0ZXJPcGVuQnRuQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlci5jbGFzc0xpc3QuYWRkKCdjYXRhbG9nX19maWx0ZXItb3ZlcmxheS0tb3BlbmVkJyk7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1jbG9zZWQnKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlcmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyY2xvc2VCdG5DbGljayk7XG4gICAgfTtcblxuICAgIHZhciBvbmNhdGFsb2dGaWx0ZXJjbG9zZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2F0YWxvZ0ZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdjYXRhbG9nX19maWx0ZXItb3ZlcmxheS0tb3BlbmVkJyk7XG4gICAgICBjYXRhbG9nRmlsdGVyLmNsYXNzTGlzdC5hZGQoJ2NhdGFsb2dfX2ZpbHRlci1vdmVybGF5LS1jbG9zZWQnKTtcblxuICAgICAgY2F0YWxvZ0ZpbHRlcmNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jYXRhbG9nRmlsdGVyY2xvc2VCdG5DbGljayk7XG4gICAgfTtcblxuICAgIGNhdGFsb2dGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNhdGFsb2dGaWx0ZXJDbGljayk7XG4gICAgY2F0YWxvZ0ZpbHRlck9wZW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNhdGFsb2dGaWx0ZXJPcGVuQnRuQ2xpY2spO1xuICB9XG59KSgpO1xuIl19

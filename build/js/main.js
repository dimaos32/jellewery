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
    var catalogFilter = document.querySelector('.catalog__filter');

    var onCatalogFilterClick = function (evt) {
      var target = evt.target.closest('.catalog__filter-fildset');

      if (evt.target.closest('.catalog__filter-fildset legend')) {
        evt.preventDefault();

        target.classList.toggle('catalog__filter-fildset--opened');
        target.classList.toggle('catalog__filter-fildset--closed');
      }
    };

    catalogFilter.addEventListener('click', onCatalogFilterClick);
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1cmdlci1tZW51LmpzIiwiZmFxLmpzIiwic2xpZGVyLmpzIiwiY2F0YWxvZy1maWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XG4gIHZhciBtZW51VG9nZ2xlID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21lbnUtdG9nZ2xlJyk7XG4gIHZhciBuYXZpZ2F0aW9uID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uJyk7XG5cbiAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci0tbWVudS1jbG9zZWQnKTtcbiAgbWVudVRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgbmF2aWdhdGlvbi5jbGFzc0xpc3QuYWRkKCduYXZpZ2F0aW9uLS1jbG9zZWQnKTtcblxuICB2YXIgb25Ub2dnbGVNZW51Q2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlci0tbWVudS1vcGVuZWQnKTtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyLS1tZW51LWNsb3NlZCcpO1xuICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyX19tZW51LXRvZ2dsZS0tb3BlbmVkJyk7XG4gICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC50b2dnbGUoJ25hdmlnYXRpb24tLW9wZW5lZCcpO1xuICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnRvZ2dsZSgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG4gIH07XG5cbiAgbWVudVRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVG9nZ2xlTWVudUNsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmFxX19xdWVzdGlvbnMnKSkge1xuICAgIHZhciBxdWVzdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmFxX19xdWVzdGlvbnMnKTtcblxuICAgIHZhciBvblF1ZXN0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmFxX19xdWVzdGlvbicpO1xuXG4gICAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmFxX19xdWVzdGlvbnMgYScpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1vcGVuZWQnKTtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhcV9fcXVlc3Rpb24tLWNsb3NlZCcpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBxdWVzdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblF1ZXN0aW9uQ2xpY2spO1xuICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fd3JhcHBlcicpKSB7XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01BWCA9IDEyMDA7IC8vIHB4XG4gICAgdmFyIFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01JTiA9IDkwMDsgLy8gcHhcbiAgICB2YXIgU0xJREVSX1dJRFRIX09OX01PQklMRSA9IDMyMDsgLy8gcHhcblxuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NQVggPSA0O1xuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NSU4gPSAzO1xuICAgIHZhciBQUk9EVUNUU19QRVJfU0xJREUgPSAyO1xuXG4gICAgdmFyIHNsaWRlc1F1YW50aXR5ID0gMztcbiAgICB2YXIgY3VycmVudFNsaWRlID0gMDtcblxuICAgIHZhciBmaW5nZXJEb3VuWCA9IG51bGw7XG5cbiAgICB2YXIgc2xpZGVyRnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX193cmFwcGVyJyk7XG4gICAgdmFyIHNsaWRlciA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2xpc3QnKTtcbiAgICB2YXIgcHJvZHVjdHMgPSBzbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fbGlzdCBsaScpO1xuICAgIHZhciBwcmV2aWV3U2xpZGVCdG4gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLWFycm93LS1wcmV2aWV3Jyk7XG4gICAgdmFyIG5leHRTbGlkZUJ0biA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5leHQnKTtcbiAgICB2YXIgcGFnaW5hdGlvbiA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3BhZ2luYXRpb24nKTtcbiAgICB2YXIgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICAgIHZhciBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG5cbiAgICB2YXIgY3VycmVudFNsaWRlckZyYW1lV2lkdGggPSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aDtcblxuICAgIHZhciBpc01vYmlsZSA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fTU9CSUxFO1xuXG4gICAgdmFyIGdldFByb2R1Y3RzUGVyRnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01BWCkge1xuICAgICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUFYO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUlOKSB7XG4gICAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NSU47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREU7XG4gICAgfTtcblxuICAgIHZhciByZW5kZXJQYWdpbmF0aW9uID0gZnVuY3Rpb24gKFEpIHtcbiAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBwYWdlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgY3VycmVudFBhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBjdXJyZW50UGFnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUgKyAxO1xuICAgICAgICBwYWdlc0VsZW1lbnQudGV4dENvbnRlbnQgPSAnIG9mICcgKyBzbGlkZXNRdWFudGl0eTtcbiAgICAgICAgcGFnZXNFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIGN1cnJlbnRQYWdlRWxlbWVudCk7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlc0VsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBROyBpKyspIHtcbiAgICAgICAgICB2YXIgcGFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgIHZhciBwYWdlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgcGFnZUJ0bi50ZXh0Q29udGVudCA9IGkgKyAxO1xuICAgICAgICAgIHBhZ2VCdG4uZGF0YXNldC5wYWdlID0gaTtcbiAgICAgICAgICBwYWdlQnRuLmNsYXNzTGlzdC5hZGQoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgcGFnZUJ0bi5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhZ2VFbGVtZW50LmFwcGVuZChwYWdlQnRuKTtcbiAgICAgICAgICBmcmFnbWVudC5hcHBlbmQocGFnZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICAgICAgfVxuXG4gICAgICBwYWdpbmF0aW9uLmFwcGVuZChmcmFnbWVudCk7XG4gICAgfTtcblxuICAgIHZhciByZW5kZXJTbGlkZXJDb250cm9scyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNsaWRlc1F1YW50aXR5ID0gTWF0aC5jZWlsKHByb2R1Y3RzLmxlbmd0aCAvIGdldFByb2R1Y3RzUGVyRnJhbWUoKSk7XG4gICAgICBpc01vYmlsZSA9IGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fTU9CSUxFO1xuICAgICAgY3VycmVudFNsaWRlID0gMDtcbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKDBweCknO1xuXG4gICAgICBwcmV2aWV3U2xpZGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLWFycm93LS1ub2pzJyk7XG4gICAgICBuZXh0U2xpZGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLWFycm93LS1ub2pzJyk7XG5cbiAgICAgIHBhZ2luYXRpb24uaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgIHJlbmRlclBhZ2luYXRpb24oc2xpZGVzUXVhbnRpdHkpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0VGFyZ2V0UGFnaW5hdGlvbkJ0biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHBhZ2luYXRpb25CdG5zKS5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAoaXRlbS5kYXRhc2V0LnBhZ2UgPT09IGN1cnJlbnRTbGlkZSArICcnKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgY2hhbmdlU2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2hpZnQgPSBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCAqIGN1cnJlbnRTbGlkZTtcblxuICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIHZhciBjdXJyZW50UGFnaW5hdGlvblBhZ2UgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcblxuICAgICAgICBjdXJyZW50UGFnaW5hdGlvblBhZ2UudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuKCk7XG5cbiAgICAgICAgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuXG4gICAgICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuICAgICAgfVxuXG4gICAgICBzbGlkZXIuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtJyArIHNoaWZ0ICsgJ3B4KSc7XG4gICAgfTtcblxuICAgIHZhciBzd2l0Y2hQcmV2aWV3U2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuKCk7XG5cbiAgICAgIGlmIChjdXJyZW50U2xpZGUgPT09IDApIHtcbiAgICAgICAgY3VycmVudFNsaWRlID0gc2xpZGVzUXVhbnRpdHk7XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRTbGlkZS0tO1xuXG4gICAgICBjaGFuZ2VTbGlkZSh0YXJnZXQpO1xuICAgIH07XG5cbiAgICB2YXIgc3dpdGNoTmV4dFNsaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0UGFnaW5hdGlvbkJ0bigpO1xuXG4gICAgICBjdXJyZW50U2xpZGUrKztcblxuICAgICAgaWYgKGN1cnJlbnRTbGlkZSA9PT0gc2xpZGVzUXVhbnRpdHkpIHtcbiAgICAgICAgY3VycmVudFNsaWRlID0gMDtcbiAgICAgIH1cblxuICAgICAgY2hhbmdlU2xpZGUodGFyZ2V0KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uV2luZG93UmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoICE9PSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aCkge1xuICAgICAgICBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9IHNsaWRlckZyYW1lLm9mZnNldFdpZHRoO1xuICAgICAgICByZW5kZXJTbGlkZXJDb250cm9scygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25QcmV2aWV3U2xpZGVCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHN3aXRjaFByZXZpZXdTbGlkZSgpO1xuICAgIH07XG5cbiAgICB2YXIgb25OZXh0U2xpZGVCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHN3aXRjaE5leHRTbGlkZSgpO1xuICAgIH07XG5cbiAgICB2YXIgb25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZmluZ2VyRG91blggPSBldnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgIH07XG5cbiAgICB2YXIgb25Ub3VjaE1vdmUgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoIWZpbmdlckRvdW5YKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpbmdlclVwWCA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICB2YXIgc3dpcGVMZW5ndGhYID0gZmluZ2VyRG91blggLSBmaW5nZXJVcFg7XG5cbiAgICAgIGlmIChzd2lwZUxlbmd0aFggPiAwKSB7XG4gICAgICAgIHN3aXRjaFByZXZpZXdTbGlkZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoTmV4dFNsaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGZpbmdlckRvdW5YID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdmFyIG9uUGFnaW5hdGlvbkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcblxuICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQgIT09IGN1cnJlbnRQYWdpbmF0aW9uQnRuKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IHRhcmdldC5kYXRhc2V0LnBhZ2U7XG4gICAgICAgIGNoYW5nZVNsaWRlKHRhcmdldCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlbmRlclNsaWRlckNvbnRyb2xzKCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xuXG4gICAgcHJldmlld1NsaWRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25QcmV2aWV3U2xpZGVCdG5DbGljayk7XG4gICAgbmV4dFNsaWRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25OZXh0U2xpZGVCdG5DbGljayk7XG5cbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCwgZmFsc2UpO1xuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwgZmFsc2UpO1xuXG4gICAgcGFnaW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUGFnaW5hdGlvbkNsaWNrKTtcbiAgfVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19maWx0ZXInKSkge1xuICAgIHZhciBjYXRhbG9nRmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGFsb2dfX2ZpbHRlcicpO1xuXG4gICAgdmFyIG9uQ2F0YWxvZ0ZpbHRlckNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLmNhdGFsb2dfX2ZpbHRlci1maWxkc2V0Jyk7XG5cbiAgICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5jYXRhbG9nX19maWx0ZXItZmlsZHNldCBsZWdlbmQnKSkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnY2F0YWxvZ19fZmlsdGVyLWZpbGRzZXQtLW9wZW5lZCcpO1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnY2F0YWxvZ19fZmlsdGVyLWZpbGRzZXQtLWNsb3NlZCcpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjYXRhbG9nRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DYXRhbG9nRmlsdGVyQ2xpY2spO1xuICB9XG59KSgpO1xuIl19

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
})();

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1cmdlci1tZW51LmpzIiwiZmFxLmpzIiwic2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xuICB2YXIgbWVudVRvZ2dsZSA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tZW51LXRvZ2dsZScpO1xuICB2YXIgbmF2aWdhdGlvbiA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbicpO1xuXG4gIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gIG1lbnVUb2dnbGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gIG5hdmlnYXRpb24uY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG5cbiAgdmFyIG9uVG9nZ2xlTWVudUNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGhlYWRlci5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXItLW1lbnUtb3BlbmVkJyk7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlci0tbWVudS1jbG9zZWQnKTtcbiAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLW9wZW5lZCcpO1xuICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QudG9nZ2xlKCduYXZpZ2F0aW9uLS1vcGVuZWQnKTtcbiAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC50b2dnbGUoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuICB9O1xuXG4gIG1lbnVUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblRvZ2dsZU1lbnVDbGljayk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgcXVlc3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhcV9fcXVlc3Rpb25zJyk7XG5cbiAgdmFyIG9uUXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmFxX19xdWVzdGlvbicpO1xuXG4gICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmZhcV9fcXVlc3Rpb25zIGEnKSkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1vcGVuZWQnKTtcbiAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1jbG9zZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgcXVlc3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25RdWVzdGlvbkNsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NQVggPSAxMjAwOyAvLyBweFxuICB2YXIgU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUlOID0gOTAwOyAvLyBweFxuICB2YXIgU0xJREVSX1dJRFRIX09OX01PQklMRSA9IDMyMDsgLy8gcHhcblxuICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUFYID0gNDtcbiAgdmFyIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01JTiA9IDM7XG4gIHZhciBQUk9EVUNUU19QRVJfU0xJREUgPSAyO1xuXG4gIHZhciBzbGlkZXNRdWFudGl0eSA9IDM7XG4gIHZhciBjdXJyZW50U2xpZGUgPSAwO1xuXG4gIHZhciBmaW5nZXJEb3VuWCA9IG51bGw7XG5cbiAgdmFyIHNsaWRlckZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fd3JhcHBlcicpO1xuICB2YXIgc2xpZGVyID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fbGlzdCcpO1xuICB2YXIgcHJvZHVjdHMgPSBzbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fbGlzdCBsaScpO1xuICB2YXIgcHJldmlld1NsaWRlQnRuID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1hcnJvdy0tcHJldmlldycpO1xuICB2YXIgbmV4dFNsaWRlQnRuID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1hcnJvdy0tbmV4dCcpO1xuICB2YXIgcGFnaW5hdGlvbiA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3BhZ2luYXRpb24nKTtcbiAgdmFyIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcbiAgdmFyIGN1cnJlbnRQYWdpbmF0aW9uQnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcblxuICB2YXIgY3VycmVudFNsaWRlckZyYW1lV2lkdGggPSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aDtcblxuICB2YXIgaXNNb2JpbGUgPSBjdXJyZW50U2xpZGVyRnJhbWVXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX01PQklMRTtcblxuICB2YXIgZ2V0UHJvZHVjdHNQZXJGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9ERVNLVE9QX01BWCkge1xuICAgICAgcmV0dXJuIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01BWDtcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoID09PSBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NSU4pIHtcbiAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NSU47XG4gICAgfVxuXG4gICAgcmV0dXJuIFBST0RVQ1RTX1BFUl9TTElERTtcbiAgfTtcblxuICB2YXIgcmVuZGVyUGFnaW5hdGlvbiA9IGZ1bmN0aW9uIChRKSB7XG4gICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICB2YXIgcGFnZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHZhciBjdXJyZW50UGFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBjdXJyZW50UGFnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUgKyAxO1xuICAgICAgcGFnZXNFbGVtZW50LnRleHRDb250ZW50ID0gJyBvZiAnICsgc2xpZGVzUXVhbnRpdHk7XG4gICAgICBwYWdlc0VsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmJlZ2luJywgY3VycmVudFBhZ2VFbGVtZW50KTtcbiAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlc0VsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IFE7IGkrKykge1xuICAgICAgICB2YXIgcGFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICB2YXIgcGFnZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBwYWdlQnRuLnRleHRDb250ZW50ID0gaSArIDE7XG4gICAgICAgIHBhZ2VCdG4uZGF0YXNldC5wYWdlID0gaTtcbiAgICAgICAgcGFnZUJ0bi5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgcGFnZUJ0bi5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnZUVsZW1lbnQuYXBwZW5kKHBhZ2VCdG4pO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmQocGFnZUVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG4gICAgfVxuXG4gICAgcGFnaW5hdGlvbi5hcHBlbmQoZnJhZ21lbnQpO1xuICB9O1xuXG4gIHZhciByZW5kZXJTbGlkZXJDb250cm9scyA9IGZ1bmN0aW9uICgpIHtcbiAgICBzbGlkZXNRdWFudGl0eSA9IE1hdGguY2VpbChwcm9kdWN0cy5sZW5ndGggLyBnZXRQcm9kdWN0c1BlckZyYW1lKCkpO1xuICAgIGlzTW9iaWxlID0gY3VycmVudFNsaWRlckZyYW1lV2lkdGggPT09IFNMSURFUl9XSURUSF9PTl9NT0JJTEU7XG4gICAgY3VycmVudFNsaWRlID0gMDtcbiAgICBzbGlkZXIuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgwcHgpJztcblxuICAgIHByZXZpZXdTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcbiAgICBuZXh0U2xpZGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyX19jb250cm9sLWFycm93LS1ub2pzJyk7XG5cbiAgICBwYWdpbmF0aW9uLmlubmVySFRNTCA9ICcnO1xuXG4gICAgcmVuZGVyUGFnaW5hdGlvbihzbGlkZXNRdWFudGl0eSk7XG4gIH07XG5cbiAgdmFyIGdldFRhcmdldFBhZ2luYXRpb25CdG4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20ocGFnaW5hdGlvbkJ0bnMpLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiAoaXRlbS5kYXRhc2V0LnBhZ2UgPT09IGN1cnJlbnRTbGlkZSArICcnKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgY2hhbmdlU2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNoaWZ0ID0gY3VycmVudFNsaWRlckZyYW1lV2lkdGggKiBjdXJyZW50U2xpZGU7XG5cbiAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgIHZhciBjdXJyZW50UGFnaW5hdGlvblBhZ2UgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcblxuICAgICAgY3VycmVudFBhZ2luYXRpb25QYWdlLnRleHRDb250ZW50ID0gY3VycmVudFNsaWRlICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0UGFnaW5hdGlvbkJ0bigpO1xuXG4gICAgICBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG5cbiAgICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcbiAgICB9XG5cbiAgICBzbGlkZXIuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtJyArIHNoaWZ0ICsgJ3B4KSc7XG4gIH07XG5cbiAgdmFyIHN3aXRjaFByZXZpZXdTbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0UGFnaW5hdGlvbkJ0bigpO1xuXG4gICAgaWYgKGN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgY3VycmVudFNsaWRlID0gc2xpZGVzUXVhbnRpdHk7XG4gICAgfVxuXG4gICAgY3VycmVudFNsaWRlLS07XG5cbiAgICBjaGFuZ2VTbGlkZSh0YXJnZXQpO1xuICB9O1xuXG4gIHZhciBzd2l0Y2hOZXh0U2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldFBhZ2luYXRpb25CdG4oKTtcblxuICAgIGN1cnJlbnRTbGlkZSsrO1xuXG4gICAgaWYgKGN1cnJlbnRTbGlkZSA9PT0gc2xpZGVzUXVhbnRpdHkpIHtcbiAgICAgIGN1cnJlbnRTbGlkZSA9IDA7XG4gICAgfVxuXG4gICAgY2hhbmdlU2xpZGUodGFyZ2V0KTtcbiAgfTtcblxuICB2YXIgb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGN1cnJlbnRTbGlkZXJGcmFtZVdpZHRoICE9PSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aCkge1xuICAgICAgY3VycmVudFNsaWRlckZyYW1lV2lkdGggPSBzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aDtcbiAgICAgIHJlbmRlclNsaWRlckNvbnRyb2xzKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvblByZXZpZXdTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHN3aXRjaFByZXZpZXdTbGlkZSgpO1xuICB9O1xuXG4gIHZhciBvbk5leHRTbGlkZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHN3aXRjaE5leHRTbGlkZSgpO1xuICB9O1xuXG4gIHZhciBvblRvdWNoU3RhcnQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgZmluZ2VyRG91blggPSBldnQudG91Y2hlc1swXS5jbGllbnRYO1xuICB9O1xuXG4gIHZhciBvblRvdWNoTW92ZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoIWZpbmdlckRvdW5YKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGZpbmdlclVwWCA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgdmFyIHN3aXBlTGVuZ3RoWCA9IGZpbmdlckRvdW5YIC0gZmluZ2VyVXBYO1xuXG4gICAgaWYgKHN3aXBlTGVuZ3RoWCA+IDApIHtcbiAgICAgIHN3aXRjaFByZXZpZXdTbGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2hOZXh0U2xpZGUoKTtcbiAgICB9XG5cbiAgICBmaW5nZXJEb3VuWCA9IG51bGw7XG4gIH07XG5cbiAgdmFyIG9uUGFnaW5hdGlvbkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuXG4gICAgaWYgKHRhcmdldCAmJiB0YXJnZXQgIT09IGN1cnJlbnRQYWdpbmF0aW9uQnRuKSB7XG4gICAgICBjdXJyZW50U2xpZGUgPSB0YXJnZXQuZGF0YXNldC5wYWdlO1xuICAgICAgY2hhbmdlU2xpZGUodGFyZ2V0KTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyU2xpZGVyQ29udHJvbHMoKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xuXG4gIHByZXZpZXdTbGlkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUHJldmlld1NsaWRlQnRuQ2xpY2spO1xuICBuZXh0U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk5leHRTbGlkZUJ0bkNsaWNrKTtcblxuICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCwgZmFsc2UpO1xuICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUsIGZhbHNlKTtcblxuICBwYWdpbmF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25QYWdpbmF0aW9uQ2xpY2spO1xufSkoKTtcbiJdfQ==

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1cmdlci1tZW51LmpzIiwiZmFxLmpzIiwic2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xuICB2YXIgbWVudVRvZ2dsZSA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tZW51LXRvZ2dsZScpO1xuICB2YXIgbmF2aWdhdGlvbiA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbicpO1xuXG4gIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gIG1lbnVUb2dnbGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gIG5hdmlnYXRpb24uY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG5cbiAgdmFyIG9uVG9nZ2xlTWVudUNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGhlYWRlci5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXItLW1lbnUtb3BlbmVkJyk7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlci0tbWVudS1jbG9zZWQnKTtcbiAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLW9wZW5lZCcpO1xuICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyX19tZW51LXRvZ2dsZS0tY2xvc2VkJyk7XG4gICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QudG9nZ2xlKCduYXZpZ2F0aW9uLS1vcGVuZWQnKTtcbiAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC50b2dnbGUoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuICB9O1xuXG4gIG1lbnVUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblRvZ2dsZU1lbnVDbGljayk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgcXVlc3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhcV9fcXVlc3Rpb25zJyk7XG5cbiAgdmFyIG9uUXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmFxX19xdWVzdGlvbicpO1xuXG4gICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmZhcV9fcXVlc3Rpb25zIGEnKSkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1vcGVuZWQnKTtcbiAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYXFfX3F1ZXN0aW9uLS1jbG9zZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgcXVlc3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25RdWVzdGlvbkNsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NQVggPSAxMjAwOyAvLyBweFxuICB2YXIgU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUlOID0gOTAwOyAvLyBweFxuICB2YXIgU0xJREVSX1dJRFRIX09OX01PQklMRSA9IDMyMDsgLy8gcHhcblxuICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUFYID0gNDtcbiAgdmFyIFBST0RVQ1RTX1BFUl9TTElERV9PTl9ERVNLVE9QX01JTiA9IDM7XG4gIHZhciBQUk9EVUNUU19QRVJfU0xJREUgPSAyO1xuXG4gIHZhciBzbGlkZXNRdWFudGl0eSA9IDM7XG4gIHZhciBjdXJyZW50U2xpZGUgPSAwO1xuXG4gIHZhciBzbGlkZXJGcmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX3dyYXBwZXInKTtcbiAgdmFyIHNsaWRlciA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2xpc3QnKTtcbiAgdmFyIHByb2R1Y3RzID0gc2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2xpc3QgbGknKTtcbiAgdmFyIHByZXZpZXdTbGlkZUJ0biA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtYXJyb3ctLXByZXZpZXcnKTtcbiAgdmFyIG5leHRTbGlkZUJ0biA9IHNsaWRlckZyYW1lLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5leHQnKTtcbiAgdmFyIHBhZ2luYXRpb24gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19wYWdpbmF0aW9uJyk7XG4gIHZhciBwYWdpbmF0aW9uQnRucyA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG4gIHZhciBjdXJyZW50UGFnaW5hdGlvbkJ0biA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG5cbiAgdmFyIGdldFByb2R1Y3RzUGVyRnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNsaWRlckZyYW1lLm9mZnNldFdpZHRoID09PSBTTElERVJfV0lEVEhfT05fREVTS1RPUF9NQVgpIHtcbiAgICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREVfT05fREVTS1RPUF9NQVg7XG4gICAgfSBlbHNlIGlmIChzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aCA9PT0gU0xJREVSX1dJRFRIX09OX0RFU0tUT1BfTUlOKSB7XG4gICAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFX09OX0RFU0tUT1BfTUlOO1xuICAgIH1cblxuICAgIHJldHVybiBQUk9EVUNUU19QRVJfU0xJREU7XG4gIH07XG5cbiAgdmFyIHJlbmRlclBhZ2luYXRpb24gPSBmdW5jdGlvbiAoUSkge1xuICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIHBhZ2luYXRpb24uaW5uZXJIVE1MID0gJyc7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IFE7IGkrKykge1xuICAgICAgdmFyIHBhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHZhciBwYWdlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBwYWdlQnRuLnRleHRDb250ZW50ID0gaSArIDE7XG4gICAgICBwYWdlQnRuLmRhdGFzZXQucGFnZSA9IGk7XG4gICAgICBwYWdlQnRuLmNsYXNzTGlzdC5hZGQoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uJyk7XG5cbiAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgIHBhZ2VCdG4uY2xhc3NMaXN0LmFkZCgnc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcbiAgICAgIH1cblxuICAgICAgcGFnZUVsZW1lbnQuYXBwZW5kKHBhZ2VCdG4pO1xuICAgICAgZnJhZ21lbnQuYXBwZW5kKHBhZ2VFbGVtZW50KTtcbiAgICB9XG5cbiAgICBwYWdpbmF0aW9uLmFwcGVuZChmcmFnbWVudCk7XG4gICAgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICB9O1xuXG4gIHZhciByZW5kZXJTbGlkZXJDb250cm9scyA9IGZ1bmN0aW9uICgpIHtcbiAgICBzbGlkZXNRdWFudGl0eSA9IE1hdGguY2VpbChwcm9kdWN0cy5sZW5ndGggLyBnZXRQcm9kdWN0c1BlckZyYW1lKCkpO1xuICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKDBweCknO1xuXG4gICAgcHJldmlld1NsaWRlQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NsaWRlcl9fY29udHJvbC1hcnJvdy0tbm9qcycpO1xuICAgIG5leHRTbGlkZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXJfX2NvbnRyb2wtYXJyb3ctLW5vanMnKTtcblxuICAgIHJlbmRlclBhZ2luYXRpb24oc2xpZGVzUXVhbnRpdHkpO1xuICB9O1xuXG4gIHZhciBjaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyIHNoaWZ0ID0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGggKiBlbGVtZW50LmRhdGFzZXQucGFnZTtcblxuICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcblxuICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuXG4gICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLScgKyBzaGlmdCArICdweCknO1xuICB9O1xuXG4gIHZhciBnZXRUYXJnZXRQYWdpbmF0aW9uQnRuID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHBhZ2luYXRpb25CdG5zKS5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gKGl0ZW0uZGF0YXNldC5wYWdlID09PSBjdXJyZW50U2xpZGUgKyAnJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIG9uUHJldmlld1NsaWRlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldFBhZ2luYXRpb25CdG4oKTtcblxuICAgIGlmIChjdXJyZW50U2xpZGUgPT09IDApIHtcbiAgICAgIGN1cnJlbnRTbGlkZSA9IHNsaWRlc1F1YW50aXR5O1xuICAgIH1cblxuICAgIGN1cnJlbnRTbGlkZS0tO1xuXG4gICAgY2hhbmdlU2xpZGUodGFyZ2V0KTtcbiAgfTtcblxuICB2YXIgb25OZXh0U2xpZGVCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0UGFnaW5hdGlvbkJ0bigpO1xuXG4gICAgY3VycmVudFNsaWRlKys7XG5cbiAgICBpZiAoY3VycmVudFNsaWRlID09PSBzbGlkZXNRdWFudGl0eSkge1xuICAgICAgY3VycmVudFNsaWRlID0gMDtcbiAgICB9XG5cbiAgICBjaGFuZ2VTbGlkZSh0YXJnZXQpO1xuICB9O1xuXG4gIHZhciBvblBhZ2luYXRpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcblxuICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSBjdXJyZW50UGFnaW5hdGlvbkJ0bikge1xuICAgICAgY3VycmVudFNsaWRlID0gdGFyZ2V0LmRhdGFzZXQucGFnZTtcbiAgICAgIGNoYW5nZVNsaWRlKHRhcmdldCk7XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlclNsaWRlckNvbnRyb2xzKCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlbmRlclNsaWRlckNvbnRyb2xzKTtcblxuICBwcmV2aWV3U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblByZXZpZXdTbGlkZUJ0bkNsaWNrKTtcbiAgbmV4dFNsaWRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25OZXh0U2xpZGVCdG5DbGljayk7XG4gIHBhZ2luYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblBhZ2luYXRpb25DbGljayk7XG59KSgpO1xuIl19

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
  var DESKTOP_MAX_SLIDER_WIDTH = 1200; // px
  var DESKTOP_MIN_SLIDER_WIDTH = 900; // px

  var DESKTOP_MAX_PRODUCTS_PER_SLIDE = 4;
  var DESKTOP_MIN_PRODUCTS_PER_SLIDE = 3;
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

  var productsPerFrame = function () {
    if (sliderFrame.offsetWidth === DESKTOP_MAX_SLIDER_WIDTH) {
      return DESKTOP_MAX_PRODUCTS_PER_SLIDE;
    } else if (sliderFrame.offsetWidth === DESKTOP_MIN_SLIDER_WIDTH) {
      return DESKTOP_MIN_PRODUCTS_PER_SLIDE;
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
    slidesQuantity = Math.ceil(products.length / productsPerFrame());

    slider.style.transform = 'translate(0px)';
    renderPagination(slidesQuantity);
  };

  var changeSlide = function (element) {
    var shift = sliderFrame.offsetWidth * element.dataset.page;

    currentPaginationBtn = pagination.querySelector('.slider__control-pagination--current');

    currentPaginationBtn.classList.remove('slider__control-pagination--current');
    element.classList.add('slider__control-pagination--current');

    slider.style.transform = 'translate(-' + shift + 'px)';
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

  previewSlideBtn.addEventListener('click', function () {
    if (currentSlide === 0) {
      currentSlide = slidesQuantity;
    }

    currentSlide--;

    for (var i = 0; i < paginationBtns.length; i++) {
      if (paginationBtns[i].dataset.page === currentSlide + '') {
        var target = paginationBtns[i];
        break;
      }
    }

    changeSlide(target);
  });

  nextSlideBtn.addEventListener('click', function () {
    currentSlide++;

    if (currentSlide === slidesQuantity) {
      currentSlide = 0;
    }

    for (var i = 0; i < paginationBtns.length; i++) {
      if (paginationBtns[i].dataset.page === currentSlide + '') {
        var target = paginationBtns[i];
        break;
      }
    }

    changeSlide(target);
  });

  pagination.addEventListener('click', onPaginationClick);
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1cmdlci1tZW51LmpzIiwiZmFxLmpzIiwic2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XG4gIHZhciBtZW51VG9nZ2xlID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21lbnUtdG9nZ2xlJyk7XG4gIHZhciBuYXZpZ2F0aW9uID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uJyk7XG5cbiAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci0tbWVudS1jbG9zZWQnKTtcbiAgbWVudVRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgbmF2aWdhdGlvbi5jbGFzc0xpc3QuYWRkKCduYXZpZ2F0aW9uLS1jbG9zZWQnKTtcblxuICB2YXIgb25Ub2dnbGVNZW51Q2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlci0tbWVudS1vcGVuZWQnKTtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyLS1tZW51LWNsb3NlZCcpO1xuICAgIG1lbnVUb2dnbGUuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyX19tZW51LXRvZ2dsZS0tb3BlbmVkJyk7XG4gICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1jbG9zZWQnKTtcbiAgICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC50b2dnbGUoJ25hdmlnYXRpb24tLW9wZW5lZCcpO1xuICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnRvZ2dsZSgnbmF2aWdhdGlvbi0tY2xvc2VkJyk7XG4gIH07XG5cbiAgbWVudVRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVG9nZ2xlTWVudUNsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBxdWVzdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmFxX19xdWVzdGlvbnMnKTtcblxuICB2YXIgb25RdWVzdGlvbkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9uJyk7XG5cbiAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmFxX19xdWVzdGlvbnMgYScpKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhcV9fcXVlc3Rpb24tLW9wZW5lZCcpO1xuICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhcV9fcXVlc3Rpb24tLWNsb3NlZCcpO1xuICAgIH1cbiAgfTtcblxuICBxdWVzdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblF1ZXN0aW9uQ2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIERFU0tUT1BfTUFYX1NMSURFUl9XSURUSCA9IDEyMDA7IC8vIHB4XG4gIHZhciBERVNLVE9QX01JTl9TTElERVJfV0lEVEggPSA5MDA7IC8vIHB4XG5cbiAgdmFyIERFU0tUT1BfTUFYX1BST0RVQ1RTX1BFUl9TTElERSA9IDQ7XG4gIHZhciBERVNLVE9QX01JTl9QUk9EVUNUU19QRVJfU0xJREUgPSAzO1xuICB2YXIgUFJPRFVDVFNfUEVSX1NMSURFID0gMjtcblxuICB2YXIgc2xpZGVzUXVhbnRpdHkgPSAzO1xuICB2YXIgY3VycmVudFNsaWRlID0gMDtcblxuICB2YXIgc2xpZGVyRnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX193cmFwcGVyJyk7XG4gIHZhciBzbGlkZXIgPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19saXN0Jyk7XG4gIHZhciBwcm9kdWN0cyA9IHNsaWRlci5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19saXN0IGxpJyk7XG4gIHZhciBwcmV2aWV3U2xpZGVCdG4gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLWFycm93LS1wcmV2aWV3Jyk7XG4gIHZhciBuZXh0U2xpZGVCdG4gPSBzbGlkZXJGcmFtZS5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLWFycm93LS1uZXh0Jyk7XG4gIHZhciBwYWdpbmF0aW9uID0gc2xpZGVyRnJhbWUucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fcGFnaW5hdGlvbicpO1xuICB2YXIgcGFnaW5hdGlvbkJ0bnMgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuICB2YXIgY3VycmVudFBhZ2luYXRpb25CdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuXG4gIHZhciBwcm9kdWN0c1BlckZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzbGlkZXJGcmFtZS5vZmZzZXRXaWR0aCA9PT0gREVTS1RPUF9NQVhfU0xJREVSX1dJRFRIKSB7XG4gICAgICByZXR1cm4gREVTS1RPUF9NQVhfUFJPRFVDVFNfUEVSX1NMSURFO1xuICAgIH0gZWxzZSBpZiAoc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGggPT09IERFU0tUT1BfTUlOX1NMSURFUl9XSURUSCkge1xuICAgICAgcmV0dXJuIERFU0tUT1BfTUlOX1BST0RVQ1RTX1BFUl9TTElERTtcbiAgICB9XG5cbiAgICByZXR1cm4gUFJPRFVDVFNfUEVSX1NMSURFO1xuICB9O1xuXG4gIHZhciByZW5kZXJQYWdpbmF0aW9uID0gZnVuY3Rpb24gKFEpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICBwYWdpbmF0aW9uLmlubmVySFRNTCA9ICcnO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBROyBpKyspIHtcbiAgICAgIHZhciBwYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICB2YXIgcGFnZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcGFnZUJ0bi50ZXh0Q29udGVudCA9IGkgKyAxO1xuICAgICAgcGFnZUJ0bi5kYXRhc2V0LnBhZ2UgPSBpO1xuICAgICAgcGFnZUJ0bi5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbicpO1xuXG4gICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICBwYWdlQnRuLmNsYXNzTGlzdC5hZGQoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIHBhZ2VFbGVtZW50LmFwcGVuZChwYWdlQnRuKTtcbiAgICAgIGZyYWdtZW50LmFwcGVuZChwYWdlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgcGFnaW5hdGlvbi5hcHBlbmQoZnJhZ21lbnQpO1xuICAgIHBhZ2luYXRpb25CdG5zID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcbiAgfTtcblxuICB2YXIgcmVuZGVyU2xpZGVyQ29udHJvbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2xpZGVzUXVhbnRpdHkgPSBNYXRoLmNlaWwocHJvZHVjdHMubGVuZ3RoIC8gcHJvZHVjdHNQZXJGcmFtZSgpKTtcblxuICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKDBweCknO1xuICAgIHJlbmRlclBhZ2luYXRpb24oc2xpZGVzUXVhbnRpdHkpO1xuICB9O1xuXG4gIHZhciBjaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdmFyIHNoaWZ0ID0gc2xpZGVyRnJhbWUub2Zmc2V0V2lkdGggKiBlbGVtZW50LmRhdGFzZXQucGFnZTtcblxuICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcblxuICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3NsaWRlcl9fY29udHJvbC1wYWdpbmF0aW9uLS1jdXJyZW50Jyk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2NvbnRyb2wtcGFnaW5hdGlvbi0tY3VycmVudCcpO1xuXG4gICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLScgKyBzaGlmdCArICdweCknO1xuICB9O1xuXG4gIHZhciBvblBhZ2luYXRpb25DbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24nKTtcblxuICAgIGN1cnJlbnRQYWdpbmF0aW9uQnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19jb250cm9sLXBhZ2luYXRpb24tLWN1cnJlbnQnKTtcblxuICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSBjdXJyZW50UGFnaW5hdGlvbkJ0bikge1xuICAgICAgY3VycmVudFNsaWRlID0gdGFyZ2V0LmRhdGFzZXQucGFnZTtcbiAgICAgIGNoYW5nZVNsaWRlKHRhcmdldCk7XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlclNsaWRlckNvbnRyb2xzKCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlbmRlclNsaWRlckNvbnRyb2xzKTtcblxuICBwcmV2aWV3U2xpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgY3VycmVudFNsaWRlID0gc2xpZGVzUXVhbnRpdHk7XG4gICAgfVxuXG4gICAgY3VycmVudFNsaWRlLS07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2luYXRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocGFnaW5hdGlvbkJ0bnNbaV0uZGF0YXNldC5wYWdlID09PSBjdXJyZW50U2xpZGUgKyAnJykge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gcGFnaW5hdGlvbkJ0bnNbaV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZVNsaWRlKHRhcmdldCk7XG4gIH0pO1xuXG4gIG5leHRTbGlkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBjdXJyZW50U2xpZGUrKztcblxuICAgIGlmIChjdXJyZW50U2xpZGUgPT09IHNsaWRlc1F1YW50aXR5KSB7XG4gICAgICBjdXJyZW50U2xpZGUgPSAwO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnaW5hdGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwYWdpbmF0aW9uQnRuc1tpXS5kYXRhc2V0LnBhZ2UgPT09IGN1cnJlbnRTbGlkZSArICcnKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSBwYWdpbmF0aW9uQnRuc1tpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2hhbmdlU2xpZGUodGFyZ2V0KTtcbiAgfSk7XG5cbiAgcGFnaW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUGFnaW5hdGlvbkNsaWNrKTtcbn0pKCk7XG4iXX0=

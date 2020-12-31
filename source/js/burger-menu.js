'use strict';

(function () {
  var header = document.querySelector('.header');
  var menuToggle = header.querySelector('.header__menu-toggle');
  var navigation = header.querySelector('.navigation');
  var loginLink = navigation.querySelector('.navigation__link--login');

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

  var onFocusCange = function () {
    if (!document.activeElement.closest('.header')) {
      menuToggle.focus();
    }

    document.removeEventListener('focusin', onFocusCange);
  };

  var onLoginLinkFocusout = function () {
    document.addEventListener('focusin', onFocusCange);
  };

  menuToggle.addEventListener('click', onToggleMenuClick);
  loginLink.addEventListener('focusout', onLoginLinkFocusout);
})();

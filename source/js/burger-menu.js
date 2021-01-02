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
      document.removeEventListener('keydown', onOpenMenuEscPress);
      loginLink.removeEventListener('focusout', onLoginLinkFocusout);
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
      document.addEventListener('keydown', onOpenMenuEscPress);
      loginLink.addEventListener('focusout', onLoginLinkFocusout);
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

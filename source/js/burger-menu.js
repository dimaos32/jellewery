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

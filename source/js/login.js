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

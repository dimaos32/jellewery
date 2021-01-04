'use strict';

(function () {
  if (document.querySelector('.modal--add-to-cart')) {
    var overlay = document.querySelector('.add-to-cart');
    var modal = overlay.querySelector('.modal');
    var modalOpenBtn = document.querySelector('.product__add-to-cart-btn');
    var modalCloseBtn = modal.querySelector('.modal__close-btn');

    var openModal = function () {
      overlay.classList.remove('add-to-cart--modal-closed');
      overlay.classList.add('add-to-cart--modal-opened');

      modalCloseBtn.addEventListener('click', onModalCloseBtnClick);
      overlay.addEventListener('click', onOverlayClick);
      document.addEventListener('keydown', onOpenModalEscPress);
    };

    var closeModal = function () {
      overlay.classList.add('add-to-cart--modal-closed');
      overlay.classList.remove('add-to-cart--modal-opened');

      modalCloseBtn.removeEventListener('click', onModalCloseBtnClick);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onOpenModalEscPress);
    };

    var onModalOpenBtnClick = function (evt) {
      evt.preventDefault();

      openModal();
    };

    var onModalCloseBtnClick = function () {
      closeModal();
    };

    var onOverlayClick = function () {
      closeModal();
    };

    var onOpenModalEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeModal();
      }
    };

    modalOpenBtn.addEventListener('click', onModalOpenBtnClick);
  }
})();

'use strict';

(function () {
  var openModal = function (modal) {
    modal.classList.remove('modal--closed');
    modal.classList.add('modal--opened');
  };

  var closeModal = function (modal) {
    modal.classList.add('modal--closed');
    modal.classList.remove('modal--opened');
  };

  window.utils = {
    openModal: openModal,
    closeModal: closeModal,
  };
})();

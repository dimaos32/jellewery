'use strict';

(function () {
  if (document.querySelector('.catalog__filter')) {
    var catalogFilter = document.querySelector('.catalog__filter-overlay');
    var catalogFilterOpenBtn = document.querySelector('.catalog__filter-open-btn');
    var catalogFiltercloseBtn = document.querySelector('.catalog__filter-close-btn');

    var onCatalogFilterClick = function (evt) {
      var target = evt.target.closest('.catalog__filter-fildset');

      if (evt.target.closest('.catalog__filter-fildset legend')) {
        evt.preventDefault();

        target.classList.toggle('catalog__filter-fildset--opened');
        target.classList.toggle('catalog__filter-fildset--closed');
      }

      if (evt.target === catalogFilter) {
        closeFilter();
      }
    };

    var onOpenFilterEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeFilter();
      }
    };

    var closeFilter = function () {
      catalogFilter.classList.remove('catalog__filter-overlay--opened');
      catalogFilter.classList.add('catalog__filter-overlay--closed');

      catalogFiltercloseBtn.removeEventListener('click', oncatalogFiltercloseBtnClick);
      document.removeEventListener('keydown', onOpenFilterEscPress);
    }

    var openFilter = function () {
      catalogFilter.classList.add('catalog__filter-overlay--opened');
      catalogFilter.classList.remove('catalog__filter-overlay--closed');

      catalogFiltercloseBtn.addEventListener('click', oncatalogFiltercloseBtnClick);
      document.addEventListener('keydown', onOpenFilterEscPress);
    }

    var oncatalogFilterOpenBtnClick = function (evt) {
      evt.preventDefault();

      openFilter();
    };

    var oncatalogFiltercloseBtnClick = function () {
      closeFilter();

      catalogFiltercloseBtn.removeEventListener('click', oncatalogFiltercloseBtnClick);
    };

    catalogFilter.addEventListener('click', onCatalogFilterClick);
    catalogFilterOpenBtn.addEventListener('click', oncatalogFilterOpenBtnClick);
  }
})();

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
    };

    var oncatalogFilterOpenBtnClick = function (evt) {
      evt.preventDefault();

      catalogFilter.classList.add('catalog__filter-overlay--opened');
      catalogFilter.classList.remove('catalog__filter-overlay--closed');

      catalogFiltercloseBtn.addEventListener('click', oncatalogFiltercloseBtnClick);
    };

    var oncatalogFiltercloseBtnClick = function () {
      catalogFilter.classList.remove('catalog__filter-overlay--opened');
      catalogFilter.classList.add('catalog__filter-overlay--closed');

      catalogFiltercloseBtn.removeEventListener('click', oncatalogFiltercloseBtnClick);
    };

    catalogFilter.addEventListener('click', onCatalogFilterClick);
    catalogFilterOpenBtn.addEventListener('click', oncatalogFilterOpenBtnClick);
  }
})();

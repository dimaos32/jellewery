'use strict';

(function () {
  if (document.querySelector('.product')) {
    var productPhotos = document.querySelectorAll('.product__photo');
    var productInfoTabs = document.querySelector('.product__info-tabs');
    var productInfoSlides = document.querySelector('.product__info-slides');

    var getPhotoPos = function () {
      var pos;

      for (var i = 0; i < productPhotos.length; i++) {
        if (productPhotos[i].classList.contains('product__photo--current')) {
          pos = i + 1;
        }
      }

      return pos;
    };

    var renderPagination = function () {
      var pos = getPhotoPos();
      var pagination = document.createElement('p');

      pagination.textContent = pos + ' of ' + productPhotos.length;

      productPhotos[pos - 1].append(pagination);
    };

    var onProductInfoTabClick = function (evt) {
      evt.preventDefault();

      var currentTab = productInfoTabs.querySelector('.product__info-tab--current');
      var targetTab = evt.target;
      var currentSlide = productInfoSlides.querySelector('.product__info-slide--current');
      var targetSlide = productInfoSlides.querySelector(targetTab.dataset.id);

      currentTab.classList.remove('product__info-tab--current');
      currentSlide.classList.remove('product__info-slide--current');
      targetTab.classList.add('product__info-tab--current');
      targetSlide.classList.add('product__info-slide--current');
    };

    renderPagination();

    productInfoTabs.addEventListener('click', onProductInfoTabClick);
  }
})();

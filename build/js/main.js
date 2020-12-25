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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1cmdlci1tZW51LmpzIiwiZmFxLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKTtcbiAgdmFyIG1lbnVUb2dnbGUgPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbWVudS10b2dnbGUnKTtcbiAgdmFyIG5hdmlnYXRpb24gPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLm5hdmlnYXRpb24nKTtcblxuICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLS1tZW51LWNsb3NlZCcpO1xuICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fbWVudS10b2dnbGUtLWNsb3NlZCcpO1xuICBuYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ25hdmlnYXRpb24tLWNsb3NlZCcpO1xuXG4gIHZhciBvblRvZ2dsZU1lbnVDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyLS1tZW51LW9wZW5lZCcpO1xuICAgIGhlYWRlci5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXItLW1lbnUtY2xvc2VkJyk7XG4gICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXJfX21lbnUtdG9nZ2xlLS1vcGVuZWQnKTtcbiAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ2hlYWRlcl9fbWVudS10b2dnbGUtLWNsb3NlZCcpO1xuICAgIG5hdmlnYXRpb24uY2xhc3NMaXN0LnRvZ2dsZSgnbmF2aWdhdGlvbi0tb3BlbmVkJyk7XG4gICAgbmF2aWdhdGlvbi5jbGFzc0xpc3QudG9nZ2xlKCduYXZpZ2F0aW9uLS1jbG9zZWQnKTtcbiAgfTtcblxuICBtZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Ub2dnbGVNZW51Q2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHF1ZXN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXFfX3F1ZXN0aW9ucycpO1xuXG4gIHZhciBvblF1ZXN0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHRhcmdldCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLmZhcV9fcXVlc3Rpb24nKTtcblxuICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5mYXFfX3F1ZXN0aW9ucyBhJykpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnZmFxX19xdWVzdGlvbi0tb3BlbmVkJyk7XG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnZmFxX19xdWVzdGlvbi0tY2xvc2VkJyk7XG4gICAgfVxuICB9O1xuXG4gIHF1ZXN0aW9ucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uUXVlc3Rpb25DbGljayk7XG59KSgpO1xuIl19

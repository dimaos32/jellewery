'use strict';

(function () {
  if (document.querySelector('.faq__questions')) {
    var questionsList = document.querySelector('.faq__questions');
    var questions = questionsList.querySelectorAll('.faq__question');

    var onQuestionClick = function (evt) {
      var target = evt.target.closest('.faq__question');

      if (evt.target.closest('.faq__questions button')) {
        evt.preventDefault();

        target.classList.toggle('faq__question--opened');
        target.classList.toggle('faq__question--closed');
      }
    };

    questions.forEach(function (question) {
      question.classList.remove('faq__question--opened', 'faq__question--hide-icon');
      question.classList.add('faq__question--closed');
    });

    questionsList.addEventListener('click', onQuestionClick);
  }
})();

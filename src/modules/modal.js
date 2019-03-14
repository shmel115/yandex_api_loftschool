module.exports = class {
    createTemplate(options) {
        const BalloonLayout = ymaps.templateLayoutFactory.createClass(
            `<div class="modal" id="myModal">
            <div class="modal__header">
                <div id="modalAdress">${options.address}</div><span class="modal__close"></span>
                </div>
                <div class="modal__inner">
                <div class="modal__result"></div>
                <div class="modal__title">Ваш отзыв</div>
                <form id="modalForm" data-coords="${options.coords}">
                  <input name="userName" class="modal__input" type="text" placeholder="Ваше имя">
                  <input name="placeName" class="modal__input" type="text" placeholder="Укажите место">
                  <textarea name="shareImpressions" class="modal__textarea" placeholder="Поделитесь впечатлениями"></textarea>
                  <div class="modal__submit-wrapper">
                      <button class="modal__submit">Добавить</button>
                  </div>
                </form>
                </div>
            </div>`, {
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonLayout.superclass.build.call(this);
                    const modalSubmit = document.querySelector('.modal__submit');
                    const formId = document.querySelector('#modalForm');
                    const coords = formId.getAttribute('data-coords');
                    let dataArray = [];

                    function addToLocalStorage(coords, array) {
                        // array ['name', 'place', 'expressions']
                        localStorage.setItem(coords, array);
                    }

                    modalSubmit.addEventListener('click', function (e) {
                        e.preventDefault();

                        let userName = formId.userName.value.trim();
                        let placeName = formId.placeName.value.trim();
                        let shareImpressions = formId.shareImpressions.value.trim();

                        if (userName === '') {
                            alert('поле Имя не заполнено');
                        } else if (placeName === '') {
                            alert('поле Место не заполнено');
                        } else if (shareImpressions === '') {
                            alert('поле Комментарий не заполнено');
                        } else {
                            dataArray.push(userName);
                            dataArray.push(placeName);
                            dataArray.push(shareImpressions);

                            addToLocalStorage(coords, dataArray);
                        }

                    });
                },

                clear: function () {
                    const modalSubmit = document.querySelector('.modal__submit');
                    const formId = document.querySelector('#modalForm');

                    modalSubmit.removeEventListener('click', function (e) {
                        e.preventDefault();
                    });
                    BalloonLayout.superclass.clear.call(this);
                }

            });

        return BalloonLayout;
    }

};
module.exports = class {
  initMap(settings, objects) {
    return new Promise((resolve, reject) => ymaps.ready(resolve)).then(() => {
      this.map = new ymaps.Map("map", settings);
      this.cluster = new ymaps.Clusterer({
        clusterDisableClickZoom: true
      });
      this.map.geoObjects.add(this.cluster);
      return this.map;
    });
  }
  async getMapPosition(e) {
    const coords = e.get("coords");
    const geocode = await ymaps.geocode(coords);
    const address = geocode.geoObjects.get(0).properties.get("text");

    return {
      coords,
      address
    };
  }
  async createBalloon(tmp) {
    const clusterNem = this.cluster;
    var BalloonContentLayout = await ymaps.templateLayoutFactory.createClass(
      '<div class="form">' +
        '<div class="header">' +
        tmp +
        "</div>" +
        '<div class="body">' +
        "</div>" +
        '<p class="title">Ваш отзыв</p>' +
        '<div><input id="name" type="text" placeholder="Ваше имя"/></div>' +
        '<div><input id="point" type="text" placeholder="Укажите место" /></div>' +
        "<div>" +
        '<textarea id="message" placeholder="Поделись впечатлениями">' +
        " </textarea></div>" +
        '<div class="button">' +
        '<button id="btn">Отправить</button>' +
        "</div>" +
        "</div>",
      {
        build: function() {
          BalloonContentLayout.superclass.build.call(this);
          var that = this;

          document.addEventListener("click", function(e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const point = document.getElementById("point").value;
            const message = document.getElementById("message").value;
            const body = document.querySelector(".body");
            const div = document.createElement("div");
            //div.innerHTML = `<div id="review"><b>${name}</b> <span>${point}</span><span class="data">${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}</span><p>${message}</p></div>`;
            body.appendChild(div);
            that.onContent(name, point, message);
          });
        },

        clear: function() {
          // Выполняем действия в обратном порядке - сначала снимаем слушателя,
          // а потом вызываем метод clear родительского класса.
          BalloonContentLayout.superclass.clear.call(this);
        },

        onContent: function(name, point, message) {
          var myPlacemark = new ymaps.Placemark(
            tmp,
            {
              balloonContentHeader: `<b>${point}</b>`
              // balloonContentBody: `<div id="review"><a class="linckCoords" href="javascript:void(0);" data-coords="${coords}">${points}</a> <p>${message}</p></div>`
              // balloonContentFooter: `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}`
            },
            {
              balloonContentBodyLayout: BalloonContentLayout,
              balloonPanelMaxMapArea: 0,
              hasBalloon: false
            }
          );

          clusterNem.add(myPlacemark);

          return [myPlacemark, this.cluster];
        }
      }
    );
    let balloon = await new ymaps.Balloon(this.map, {
      contentLayout: BalloonContentLayout
    });
    await balloon.options.setParent(this.map.options);
    await balloon.open(tmp);
  }
};

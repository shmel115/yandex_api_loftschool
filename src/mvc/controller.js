const Map = require("../modules/api_yandex_map");
const Modal = require("../modules/modal");
const Placemarks = require("../modules/clusters");

export default class {
  constructor() {
    this.myApiMap = new Map();
    this.modal = new Modal();
    this.placemarks = new Placemarks();

    this.init();
  }

  async init() {
    this.yandexApi = await this.myApiMap.initMap({
      center: [59.945, 30.264],
      zoom: 15,
      controls: ["zoomControl", "fullscreenControl"]
    }, this.getPlacemarks = this.placemarks.createPlacemarks(this.yandexApi));

    this.yandexApi.events.add("click", async e => {
      this.position = await this.myApiMap.getMapPosition(e);

      this.template = await this.modal.createTemplate(this.position);

      // placemark
      var Placemark = new ymaps.Placemark(this.position.coords, {
        name: 'test'
      }, {
        balloonLayout: this.template,
        openEmptyBalloon: true,
        balloonCloseButton: false
      });

      this.yandexApi.geoObjects.add(Placemark);

      Placemark.balloon.open();

    });

  }

}
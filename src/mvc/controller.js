const Map = require("../modules/api_yandex_map");
//const Modal = require("../modules/modal");
//const Placemarks = require("../modules/clusters");

export default class {
  constructor() {
    this.myApiMap = new Map();
    //this.modal = new Modal();
    //this.placemarks = new Placemarks();

    this.init();
  }

  async init() {
    this.yandexApi = await this.myApiMap.initMap({
      center: [59.945, 30.264],
      zoom: 15,
      controls: ["zoomControl", "fullscreenControl"]
    });

    this.yandexApi.events.add("click", async e => {
      this.position = await this.myApiMap.getMapPosition(e);
      // placemark
      this.Balloon = await this.myApiMap.createBalloon(this.position.coords);
    });
  }
}

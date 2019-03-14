module.exports = class {
  initMap(settings, objects) {
    return new Promise((resolve, reject) => ymaps.ready(resolve)).then(() => {
      this.map = new ymaps.Map("map", settings);
      this.cluster = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
      });
      this.cluster.add(objects);
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
      geocode,
      address
    };
  }
};
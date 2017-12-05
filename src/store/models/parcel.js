export default class Parcel {
  constructor (feature) {
    this.folio = feature.attributes.FOLIO
    this.address = feature.attributes.SITE_ADDR
    this.geometry = feature.geometry
  }

  // esri settings
  static esriEndpointUrl () {
    return 'https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/HC_Parcels/MapServer/0'
  }

  static esriFields () {
    return ['FOLIO', 'SITE_ADDR']
  }

  static esriWkid () {
    return 102100
  }
}

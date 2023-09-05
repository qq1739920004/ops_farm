L.Popup.prototype._animateZoom = function (e: any) {
    if (!this._map) {
        return
    }
    var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
        anchor = this._getAnchor()
    L.DomUtil.setPosition(this._container, pos.add(anchor))
}

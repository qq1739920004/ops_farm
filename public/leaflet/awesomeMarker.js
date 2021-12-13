/**
 * @sourceCode
 * target._radius <= 20
 * 
 * @config
 * preferCanvas: true
 * 
 * @description
 * Canvas obviously doesn't have mouse events for individual drawn objects, so we emulate that by calculating what's under the mouse on mousemove/click manually
 */


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined' && typeof require !== 'undefined') {
        // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw 'Leaflet must be loaded first';
        }
        factory(window.L);
    }
})(function (L) {

    let awesomeMarker = {
        options: {
            icon: null,
            iconWidth: 32,
            iconHeight: 32 //用于计算图片相对circleMarker中心位置偏移。
        },

        setIcon: function (url) {
            this.options.icon = url;
            // return this.redraw();
        }
    }

    L.AwesomeMarker = L.CircleMarker.extend(awesomeMarker);
    L.awesomeMarker = function (latlng, options) {
        return new L.AwesomeMarker(latlng, options);
    };


    var _updateCircleCanvas = L.Canvas.prototype._updateCircle;

    L.Canvas.include({
        _updateCircle: function (layer) {
            if (!(layer instanceof L.AwesomeMarker)) {
                return _updateCircleCanvas.call(this, layer);
            }
            if (!this._drawing || layer._empty()) { return; }
            var p = layer._point,
                ctx = this._ctx,
                r = Math.max(Math.round(layer._radius), 1),
                s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;
            if (s !== 1) {
                ctx.save();
                ctx.scale(1, s);
            }
            if (layer.options.icon) {
                let img = new Image();
                img.src = layer.options.icon;
                img.onload = function () {
                    let xOffset = layer.options.iconWidth ? layer.options.iconWidth / 2 : 16;
                    let yOffset = layer.options.iconHeight ? layer.options.iconHeight / 2 : 16;
                    ctx.drawImage(img, p.x - xOffset, p.y - yOffset);
                }
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);
            if (s !== 1) {
                ctx.restore();
            }
            this._fillStroke(ctx, layer);
        }
    });
});
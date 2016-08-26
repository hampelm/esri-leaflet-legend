(function (factory) {
  //define an AMD module that relies on 'leaflet'
  if (typeof define === 'function' && define.amd) {
    define(['leaflet', 'esri-leaflet'], function (L, EsriLeaflet) {
      return factory(L, EsriLeaflet);
    });
  //define a common js module that relies on 'leaflet'
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('leaflet'), require('esri-leaflet'));
  }

  if(typeof window !== 'undefined' && window.L){
    factory(window.L, L.esri);
  }
}(function (L, EsriLeaflet) {


/**
 * @example
 * <code>
 * L.esri.Util.queue(
 *   [1, 2, 3], [], function(curr, item, cb){
 *     setTimeout(function(){
 *       cb(null, curr.concat([item + 10]));
 *     }, 200);
 *   }, function(err, result) {
 *     console.log(result); // [11, 12, 13]
 * });
 * </code>
 * @param  {Array.<*>} values
 * @param  {*}         initial
 * @param  {Function}  fn       process item fn(memo, item, callback)
 * @param  {Function}  done     queue complete
 * @param  {*=}        context
 */
EsriLeaflet.Util.reduce=function(a,b,c,d,e){function f(b){for(var h=!0,i=b;i<a.length;i++){var j=!1;if(c(g,a[i],function(a,b){return a?d.call(e,a,g):(j=!0,g=b,void(h||f(i+1)))}),h=j,!h)return}d.call(e,null,g)}var g=b;f(0)},EsriLeaflet.Services.MapService.include({legend:function(a,b){return new EsriLeaflet.Tasks.Legend(this).run(a,b)}}),EsriLeaflet.Services.FeatureLayerService.include({legend:function(a,b){return new EsriLeaflet.Tasks.Legend(this).run(a,b)}}),EsriLeaflet.Tasks.Legend=EsriLeaflet.Tasks.Task.extend({path:"legend",params:{f:"json"},run:function(a,b){return this._service?this._service.request(this.path,this.params,a,b):this._request("request",this.path,this.params,a,b)}}),EsriLeaflet.Tasks.legend=function(a){return new EsriLeaflet.Tasks.Legend(a)},EsriLeaflet.Tasks.Legend.include({initialize:function(a){this._renderer=new EsriLeaflet.Tasks.Legend.SymbolRenderer,EsriLeaflet.Tasks.Task.prototype.initialize.call(this,a)},run:function(a,b){function c(c,d){c&&400===c.error.code?// ArcGIS server >=10.0
this._collectLegendFromLayers(a,b):d.drawingInfo?this._symbolsToLegends([d],function(c,d){a.call(b,c,{layers:d})}):a.call(b,c,d)}return this._service?this._service.request(this.path,this.params,c,this):this._request("request",this.path,this.params,c,this)},_collectLegendFromLayers:function(a,b){this._service.metadata(function(c,d){if(c)return a.call(b,c);for(var e=[],f=0,g=d.layers.length;f<g;f++)d.layers[f].subLayerIds||e.push(d.layers[f]);this._getLayersLegends(e,function(c,d){c?a.call(b,c):this._symbolsToLegends(d,function(c,d){a.call(b,c,{layers:d})})},this)},this)},_getLayersLegends:function(a,b,c){var d=this;EsriLeaflet.Util.reduce(a,[],function(a,b,c){d._getLayerLegend(b,function(b,d){return b?c(b,null):void c(null,a.concat(d))},d)},function(a,d){b.call(c,a,d)})},_getLayerLegend:function(a,b,c){this._service.request(a.id,{f:"json"},b,c)},_symbolsToLegends:function(a,b,c){var d=this;EsriLeaflet.Util.reduce(a,[],function(a,b,c){d._drawingInfoToLegend(b.drawingInfo,function(d,e){return d?c(d,null):void c(null,a.concat([{layerId:b.id,layerType:b.type,layerName:b.name,maxScale:b.maxScale,minScale:b.minScale,legend:e}]))},d)},function(a,d){b.call(c,a,d)})},_getRendererSymbols:function(a){var b;return"uniqueValue"===a.type?b=a.uniqueValueInfos.slice():"classBreaks"===a.type?b=a.classBreakInfos.slice():"simple"===a.type&&(b=[{symbol:a.symbol,label:a.label,description:a.description,value:a.value}]),a.defaultSymbol&&b.push({symbol:a.defaultSymbol,label:a.defaultLabel,description:"",value:null}),b},_drawingInfoToLegend:function(a,b,c){var d=this;EsriLeaflet.Util.reduce(this._getRendererSymbols(a.renderer),[],function(a,b,c){d._renderSymbol(b,function(d,e){return d?c(d,a):void c(null,a.concat([{label:b.label,height:e.height,url:b.symbol.url,imageData:e.imageData,contentType:e.contentType,width:e.width,values:[b.value||""]}]))},d)},function(a,d){b.call(c,a,d)})},_renderSymbol:function(a,b,c){return this._renderer.render(a.symbol,b,c)}}),EsriLeaflet.Tasks.Legend.SymbolRenderer=L.Class.extend({statics:{SYMBOL_TYPES:{MARKER:"esriSMS",LINE:"esriSLS",FILL:"esriSFS",PICTURE_MARKER:"esriPMS",PICTURE_FILL:"esriPFS",TEXT:"esriTS"},DEFAULT_SIZE:20},render:function(a,b,c){function d(a,d){a?b.call(c,a):b.call(c,null,{width:e.width||EsriLeaflet.Tasks.Legend.SymbolRenderer.DEFAULT_SIZE,height:e.height||EsriLeaflet.Tasks.Legend.SymbolRenderer.DEFAULT_SIZE,imageData:d.replace("data:image/png;base64,",""),url:null,contentType:"image/png"})}var e=document.createElement("canvas"),f=e.getContext("2d");a.imageData;if(this._setSize(e,a),a.imageData)return d(null,a.imageData);switch(a.type){case"esriSMS":this._renderMarker(f,a,d);break;case"esriSLS":this._renderLine(f,a,d);break;case"esriSFS":this._renderFill(f,a,d);break;case"esriPMS":this._renderImageMarker(f,a,d);break;case"esriPFS":this._renderImageFill(f,a,d);break;case"esriST":this._renderText(f,a,d)}},_renderText:function(a,b,c){c(null,a.canvas.toDataURL())},_renderFill:function(a,b,c){var d=EsriLeaflet.Tasks.Legend.SymbolRenderer.DEFAULT_SIZE,e=b.outline?b.outline.width:1,f=Math.max(5,3*e);switch(b.style){case"esriSFSVertical":this._hatchCanvas(a,d,b.color,e,f);break;case"esriSFSHorizontal":this._setRotation(a,90),this._hatchCanvas(a,d,b.color,e,f);break;case"esriSFSBackwardDiagonal":this._setRotation(a,-45),this._hatchCanvas(a,d,b.color,e,f);break;case"esriSFSForwardDiagonal":this._setRotation(a,45),this._hatchCanvas(a,d,b.color,e,f);break;case"esriSFSCross":this._hatchCanvas(a,d,b.color,e,f),this._setRotation(a,90),this._hatchCanvas(a,d,b.color,e,f);break;case"esriSFSDiagonalCross":this._setRotation(a,45),this._hatchCanvas(a,d,b.color,e,f),this._setRotation(a,45),this._hatchCanvas(a,d,b.color,e,f);break;case"esriSFSSolid":a.fillStyle=this._formatColor(b.color),a.fillRect(0,0,d,d);break;case"esriSFSNull":break;default:throw new Error("Unknown SFS style: "+b.style)}b.outline&&(a.strokeStyle=this._formatColor(b.outline.color),a.lineWidth=b.outline.width,a.fillStyle=this._formatColor([0,0,0,0]),this._setDashArray(a,b.outline),a.rect(b.outline.width,b.outline.width,d-b.outline.width,d-b.outline.width),a.stroke()),c(null,a.canvas.toDataURL())},_renderLine:function(a,b,c){var d=EsriLeaflet.Tasks.Legend.SymbolRenderer.DEFAULT_SIZE;a.beginPath(),a.lineWidth=b.width,a.strokeStyle=this._formatColor(b.color),this._setDashArray(a,b),//
a.moveTo(0,d/2),a.lineTo(d,d/2),a.closePath(),a.stroke(),c(null,a.canvas.toDataURL())},_renderMarker:function(a,b,c){var d,e,f,g=0,h=0,i=b.size;switch(a.beginPath(),b.outline&&(a.strokeStyle=this._formatColor(b.outline.color),a.lineWidth=b.outline.width,g+=b.outline.width,h+=b.outline.width),this._setRotation(a,b.angle),b.style){case"esriSMSCircle":a.fillStyle=this._formatColor(b.color),d=(i-2*g)/2,a.arc(d+g,d+g,d,0,2*Math.PI,!1),a.fill();break;case"esriSMSX":a.moveTo(g,h),a.lineTo(i-g,i-h),a.moveTo(i-g,h),a.lineTo(g,i-h);break;case"esriSMSCross":a.moveTo(g,i/2),a.lineTo(i-g,i/2),a.moveTo(i/2,h),a.lineTo(i/2,i-h);break;case"esriSMSDiamond":a.fillStyle=this._formatColor(b.color),e=(i-2*g)/2,f=(i-2*h)/2,a.moveTo(g,h+f),a.lineTo(g+e,h),a.lineTo(g+2*e,h+f),a.lineTo(g+e,h+2*f),a.lineTo(g,h+f),a.fill();break;case"esriSMSSquare":a.rect(g,h,i-2*g,i-2*h);break;case"esriSMSTriangle":a.fillStyle=this._formatColor(b.color),e=(i-2*g)/2,f=(i-2*h)/2,a.moveTo(g,h+2*f),a.lineTo(g+e,h),a.lineTo(g+2*e,h+2*f),a.lineTo(g,h+2*f),a.fill();break;default:throw new Error("Unknown esriSMS style: "+b.style)}a.closePath(),b.outline&&a.stroke(),c(null,a.canvas.toDataURL())},_renderImageFill:function(a,b,c){this._setRotation(a,b.angle),b.imageData?(this._fillImage(a,b.imageData,b,b.contentType),c(null,a.toDataURL())):this._loadImage(b.url,function(d,e){this._fillImage(a,null,b,b.contentType,e),c(null,a.canvas.toDataURL())},this)},_renderImageMarker:function(a,b,c){this._setRotation(a,b.angle),b.imageData?(this._drawImage(a,b.imageData,b.contentType),c(null,a.toDataURL())):this._loadImage(b.url,function(b,d){a.drawImage(d,0,0),c(null,a.canvas.toDataURL())},this)},_setSize:function(a,b){b.size?a.width=a.height=b.size:"esriSLS"===b.type||"esriSFS"===b.type?a.width=a.height=EsriLeaflet.Tasks.Legend.SymbolRenderer.DEFAULT_SIZE:(a.width=b.width,a.height=b.height)},_setRotation:function(a,b){a.rotate(-parseFloat(b)*Math.PI/180)},_setDashArray:function(a,b){var c=this._formatDashArray(b);c.length&&a.setLineDash(c)},_drawCross:function(a,b,c,d){a.moveTo(b,c),a.lineTo(d-b,d-c),a.moveTo(d-b,c),a.lineTo(b,d-c)},_hatchCanvas:function(a,b,c,d,e){for(var f=2*b,g=2*b,h=-f;h<f;h+=e)a.moveTo(h,-g),a.lineTo(h,g);a.lineWidth=d,a.strokeStyle=this._formatColor(c),a.stroke()},_formatColor:function(a){return"rgba("+a.slice(0,3).join(",")+","+a[3]/255+")"},_formatDashArray:function(a){var b=[];switch(a.style){case"esriSLSDash":b=[4,3];break;case"esriSLSDot":b=[1,3];break;case"esriSLSDashDot":b=[8,3,1,3];break;case"esriSLSDashDotDot":b=[8,3,1,3,1,3]}
//use the dash values and the line weight to set dash array
if(b.length>0)for(var c=0,d=b.length;c<d;c++)b[c]*=a.width;return b},_getImageData:function(a,b){return a.toDImageData(0,0,b.width,b.height)},_fillImage:function(a,b,c,d,e){var f=L.EsriLeaflet.Tasks.Legend.DEFAULT_SIZE,g=c.width||f,h=c.height||f;b&&(e=new Image,e.src="data:"+d+";base64,"+b);var i=a.createPattern(e,"repeat");a.rect(0,0,g,h),a.fillStyle=i,a.fill(),c.outline&&(a.strokeStyle=this._formatColor(c.outline.color),a.lineWidth=c.outline.width,a.fillStyle=this._formatColor([0,0,0,0]),this._setDashArray(a,c.outline),a.rect(c.outline.width,c.outline.width,g-c.outline.width,h-c.outline.width),a.stroke())},_drawImage:function(a,b,c){var d=new Image;d.src="data:"+c+";base64,"+b,a.drawImage(d,0,0)},_loadImage:function(a,b,c){var d=new Image;d.crossOrigin="",d.onload=function(){b.call(c,null,this)},d.onerror=function(a){b.call(c,{code:500})},d.src=a+(a.indexOf("?")===-1?"?":"&")+"nc="+(new Date).getTime()}}),EsriLeaflet.Layers.DynamicMapLayer.include({legend:function(a,b){return this._service.legend(a,b)}}),EsriLeaflet.Layers.FeatureLayer.include({legend:function(a,b){return this._service.legend(a,b)}}),EsriLeaflet.Controls.Legend=L.Control.extend({options:{listTemplate:"<ul>{layers}</ul>",layerTemplate:"<li><strong>{layerName}</strong><ul>{legends}</ul></li>",listRowTemplate:'<li><img width="{width}" height="{height}" src="data:{contentType};base64,{imageData}"><span>{label}</span></li>',emptyLabel:"<all values>",container:null},initialize:function(a,b){this._layers=L.Util.isArray(a)?a:[a],L.Control.prototype.initialize.call(this,b)},onAdd:function(a){var b=this.options.container||L.DomUtil.create("div","leaflet-legend-control leaflet-bar");return L.DomEvent.disableScrollPropagation(b).disableClickPropagation(b),this._layers.length&&this._load(),b},_load:function(){L.esri.Util.reduce(this._layers,{layers:[]},function(a,b,c){b.legend(function(b,d){return b?c(b,a):(a.layers=a.layers.concat(d.layers),void c(null,a))})},this._onLoad,this)},_onLoad:function(a,b){if(!a){for(var c="",d=0,e=b.layers.length;d<e;d++){for(var f=b.layers[d],g="",h=0,i=f.legend.length;h<i;h++){var j=JSON.parse(JSON.stringify(f.legend[h]));this._validateLegendLabel(j),g+=L.Util.template(this.options.listRowTemplate,j)}c+=L.Util.template(this.options.layerTemplate,{layerName:f.layerName,legends:g})}this._container.innerHTML=L.Util.template(this.options.listTemplate,{layers:c})}},_validateLegendLabel:function(a){!a.label&&this.options.emptyLabel&&(a.label=this.options.emptyLabel),a.label=a.label.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}}),EsriLeaflet.Controls.legend=function(a,b){return new L.esri.Controls.Legend(a,b)};
//# sourceMappingURL=esri-leaflet-legend-compat.js.map

  return EsriLeaflet;
}));
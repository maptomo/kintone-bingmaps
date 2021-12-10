/*
 * @function Bing Maps sample for kintone
 * @author Copyright (c) Maptomo
 * @license MIT License
 * @since 2021
 */

(function() {

  'use strict';

  const _appId = kintone.app.getId();
  const _kintoneUrl = window.location.origin + '/k/';
  const _mapKey = 'YOUR_BING_MAPS_KEY';
  const _mapUrl = 'https://www.bing.com/api/maps/mapcontrol?callback=drawMap&key=' + _mapKey;
  
  const _container_index = 'map-index';
  const _container_list = 'map-list';
  const _container_detail = 'map-detail';

  // ---------------------------------------------------------------------------
  // Microsoft.Bing.Maps Elemetを作成する
  // ---------------------------------------------------------------------------
  const MapElement = function(url) {

    return new Promise(function(resolve, reject) {
      if(typeof Microsoft !== "undefined") {
        resolve(Microsoft);
        return true;
      }

      let script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', url);

      document.getElementsByTagName('head')[0].appendChild(script);

      let timeout = 0;
      const interval = setInterval(function(){

        if (timeout >= 20) {
          reject();
          clearInterval(interval);
          console.error('Error T.T Bing Maps');
        }

        if (typeof Microsoft !== 'undefined') {
          resolve(Microsoft);
          clearInterval(interval);
          console.log('Sucess!! Bing Maps');
        }
        timeout += 1;
      }, 500);
    });
  };
  
  // ---------------------------------------------------------------------------
  // レコード操作のイベント
  // ---------------------------------------------------------------------------
  const events = [
    'app.record.index.show',
    'mobile.app.record.index.show',
    'app.record.detail.show',
    'mobile.app.record.detail.show'
  ];
  kintone.events.on(events, function (event) {

    if (event.viewId && event.viewType !== 'custom') {
      return event;
    }
    
    if (event.viewType === 'custom') {
      showListdata(event);

      const records = event.records;
      if (records.length >= 0) {
        const param = setParam(records[0], _container_index);
        drawMap(param);
      }

    } else if (event.type.indexOf('.detail.show') >= 0) {
      const el = kintone.app.record.getSpaceElement(_container_detail);
      el.textContent = null;
      const param = setParam(event.record, el.id);
      drawMap(param);
    }
  });

  // ---------------------------------------------------------------------------
  // レコード情報をセットする
  // ---------------------------------------------------------------------------
  const setParam = function(record, container) {
    return {
      'container': container,
      'name': record ? record.Name.value : 'Fukuoka Airport',
      'exp': record ? record.Explanation.value : '',
      'lat': record ? Number(record.Latitude.value) : 33.5903,
      'lng': record ? Number(record.Longitude.value) : 130.4467,
      'zoom': record ? Number(record.Zoom.value) : 12
    };
  };

  // ---------------------------------------------------------------------------
  // Bing Mapsを生成し、座標、ズームなどを設定する
  // ---------------------------------------------------------------------------
  const drawMap = function(param) {

    MapElement(_mapUrl).then(function(Microsoft) {

      const enu = randomEnumeration();
      console.log(enu);
      // Bing Maps
      const map = new window.Microsoft.Maps.Map('#' + param.container, {
        credentials: _mapKey,
        center: new Microsoft.Maps.Location(param.lat, param.lng),
        mapTypeId: enu,
        zoom: param.zoom
      });
      
      // 座標にポップアップ表示
      const center = map.getCenter();
      const box = new Microsoft.Maps.Infobox(center, {
        title: param.name,
        description: param.exp
      });
      box.setMap(map);
    });
  };
  
  // ---------------------------------------------------------------------------
  // ランダムにMapTypeId Enumerationを抽出
  // ---------------------------------------------------------------------------
  const randomEnumeration = function() {
    const enu = [
      Microsoft.Maps.MapTypeId.aerial,
      Microsoft.Maps.MapTypeId.canvasDark,
      Microsoft.Maps.MapTypeId.canvasLight,
      Microsoft.Maps.MapTypeId.birdseye,
      Microsoft.Maps.MapTypeId.grayscale,
//      Microsoft.Maps.MapTypeId.mercator,
      Microsoft.Maps.MapTypeId.ordnanceSurvey,
      Microsoft.Maps.MapTypeId.road,
//      Microsoft.Maps.MapTypeId.streetside
    ];
    return enu[Math.floor(Math.random() * enu.length)];
  };

  // ---------------------------------------------------------------------------
  // データを取得し、kintoneUIComponentでTableを生成する
  // ---------------------------------------------------------------------------
  const showListdata = function (ev) {

    const table = new kintoneUIComponent.Table({
      // inital table data
      columns: [
        {
          header: 'Name',
          cell: function () {
            return kintoneUIComponent.createTableCell('label', 'name', {
              
              // クリック時には地図を再描画
              onClick: function (event) {
                document.getElementById(_container_index).textContent = null;
                const param = setParam(event.data[event.rowIndex].record, _container_index);
                drawMap(param);

              }
            });
          }
        },
        {
          header: 'Latitude',
          cell: function () { return kintoneUIComponent.createTableCell('label', 'lat') }
        },
        {
          header: 'Longitude',
          cell: function () { return kintoneUIComponent.createTableCell('label', 'lng') }
        },
        {
          header: ' ',
          cell: function () {
            return kintoneUIComponent.createTableCell('icon', 'icon', {
              type: 'right', color: 'blue',
              onClick: function (event) {
                window.open(event.data[event.rowIndex].detail.text, '_self');
              }
            });
          }
        }
      ],
      actionButtonsShown: false
    });

    const el = document.getElementById(_container_list);
    el.appendChild(table.render());

    const arrData = createIndexdata(ev);
    table.setValue(arrData);
  };

  // ---------------------------------------------------------------------------
  // Indexに表示するデータを取得し、格納する
  // ---------------------------------------------------------------------------
  const createIndexdata = function (ev) {

    let arrData = [];
    const records = ev.records;
    records.forEach(function (r) {

      if (!r.Latitude.value && !r.Longitude.value) {
        return ev;
      }

      const elDraw = document.createElement('a');
      elDraw.appendChild(document.createTextNode(r.Name.value));
      const elLink = _kintoneUrl + _appId + '/show#record=' + r.$id.value;

      const row = {
        'name': { text: elDraw.outerHTML },
        'lng': { text: r.Longitude.value },
        'lat': { text: r.Latitude.value },
        'icon': { text: '' },
        'detail': { text: elLink },
        'record': r
      };
      arrData.push(row);
    });

    return arrData;
  };

})();

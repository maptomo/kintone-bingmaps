/*
 * @function Bing Maps sample for kintone
 * @author Copyright (c) Maptomo
 * @license MIT License
 * @since 2021
 */

(() => {

  'use strict';

  const _appId = kintone.app.getId();
  const _kintoneUrl = window.location.origin + '/k/';
  const _mapKey = '{YOUR_BING_MAPS_KEY}';
  const _mapUrl = 'https://www.bing.com/api/maps/mapcontrol?callback=drawMap';
  
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = _mapUrl;
  script.setAttribute('async', true);
  script.setAttribute('defer', true);
  document.getElementsByTagName('head')[0].appendChild(script);

  const _container_index = 'map-index';
  const _container_list = 'map-list';
  const _container_detail = 'map-detail';

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
      if (records.length > 0) {
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
  const drawMap = async function(param) {

    if (Microsoft === undefined){
      return false;
    }
    // Bing Maps
    const map = await new Microsoft.Maps.Map('#' + param.container, {
      credentials: _mapKey,
      center: new Microsoft.Maps.Location(param.lat, param.lng),
      mapTypeId: Microsoft.Maps.MapTypeId.aerial,
      zoom: param.zoom
    });
    
    // 座標にポップアップ表示
    const center = map.getCenter();
    const box = await new Microsoft.Maps.Infobox(center, {
      title: param.name,
      description: param.exp
    });
    box.setMap(map);

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

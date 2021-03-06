# kintone-bingmaps
kintoneにある緯度経度データをもとに、Microsoft Bing Maps APIを利用して地図を描画する。

## 「kintoneカスタマイズビュー」での完成イメージ

|レコード一覧（カスタマイズビュー）|レコード詳細|
|---|---|
|![](2021k1.png)|![](2021k2.png)|
|![](2021k4.png)|![](2021k5.png)|


## 主な仕様
- カスタマイズビュー機能を使って、左ペインに地図、右ペインにリストを作成
- 緯度経度の座標を元に地図を描画する 縮尺、[Tileはランダム](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/map-control-api/maptypeid-enumeration)
- Nameのリンクをクリックすると地図が変わる
- 右ペインの矢印（→）アイコンをクリックするとレコードの詳細に移動する
- レコード追加/編集画面で、緯度経度値などを変更できる
- レコード詳細画面で地図を描画する
- PC版のChrome, Firefoxのみ確認済

## 適用方法の情報
1. Microsoft Bing Maps APIの取得
  - [Microsoft Bing Maps APIの取得方法](https://docs.microsoft.com/ja-jp/windows/uwp/maps-and-location/authentication-key)
  - [取得ページ](https://www.bingmapsportal.com/)
2. kintone環境の準備
  - [kintone開発環境](https://developer.cybozu.io/hc/ja/articles/200720464)
  - [kintone試用申し込み](https://kintone.cybozu.co.jp/trial/)
3. サンプルデータのインポート
  - [サンプルCSV](data.csv)
  - [CSVファイルからアプリ作成](https://jp.cybozu.help/k/ja/user/create_app/app_csv/add_app_csv.html)
4. アプリのビュー設定
  - [カスタマイズビューの作成](https://jp.cybozu.help/k/ja/user/app_settings/view/set_view.html#view_set_view_2030) （次のHTMLを設定）

```html
<div class="blockleft">
  <div id="map-index"></div>
</div>
<div class="blockdata">
  <div id="map-list"></div>
</div>
```

5. ファイル読み込み
- [JavaScriptファイルの読み込み方法](https://jp.cybozu.help/k/ja/admin/javascript_fullcustomize.html) （次のURL、ファイルを設定）
  - https://cdn.jsdelivr.net/npm/@kintone/kintone-ui-component@0.8.3/dist/kintone-ui-component.min.js
  - [sample.js](sample.js)

- [CSSファイルの読み込み方法](https://jp.cybozu.help/k/ja/admin/javascript_fullcustomize.html) （次のURL、ファイルを設定）
  - https://cdn.jsdelivr.net/npm/@kintone/kintone-ui-component@0.8.3/dist/kintone-ui-component.min.css
  - [style.css](style.css)


## Bing Maps Document
- [Bing Maps Documentation](https://docs.microsoft.com/ja-jp/bingmaps/)
- [いろいろな日本百選の経緯度数値データ](http://100sen.cyber-ninja.jp/)
- [XLsoft CorporationによるBing Map site](https://www.xlsoft.com/jp/products/bing_maps/index.html)
- [Bing Map Site](https://www.bing.com/maps)


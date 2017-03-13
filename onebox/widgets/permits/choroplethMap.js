debugger;
require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/renderers/smartMapping",
    "esri/renderers/SimpleRenderer", "esri/Color",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/tasks/query",
    "esri/dijit/Legend",
    "esri/geometry/Point",
    "esri/InfoTemplate",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/domReady!"
  ], function(Map, FeatureLayer, smartMapping, SimpleRenderer, Color,
      SimpleFillSymbol, SimpleLineSymbol, Query, Legend, Point, InfoTemplate, dom, domConstruct) {
  debugger;
    var map = new Map("arcgis-map", {
      basemap: 'dark-gray',
      center: [-78.65, 35.85], // longitude, latitude
      zoom: 10
    });
    var legend = null;


    $.ajax({
      url: 'https://raw.githubusercontent.com/CORaleigh/dataviz_search/censusmap/data/construction-permitting.json',
      type: 'GET',
      dataType: 'json'
    })
    .done(function(data) {
        var where = "GEOID10 in (";
        var geoids = [];
        $.each(data, function (i, d) {
          geoids.push("'" + d.geoid_blgrp + "'");
        });

        where += geoids.toString() + ")";
      var featureLayer = new FeatureLayer("https://services1.arcgis.com/a7CWfuGP5ZnLYE7I/arcgis/rest/services/CensusBlockGroups2010/FeatureServer/0",
        {
          definitionExpression: where,
          outFields: ['*'],
          mode: FeatureLayer.MODE_SNAPSHOT,
          minZoom: 8,
          opacity: 0.6
        }
      );
      var q = new Query();
      q.where = where;
      var cnt = 0;
      featureLayer.queryCount(q, function (count) {
        featureLayer.on('graphic-add', function (g) {
          var match = $(data).filter(function (i) {
            if (g.graphic.attributes) {
              return data[i].geoid_blgrp === g.graphic.attributes.GEOID10.toString();
            }
          });
          if (match.length > 0) {
            g.graphic.attributes.count_permitnum = parseInt(match[0].count_permitnum);
            g.graphic.attributes.sum_estprojectcost = parseInt(match[0].sum_estprojectcost);
          }
          console.log(g);
          if (cnt === count - 1) {
            setRenderer(featureLayer, smartMapping);
          }
          cnt += 1;
        });
      });
      map.addLayer(featureLayer);
      featureLayer.on("load", function(){
        navigator.geolocation.getCurrentPosition(function (position) {
          var point = new Point(position.coords.longitude, position.coords.latitude)
          map.centerAndZoom(point, 15);
          var q = new Query();
          q.geometry = point;
          featureLayer.queryFeatures(q, function (results) {
            if (results.features.length > 0) {
              map.infoWindow.setFeatures(results.features);
              map.infoWindow.show(point);
            }
          });
        })
      });
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  function setInfoTemplate (featureLayer) {
    var infoTemplate = new InfoTemplate();
    infoTemplate.setTitle("${GEOID10}<br/>");
    infoTemplate.setContent("<b>Estimated Total Project Cost</b><br/>$${sum_estprojectcost}");
    featureLayer.setInfoTemplate(infoTemplate);
  }

  function setRenderer (featureLayer, smartMapping) {
      featureLayer.fields.push({
        alias: 'Estimated Project Cost',
        editable: true,
        name: 'sum_estprojectcost',
        nullable: true,
        type: 'esriFieldTypeDouble'
      });
      featureLayer.fields.push({
        alias: 'Count',
        editable: true,
        name: 'Permits',
        nullable: true,
        type: 'esriFieldTypeDouble'
      });
          //smart mapping functionality begins
          smartMapping.createClassedColorRenderer({
             layer: featureLayer,
             field: 'sum_estprojectcost',
             basemap: 'dark-gray',
             classificationMethod: "quantile"
          }).then(function (response) {
             featureLayer.setRenderer(response.renderer);
             featureLayer.redraw();
             createLegend(map, featureLayer, 'sum_estprojectcost');
          });
      setInfoTemplate(featureLayer);
  }
       //Create a legend
       function createLegend(map, layer, field) {
          //If applicable, destroy previous legend
          if (legend) {
             legend.destroy();
             domConstruct.destroy(dom.byId("legendDiv"));
          }

          legend = new Legend({
             map: map,
             layerInfos: [{
                layer: layer,
                title: " "
          }]
          }, 'legendDiv');
          legend.startup();
       };
  });

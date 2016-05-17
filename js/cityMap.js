/**
 * Created by CYH on 2015/11/30.
 */

//兼容浏览器，不支持IE8-
$(function () {
    //console.log(navigator.userAgent);
    if (navigator.userAgent.indexOf('MSIE') >= 0 ||
        navigator.userAgent.indexOf('Trident') >= 0){
        $('#console').css({height: $(document).height() - 11 + 'px',width: '400px',margin: '-1px -1px'});
        $('#json_s').css({top: '367px'});
    } else if (navigator.userAgent.indexOf('Firefox') >= 0) {
        $('#console').css({height: $(document).height() - 9 + 'px',width: '400px',margin: '-1px -1px'});
        $('#json_s').css({top: '395px'});
    }
});

Array.prototype.unique = function()
{
    var n = {},r=[]; //n为hash表，r为临时数组
    for(var i = 0; i < this.length; i++) //遍历当前数组
    {
        if (!n[this[i]]) //如果hash表中没有当前项
        {
            n[this[i]] = true; //存入hash表
            r.push(this[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
};

var lzzy_index = 1;
var lzzy_name_fjm = [];
//加载百度离线地图 柳州市
var lzzy_map = new BMap.Map("map");
var lzzy_js = '';

lzzy_map.addControl(new BMap.NavigationControl());
lzzy_map.addControl(new BMap.OverviewMapControl());
lzzy_map.addControl(new BMap.ScaleControl({
    offset: new BMap.Size(14,5),
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT
}));
//设置中心点
var lzzy_location = new BMap.Point(120.665502,31.338949);
lzzy_map.centerAndZoom( lzzy_location, 9);

/* 加载边界 */
function loadEdge(jsonURL, fillColor, strokeColor, tmp) {
    if ($.inArray(tmp[0], lzzy_name_fjm) === -1) {
        lzzy_name_fjm.push(tmp[0]);
        $.getJSON(jsonURL, function (data) {
            var dataJson = data['coordinates'][0][0],
                points = [];
            for (var i = 0; i < dataJson.length; i ++) {
                var pt = new BMap.Point(dataJson[i][0],dataJson[i][1]);
                points.push(pt);
            }
            //console.log(points);
            var pol = new BMap.Polygon(points, {
                strokeOpacity: 1,
                fillColor: fillColor,
                strokeWeight: 1,
                strokeColor: strokeColor,
                fillOpacity: 1,
                strokeTitle: tmp.join(",")
            });
            lzzy_map.addOverlay(pol);
        });
    }
}

$(document).on('keyup', function (event) {
    if (event.keyCode == 13) {
        lzzy_index += 1;
        var $input = $('<input type="text" name="json" id="json'+lzzy_index+'" />');
        $input.appendTo($('#json_s'));
        $input.focus();
        return false;
    }
});

$('#addJson').on('click' ,function () {
    lzzy_index += 1;
    var $input = $('<input type="text" name="json" id="json'+lzzy_index+'" />');
    $input.appendTo($('#json_s'));
    $input.focus();
    return false;
});

$('#zoomMax').on('click', function () {
    $('#console').animate({width: '900px'}, 500);
});

$('#zoomMin').on('click', function () {
    $('#console').animate({width: '400px'}, 500);
});

$('#putJson').on('click', function () {
    var point   = $('input[name=point]').val().trim();
    var host    = $('input[name=host]').val().trim();
    var folder  = $('input[name=folder]').val().trim();
    var jsons   = $('input[name=json]');
    lzzy_map.centerAndZoom(new BMap.Point(point.split(',')[0],point.split(',')[1]),8);
    jsons.each(function (index, item) {
        if ($(item).val().trim() != '') {
            if ($(item).val().trim().indexOf('\\') === -1) {
                alert('请正确填写分级码');
                return;
            }
            var jsonURL = host + "/edge/" + folder + $(item).val().trim().split("\\")[0] + ".json";
            var tmp = [];
            tmp.push($(item).val().trim().split("\\")[0]);
            tmp.push($(item).val().trim().split('\\')[1]);
            var setting = $('#setting').val().trim();
            var fillColor = setting.split('\\')[1];
            var strokeColor = setting.split('\\')[2];
            loadEdge(jsonURL, fillColor,strokeColor,tmp);
        }
    });
});

$('#svgJS').on('click' ,function () {
    var setting = $('#setting').val().trim();
    var reg = setting.split('\\')[0];
    var fillColor = setting.split('\\')[1];
    var strokeColor = setting.split('\\')[2];
    var attr = setting.split('\\')[3];
    var js = 'var '+reg+'map = [];' +
             'function paint'+reg.replace(/(\w)/,function(v){return v.toUpperCase()})+'(gx) {' +
             'var attr = {' +
             '"fill": "'+fillColor+'",' +
             '"stroke": "'+strokeColor+'",' +
             '"stroke-width": 1,' +
             '"stroke-linejoin": "round"' +
             '};\n';
    //console.log(lzzy_name_fjm);
    var paths = $('#map').find('path');
    paths.each(function (index,item) {
        //console.log($(item).attr('d'));
        js += reg + 'map.'+ reg + (index + 1) + ' = {' +
              'name: "'+$(item).attr('stroketitle').split(',')[0]+'",'+
              'areanum: "'+$(item).attr('stroketitle').split(',')[1]+'",' +
              'color: "'+attr+'",'+
              'path: gx.path("' + $(item).attr('d') + '").attr(attr).attr({"fill":"'+attr+'"})' +
              '};\n';
    });
    js += '}';
    $('#console').val(js);
});










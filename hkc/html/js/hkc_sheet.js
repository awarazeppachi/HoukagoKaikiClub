//  動的にイベントを作成する
// HTMLを少しでも軽くしたかっただけなんだ、すまない。。。
function init_create_event(){for (var id=1;id<=52;id++) {$('#growth'+id).change(function(){calc_total()});}}
function calc_total(){for (var id=1;id<=52;id++) {$('#total'+id).html($('#growth'+id).val() * 1 + $('#pre' + id).html()*1)};}



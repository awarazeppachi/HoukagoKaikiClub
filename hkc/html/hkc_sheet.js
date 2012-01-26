//  動的にイベントを作成する
// HTMLを少しでも軽くしたかっただけなんだ、すまない。。。
function init_create_event(){for (var id=1;id<=52;id++) {$('#growth'+id).change(function(){calc_total()});}}
function calc_total(){for (var id=1;id<=52;id++) {$('#total'+id).html($('#growth'+id).val() * 1 + $('#pre' + id).html()*1)};}
//  キャラクター作成支援ツールで作ったデータを読み込む
function init_load()
{
  $('#dialog_password').css('display', 'none');
  $('#save_dialog').dialog({
    position: [100, 150],
    width: 400,
    modal: true,
    resizable: false,
    draggable: false,
    title: "∩（＞ヮ＜）q＜ロードするよーー！",
    buttons: {
      "ロードする" : function(){
        if ('' != $('#data_name').val()) {
          execute_init_load();
          $(this).dialog('close');
        } else {
          alert("∩（＞ヮ＜）q＜シート名がないよー！");
        }
      },
      "やめた" : function() {
        $(this).dialog('close');
      },
    }
  });
}
function execute_init_load()
{
  $.ajax({
    type: 'GET',
    url: './hkc_data.cgi?dt=dl',
    data: 'n=' + $('#data_name').val(),
    dataType: 'json',
    success: function(data) {
      if(!data){
        alert('∩（＞ヮ＜）q＜ロードできなかったよーー！');
        return;
      }
      //  データを取得できたので涼ちんハグしたい
      $('#name').val(data.profile.name);
      $('#grade').val(data.profile.grade);
      $('#club').val(club_list[data.profile.club]);
	    // 能力値	
      $('#STR').val(data.parameter.STR);
      $('#DEX').val(data.parameter.DEX);
      $('#INT').val(data.parameter.INT);
      $('#CON').val(data.parameter.CON);
      $('#APP').val(data.parameter.APP);
      $('#POW').val(data.parameter.POW);
      $('#SIZ').val(data.parameter.SIZ);
      $('#EDU').val(data.parameter.EDU);
      setSubParameter('#INT', '#IDE');
      setSubParameter('#POW', '#SAN');
      setSubParameter('#POW', '#LUC');
      setSubParameter('#EDU', '#KNW');
      calcHP();
      calcMP();
      // SKILL
      for(id in data.skill) {
	      var skill = data.skill[id];
        $('#pre' + id).html(skill.total);
      }
	  alert('∩（＞ヮ＜）q＜ロードしたよーー！');
    }
  });
}
function sheet_save()
{
  $('#dialog_password').css('display', 'block');
  $('#save_dialog').dialog({
    position: [100, 150],
    width: 400,
    modal: true,
    resizable: false,
    draggable: false,
    title: "∩（＞ヮ＜）q＜セーブするよーー！",
    buttons: {
      "セーブする" : function(){
        if ('' != $('#data_password').val() && '' != $('#data_name').val()) {
          execute_sheet_save();
          $(this).dialog('close');
        } else {
          alert("∩（＞ヮ＜）q＜シート名とパスワードがないよー！");
        }
      },
      "やめた" : function() {
        $(this).dialog('close');
      },
    }
  });
}
function execute_sheet_save()
{
  var json_save = new Object();
  json_save['profile'] = {
    'name' : $('#name').val(),
    'grade':  $('#grade').val(),
    'club' : $('#club').val()
  };
  json_save['parameter'] = {
    'STR' : $('#STR').val(),
    'DEX' : $('#DEX').val(),
    'INT' : $('#INT').val(),
    'CON' : $('#CON').val(),
    'APP' : $('#APP').val(),
    'POW' : $('#POW').val(),
    'SIZ' : $('#SIZ').val(),
    'EDU' : $('#EDU').val(),
    'SANNOW' : $('#SAN_NOW').val()
  };
  json_save['skill'] = new Object();
  for (i = 1;i<=52;i++) {
    json_save['skill'][i] = new Object();
    json_save['skill'][i]['pre'] = $('#pre'+i).html();
    json_save['skill'][i]['growth'] = $('#growth'+i).val();
    json_save['skill'][i]['total'] = $('#total'+i).html();
  };
  $.ajax({
    type : 'POST',
    url  : './hkc_data.cgi?dt=ds',
    data : 'n=' + $('#data_name').val() + '&p=' + $('#data_password').val() + '&parameter=' + JSON.stringify(json_save) ,
    dataType: 'json',
    success: function(code) {
      if('1' == code.status) {
        alert("∩（＞ヮ＜）q＜セーブしたよーー！");
      } else {
        alert("∩（＞ヮ＜）q＜セーブできなかったよーー！");
      }
    }
  });
}
function sheet_load()
{
  $('#dialog_password').css('display', 'none');
  $('#save_dialog').dialog({
    position: [100, 150],
    width: 400,
    modal: true,
    resizable: false,
    draggable: false,
    title: "∩（＞ヮ＜）q＜ロードするよーー！",
    buttons: {
      "ロードする" : function(){
        if ('' != $('#data_name').val()) {
          execute_sheet_load();
          $(this).dialog('close');
        } else {
          alert("∩（＞ヮ＜）q＜シート名がないよー！");
        }
      },
      "やめた" : function() {
        $(this).dialog('close');
      },
    }
  });
}
function execute_sheet_load()
{
  $.ajax({
    type: 'GET',
    url: './hkc_data.cgi?dt=dl',
    data: 'n=' + $('#data_name').val(),
    dataType: 'json',
    success: function(data) {
      if(!data){
        alert('∩（＞ヮ＜）q＜ロードできなかったよーー！');
        return;
      }
      //  データを取得できたので涼ちんハグしたい
      $('#name').val(data.profile.name);
      $('#grade').val(data.profile.grade);
      $('#club').val(data.profile.club);
	      // 能力値	
      $('#STR').val(data.parameter.STR);
      $('#DEX').val(data.parameter.DEX);
      $('#INT').val(data.parameter.INT);
      $('#CON').val(data.parameter.CON);
      $('#APP').val(data.parameter.APP);
      $('#POW').val(data.parameter.POW);
      $('#SIZ').val(data.parameter.SIZ);
      $('#EDU').val(data.parameter.EDU);
      $('#SAN_NOW').val(data.parameter.SANNOW);
      setSubParameter('#INT', '#IDE');
      setSubParameter('#POW', '#SAN');
      setSubParameter('#POW', '#LUC');
      setSubParameter('#EDU', '#KNW');
      calcHP();
      calcMP();
      // SKILL
      for(id in data.skill) {
	      var skill = data.skill[id];
        $('#pre' + id).html(skill.pre);
        $('#growth' + id).val(skill.growth);
        $('#total' + id).html(skill.total);
      }
      calc_total();
    	alert('∩（＞ヮ＜）q＜ロードしたよーー！');
    }
  });
}



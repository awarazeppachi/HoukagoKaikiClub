//	∩（＞ヮ＜）q＜セーブしよー！
function save()
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
                execute_save();
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
function execute_save()
{
  var json_save = new Object();
  json_save['profile'] = {
    'name' : $('#name').val(),
    'grade':  $('#grade').val(),
    'club' : $('#club option:selected').val()
  };
  json_save['parameter'] = {
    'STR' : $('#STR').val(),
    'DEX' : $('#DEX').val(),
    'INT' : $('#INT').val(),
    'CON' : $('#CON').val(),
    'APP' : $('#APP').val(),
    'POW' : $('#POW').val(),
    'SIZ' : $('#SIZ').val(),
    'EDU' : $('#EDU').val()
  };
  json_save['skill'] = new Object();
  for (i = 1;i<=skill_num;i++) {
    json_save['skill'][i] = new Object();
    json_save['skill'][i]['club']   = $('#club'+i).val();
    json_save['skill'][i]['prof']   = $('#prof'+i).val();
    json_save['skill'][i]['total']  = $('#total'+i).val();
    if (0 < $('#skill_name' + i).size()) {
      json_save['skill'][i]['name']  = $('#skill_name' + i).html();
    } else {
      json_save['skill'][i]['name']  = 'default';
    }
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
function load()
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
        if ('' != $('#data_name').val()) {execute_load();$(this).dialog('close');} 
        else {alert("∩（＞ヮ＜）q＜シート名がないよー！");}
      },
      "やめた" : function() {$(this).dialog('close');},
    }
  });
}
function execute_load()
{
    $.ajax({
      type: 'POST',
      url: './hkc_data.cgi?dt=dl',
      data: 'n=' + $('#data_name').val(),
      dataType: 'json',
      success: function(data) {
        if(!data){
          alert('∩（＞ヮ＜）q＜ロードできなかったよーー！');
          return;
        }
        $('#name').val(data.profile.name);
        $('#grade').val(data.profile.grade);
        $('#club').val(data.profile.club);
        markUpSkill();
    	// 能力値	
        $('#STR').val(data.parameter.STR);
        $('#DEX').val(data.parameter.DEX);
        $('#INT').val(data.parameter.INT);
        $('#CON').val(data.parameter.CON);
        $('#APP').val(data.parameter.APP);
        $('#POW').val(data.parameter.POW);
        $('#SIZ').val(data.parameter.SIZ);
        $('#EDU').val(data.parameter.EDU);
        calcSubParameterAndSkillPoint();
        // SKILL
        for(id in data.skill) {
  	      var skill = data.skill[id];
          //  追加スキルか?
          if ('default' != skill.name) {
            skill_num++;
            $('#skill_sheet_3').append(getArtisticSkillRow(skill.name, '00', skill_num));
          }
	        $('#club' + id).val(skill.club);
          $('#prof' + id).val(skill.prof);
          $('#total' + id).val(skill.total);
        }
    	alert('∩（＞ヮ＜）q＜ロードしたよーー！');
      }
    });
}

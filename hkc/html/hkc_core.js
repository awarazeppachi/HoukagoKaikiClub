//  副能力値の決定
function setSubParameter(src, target){$(target).val($(src).val() * 5);};
// [INT]を計算。整数型じゃないよ
function onKeyUpInt(){setSubParameter('#INT', '#IDE');calcFreePoint();};
// [POW]を計算。
function onKeyUpPow(){setSubParameter('#POW', '#SAN');setSubParameter('#POW', '#LUC');calcMP();};
// [EDU]を計算。
function onKeyUpEdu(){setSubParameter('#EDU', '#KNW');calcSkillClub();};
// [HP]を計算
function calcHP(){
  var hp = Math.ceil( ($('#CON').val() * 1 +$('#SIZ').val() * 1)/2);
  $('#HP').val(hp);
};
// [MP]を計算。
function calcMP(){$('#MP').val($('#POW').val())};
//  部活動ポイントが変わった
function clubKeyUp()
{
  calcSkillClub();
  calcTotalSkillPoint();
}
//  自由入力ポイント欄が変わった
function profKeyUp()
{
  calcFreePoint();
  calcTotalSkillPoint();
}
//  ヘッダ要素の見た目で遊ぶ
function warningHeader()
{
    $('header').css('background-color', WARNING_COLOR);
    $('header').css('box-shadow-color', WARNING_COLOR);
}
//　もとに戻すよー！
function normalHeader()
{
    $('header').css('background','black');
    $('header').css('box-shadow-color','black');
}
//  onReady go!
$(document).ready(function(){
    //  URLにキーコードが含まれている場合はロードを行う
    var url = $.url();
    var param = $.url().param(); 
    if (param.code) {
        $('#sheeturl').val('?code=' + param.code);
        $('#CODE').val(param.code);
        load();
    }
    clubSkillPointLock();
});
//  ダイスを振るよーー！
function dice(n, m){return 1 == n ? Math.floor(Math.random()*m)+1 : dice(1, m) + dice(n-1, m);};
//	∩（＞ヮ＜）q＜セーブしよー！
function save()
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
    json_save['skill'][i]['club'] = $('#club'+i).val();
    json_save['skill'][i]['prof'] = $('#prof'+i).val();
    json_save['skill'][i]['total'] = $('#total'+i).val();
  };
  $.ajax({
    type : 'POST',
    url  : './hkc_data.cgi?dt=ds',
    data : 'parameter=' + JSON.stringify(json_save),
    dataType: 'text',
    success: function(code) {
     alert("∩（＞ヮ＜）q＜セーブしたよーー！");
     var url = $.url();
     $('#sheeturl').val('?code=' + code);
     $('#CODE').val(code);    
    }
  });
}
function load()
{
  var code = $('#CODE').val();
  if (code) {
    $.ajax({
      type: 'GET',
      url: './hkc_data.cgi?dt=dl&k=' + code,
      dataType: 'json',
      success: function(data) {
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
	    $('#club' + id).val(skill.club);
            $('#prof' + id).val(skill.prof);
            $('#total' + id).val(skill.total);
        }
    	alert('∩（＞ヮ＜）q＜ロードしたよーー！');
      }
    });
  }
}

/*
	放課後怪奇くらぶキャラクター作成支援ツール
	あれこれ用JavaScript
	書いた人：zeppachi
*/

//  能力値をダイス振って決めたいあなたへ
function parameter(){
  $('#STR').val(dice(3,6));
  $('#DEX').val(dice(3,6));
  $('#INT').val(dice(2,6)+6);
  $('#CON').val(dice(3,6));
  $('#APP').val(dice(3,6));
  $('#POW').val(dice(3,6));
  $('#SIZ').val(dice(3,6));
  $('#EDU').val(dice(3,6)+3);
  //自動計算
  calcSubParameterAndSkillPoint();
}
//  能力値からスキルポイント、副能力値などを計算し設定する
function calcSubParameterAndSkillPoint()
{
  onKeyUpInt();
  onKeyUpPow();
  onKeyUpEdu();
  onKeyUpDex();
  calcHP();
  calcMP();
  calcSkillClub();
  calcFreePoint();
  calcTotalSkillPoint();
}
// 部活動で割り振れるポイントの計算
function calcSkillClub()
{
  //  最大値
  var max_skillpoint = $('#EDU').val() * 20;
  //  現在利用している値
  var sum = 0;
  for (id=1;id<=skill_num;id++){
    sum = sum + $('#club'+id).val() * 1;
  }
  $('#skill_club').html(max_skillpoint-sum);
  if (max_skillpoint-sum < 0) {
    warningHeader();
  } else {
    normalHeader();
  }
}
// 自由に割り振れるポイントの計算
function calcFreePoint()
{
  //  最大値
  var max_skillpoint = $('#INT').val() * 10;
  //  現在利用している値
  var sum = 0;
  for (id=1;id<=skill_num;id++){
    sum = sum + $('#prof'+id).val() * 1;
  }
  $('#skill_free').html(max_skillpoint-sum);
  if (max_skillpoint-sum < 0) {
    warningHeader();
  } else {
    normalHeader();
  }
}
// 全ポイントの総計を取得
function calcTotalSkillPoint()
{
  var club_count = 0;
  for (id=1;id<=skill_num;id++){
    if ('99' ==  $('#club option:selected').val()) {
      //  帰宅部だけの処理
        if ('' != $('#club' + id).val() && 0 != $('#club' + id).val()) {
          club_count++;
          if (KITAKUBU_SKILL_NUM <= club_count) {
            //  これ以上増やさせないの
            emptySkillPointLock();
          }
        } else {
          $('#club' + id).attr('readonly', false);
          $('#club' + id).css('background', 'white');
        }
    }
    $('#total' +id).val(
      $('#prof'+id).val() * 1
    + $('#club'+id).val() * 1
    + $('#pre' +id).html() * 1
    );
  }
}
function emptySkillPointLock()
{
  for (id=1;id<=skill_num;id++) {
    if ('' == $('#club' + id).val() || 0 == $('#club' + id).val()) {
      $('#club' + id).attr('readonly', true);
      $('#club' + id).css('background', '#999');
    }
  }
}
// 部活動で割り振れるポイント入力欄をロックする
function clubSkillPointLock()
{
  for (id=1;id<=skill_num;id++) {
    $('#club' + id).attr('readonly', true);
    $('#club' + id).css('background', '#999');
  }
}
// 選択できる技能を強調表示する
function markUpSkill()
{
  var club_id = $('#club option:selected').val();
  if ('' == club_id) {return;}
  //    スキル欄の初期化
  removeExtraArtisticSkill();
  //    帰宅部
  if ('99' == club_id) {
    for (i = 1;i<=skill_num;i++) {
        $('#club' + i).attr('readonly', false);
        $('#club' + i).css('background', 'white');
    }
    return;
  }
  //    帰宅部以外
  var club_data = club[club_id];
  clubSkillPointLock();
  for (idx in club_data) {
    // 追加芸術?
    var skill_id = club_data[idx];
    if (100 < club_data[idx]) {
	    addExtraArtisticSkill(extra_art[club_data[idx]]);
	    skill_id = skill_num;
    };
    $('#club' + skill_id).attr('readonly', false);
    $('#club' + skill_id).css('background', 'white');
  }
}
//  [芸術]技能の入力欄を追加する
function addExtraArtisticSkill(name)
{
  skill_num++;
  $('#skill_sheet_3').append(getArtisticSkillRow('芸術/' + name, '05', skill_num));
}
// 削除
function removeExtraArtisticSkill()
{
  for (i=DEFAULT_SKILL_NUM + 1;i<=skill_num;i++){
   $('#row' +i).remove();
  }
  skill_num = DEFAULT_SKILL_NUM * 1;
}
//
function getArtisticSkillRow(name, default_point, id)
{
  return "<tr id='row" + id + "'><td>" + name + "</td><td id='pre" + id + "'>" + default_point + "</td><td><input type='text' size='3' maxlength='3' onKeyUp='clubKeyUp()' id='club" + id + "'></td><td><input type='text' size='3' maxlength='3' onKeyUp='profKeyUp()' id='prof" + id + "'></td><td><input type='text' size='3' maxlength='3' readonly='readonly' id='total" + id + "'></td></tr>";
}
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
    json_save['skill'][i]['club'] = $('#club'+i).val();
    json_save['skill'][i]['prof'] = $('#prof'+i).val();
    json_save['skill'][i]['total'] = $('#total'+i).val();
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
            if ('' != $('#data_name').val()) {
                execute_load();
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
	      $('#club' + id).val(skill.club);
          $('#prof' + id).val(skill.prof);
          $('#total' + id).val(skill.total);
        }
    	alert('∩（＞ヮ＜）q＜ロードしたよーー！');
      }
    });
}

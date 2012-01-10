/*
	放課後怪奇くらぶキャラクター作成支援ツール
	あれこれ用JavaScript
	書いた人：zeppachi
*/
//	部活動で有効化される技能欄。MagicNumber!?ナンデ?
var club = {
  0 : [13, 22, 29, 7],
  1 : [18, 12, 29, 20, 14],
  2 : [15, 18, 29, 17],
  3 : [24,5,42,46],
  4 : [27,24,46],
  5 : [26,25,24,46],
  6 : [48, 24, 46],
  7 : [48, 42, 24, 40, 46],
  8 : [42, 40, 24, 46],
  9 : [25,28,42,46],
 10 : [48,42,24,46],
 11 : [39, 22, 42, 46],
 12 : [1, 2, 36, 31],
 13 : [1,46, 10,7,5],
 14 : [46,6,32],
 15 : [46,6,1],
 16 : [46,2,29,38,37],
 17 : [1,37,2,10,31,29],
 18 : [46,7],
 19 : [101]
};
var extra_art = {
 101: '野球'
};
const WARNING_COLOR = "#eb6101";
var   skill_num = 49;
const DEFAULT_SKILL_NUM = 49;
//  onReady go!
$(document).ready(function(){clubSkillPointLock();});
//  ダイスを振るよーー！
function dice(n, m){return 1 == n ? Math.floor(Math.random()*m)+1 : dice(1, m) + dice(n-1, m);};
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
  onKeyUpInt();
  onKeyUpPow();
  onKeyUpEdu();
  calcHP();
  calcMP();
  calcSkillClub();
  calcFreePoint();
  calcTotalSkillPoint();
}
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
// 部活動で割り振れるポイントの計算
function calcSkillClub(){
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
function calcFreePoint(){
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
  for (id=1;id<=skill_num;id++){
    $('#total' +id).val(
      $('#prof'+id).val() * 1
    + $('#club'+id).val() * 1
    + $('#pre' +id).html() * 1
    );
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
  // スキル欄の初期化
  removeExtraArtisticSkill();
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



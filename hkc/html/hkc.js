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
  calcHP();
  calcMP();
  calcSkillClub();
  calcFreePoint();
  calcTotalSkillPoint();
}
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

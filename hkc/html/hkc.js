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
 18 : [46,7]
};
const WARNING_COLOR = "#eb6101";
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
function onKeyUpInt(){setSubParameter('#INT', '#IDE');calcFreePoint();};
function onKeyUpPow(){setSubParameter('#POW', '#SAN');setSubParameter('#POW', '#LUC');calcMP();};
function onKeyUpEdu(){setSubParameter('#EDU', '#KNW');calcSkillClub();};
function calcHP(){
  var hp = Math.ceil( ($('#CON').val() * 1 +$('#SIZ').val() * 1)/2);
  $('#HP').val(hp);
};
function calcMP(){$('#MP').val($('#POW').val())};
function calcSkillClub(){
  //  最大値
  var max_skillpoint = $('#EDU').val() * 20;
  //  現在利用している値
  var sum = 0;
  for (id=1;id<=49;id++){
sum = sum + $('#club'+id).val() * 1;
  }
  $('#skill_club').html(max_skillpoint-sum);
  if (max_skillpoint-sum < 0) {
    warningHeader();
  } else {
    normalHeader();
  }
}
function calcFreePoint(){
  //  最大値
  var max_skillpoint = $('#INT').val() * 10;
  //  現在利用している値
  var sum = 0;
  for (id=1;id<=49;id++){
    sum = sum + $('#prof'+id).val() * 1;
  }
  $('#skill_free').html(max_skillpoint-sum);
  if (max_skillpoint-sum < 0) {
    warningHeader();
  } else {
    normalHeader();
  }
}
function calcTotalSkillPoint()
{
  for (id=1;id<=49;id++){
    $('#total' +id).val(
      $('#prof'+id).val() * 1
    + $('#club'+id).val() * 1
    + $('#pre' +id).html() * 1
    );
  }
}
function clubSkillPointLock()
{
  for (id=1;id<=49;id++) {
    $('#club' + id).attr('readonly', true);
    $('#club' + id).css('background', '#999');
  }
}
function markUpSkill()
{
  var club_id = $('#club option:selected').val();
  if ('' == club_id) {
return;
  }
  var club_data = club[club_id];
  clubSkillPointLock();
  for (idx in club_data) {
    $('#club' + club_data[idx]).attr('readonly', false);
    $('#club' + club_data[idx]).css('background', 'white');
  }
}
//  部活動ポイントが変わった
function clubKeyUp()
{
  calcSkillClub();
  calcTotalSkillPoint();
}
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
function normalHeader()
{
    $('header').css('background','black');
    $('header').css('box-shadow-color','black');
}


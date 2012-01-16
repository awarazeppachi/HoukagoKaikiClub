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

//  ダイスを振るよーー！
function dice(n, m){return 1 == n ? Math.floor(Math.random()*m)+1 : dice(1, m) + dice(n-1, m);};


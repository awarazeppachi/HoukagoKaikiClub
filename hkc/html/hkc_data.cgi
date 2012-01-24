#!/usr/bin/perl
use CGI;
use Digest::MD5 qw/md5_hex/;
$main::data_dir = './data';
#--------------------------------------------------
$main::cgi = new CGI;

my  $datatype = $main::cgi->url_param('dt');
print "Content-Type:text/plain\n\n";        #   Q.CGI.pmでナンデ書かないの? A.面倒
print 'dl' eq $datatype ? load() : 'ds' eq $datatype ? save() : '';
exit;
#---------------------------------------------------
sub save
{
  my ($key_code, $password, $dataname) = getParameter();
  if (('' eq $key_code) or ('' eq $password) or ('' eq $dataname)) {
    return "{'status': '0'}";
  } else {
    datasave($keycode, $password, $dataname, $contents);
    return "{'status': '1'}";
  }
}
sub load
{
  my ($key_code, $password, $dataname) = getParameter();
  #いくら何でも雑すぎるでしょここ
  my $filename = getDataFileName($key_code);


}
sub dataload
{
  my ($filename, $password, $dataname) = @_;
  open $file, '<', $filename;
  my   $data = <$file>;
  close $file;  
  my ($password_md5, $dataname_md5, $contents) = split("\e", $data);
  if ( ($password_md5 eq md5_hex($password)) and ($dataname_md5 eq md5_hex($dataname)) {
    return $data;
  } else {
    return undef;
  } 
}
sub datasave
{
  my ($keycode, $password, $dataname, $contents) = @_;
  open my $file, ">" , getDataFileName($keycode);
  print $file join("\e", md5_hex($password), md5_hex($dataname), $contents);
  close $file;  
}
sub getParameter
{
  my $key_code = $main::cgi->param('k');
  my $password = $main::cgi->param('p');
  my $dataname = $main::cgi->param('n');
  return ($key_code, $password, $dataname);
}
sub getDataFileName
{
  my $key_code = shift;
  return $main::data_dir . '/' . md5_hex($key_code);
}

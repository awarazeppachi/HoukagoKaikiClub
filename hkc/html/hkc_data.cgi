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
  my ($dataname, $password) = getParameter();
  eval{datasave($password, $dataname, $main::cgi->param('parameter'))};
  if($@){return '{"status" : "0"}'};
  return '{"status" : "1"}';
}
sub load
{
  my ($dataname, $password) = getParameter();
  my $filename = getDataFileName($dataname);
  return dataload($filename);
}
sub check_password
{
  my ($filename, $password) = @_;
  open my $file, '<', $filename;
  my   $data = <$file>;
  close $file;  
  my ($password_md5, $contents) = split("\e", $data);
  if ($password_md5 eq md5_hex($password)) {
    return 1;
  } else {
    return 0;
  } 
}
sub dataload
{
  my ($filename) = @_;
  open my $file, '<', $filename;
  my   $data = <$file>;
  close $file;  
  my ($password_md5, $contents) = split("\e", $data);
  return $contents;
}
sub datasave
{
  my ($password, $dataname, $contents) = @_;
  my $filename = getDataFileName($dataname);
  # 既に存在しているか?
  if (-e $filename) {
    # Fileが存在している
    if (0 == check_password($filename, $password)) {
      #残念、パスワードが違う
      die 'password check failed...';
    }
  }
  open my $file, ">" , $filename;
  print $file join("\e", md5_hex($password), $contents);
  close $file;  
}
sub getParameter
{
  my $dataname = $main::cgi->param('n');
  my $password = $main::cgi->param('p');
  return ($dataname, $password);
}
sub getDataFileName
{
  return $main::data_dir . '/' . md5_hex(shift);
}

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
  return dataload($filename, $password);
}
sub dataload
{
  my ($filename, $password) = @_;
  open $file, '<', $filename;
  my   $data = <$file>;
  close $file;  
  my ($password_md5, $contents) = split("\e", $data);
  if ($password_md5 eq md5_hex($password)) {
    return $contents;
  } else {
    return undef;
  } 
}
sub datasave
{
  my ($password, $dataname, $contents) = @_;
  open my $file, ">" , getDataFileName($dataname);
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
  my $key_code = shift;
  return $main::data_dir . '/' . md5_hex($key_code);
}

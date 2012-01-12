#!/usr/bin/perl
use CGI;
use Digest::MD5 qw/md5_hex/;
$main::data_dir = './data';
#--------------------------------------------------
$main::cgi = new CGI;

my  $datatype = $main::cgi->url_param('dt');
print "Content-Type:text/plain\n\n";
print 'dl' eq $datatype ? data_load() : 'ds' eq $datatype ? data_save() : '';
exit;
#---------------------------------------------------
sub data_save
{
  my $key_code = md5_hex(time());
  # 壮絶に酷い処理なので後で直すこと
  open my $file, ">" , getDataFileName($key_code);
  print $file $main::cgi->param('parameter');
  close $file;
  return $key_code;
}
sub data_load
{
  my $key_code = $main::cgi->param('k');
  print STDERR  "KEYCODE:" . $key_code . "\n";
  #いくら何でも雑すぎるでしょここ
  my $filename = getDataFileName($key_code);
  print STDERR "FILENAME:" . $filename . "\n";
  if (-e $filename) {
    open $file, '<', $filename;
    my   $data = <$file>;
    close $file;
    print STDERR "DATA:" . $data . "\n";
    return $data;
  } else {
    return "{'status':'not_found'}";
  }
}
sub getDataFileName
{
  my $key_code = shift;
  return $main::data_dir . '/' . md5_hex($key_code);
}

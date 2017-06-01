//when served by django on Raspberry-Pi (Gentoo 4.x,Django 1.10)
//Blank works because no vhosts and default / is routed correctly by apache
//192.168.68.1 would probably work, too, for same single vhost
//var server_hostname="";
//
//when served by django on Ubuntu w/ vhosts needs FQDN
//var server_hostname="http://xtcpd.asymptopia.org";
//
//for e- remote cross-site; needs to be dns-recognizable
//var serverhostname="http://xtcpd.asymptopia.org";
//
//for e- DNS registered w/ A record -> 192.168.68.1
//var server_hostname="http://sirius.asymptopia.org";
var server_hostname="http://192.168.1.1";
//
//for e- This works b/c only 1 server/vhost at this addr
//var server_hostname="http://192.168.68.1";

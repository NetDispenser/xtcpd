//when served by django on Raspberry-Pi (Gentoo 4.x,Django 1.10)
//Blank works because no vhosts and default / is routed correctly by apache
//192.168.68.1 would probably work, too, for same single vhost
//var xtcpd_hostname="";
//
//when served by django on Ubuntu w/ vhosts needs FQDN
//var xtcpd_hostname="http://xtcpd.asymptopia.org";
//
//for e- remote cross-site; needs to be dns-recognizable
//var xtcpd_hostname="http://xtcpd.asymptopia.org";
//
//for e- DNS registered w/ A record -> 192.168.68.1
var xtcpd_hostname="http://spytools.asymptopia.org";
//
//for e- This works b/c only 1 server/vhost at this addr
//var xtcpd_hostname="http://192.168.68.1";

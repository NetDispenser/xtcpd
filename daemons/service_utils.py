from SimpleXMLRPCServer import SimpleXMLRPCServer
import os,string,logging,json,re,datetime,time
import sys,threading,thread,random,urllib2,copy
import xmlrpclib

"""
These routines are shared by django and external daemons (located in services directory),
thus no django references allowed (or will crash daemons).
"""
#SETUP_URL="sirius.autoteach.net/setup"
#SETUP_URL="www.autoteach.net/setup"
#SETUP_URL="feeder/setup"
#RECEIVE_URL="www.autoteach.net/receive"

AM_DEMO=False
INTERFACE="eth0"#wlan0
CREDIT_METER_TIMEOUT=30

TCP_SERVICE_PORT=8008
ACCESS_LOG_SERVICE_PORT=8009
MESSAGES_SERVICE_PORT=8010
TRAFFIC_SERVICE_PORT=8011
DJANGO_SERVICE_PORT=8012
RC_SERVICE_PORT=8013
METER_SERVICE_PORT=8014
MEMORY_PORT=8015

APACHE_ACCESS_LOG="/var/log/apache2/access_log_parks"
LOGDIR="/var/log/lanwatch"
DJANGO_LOG=os.path.join(LOGDIR,"django_daemon_messages.log")
CREDIT_LOG=os.path.join(LOGDIR,"credit_meter_daemon.log")
NETWORK_LOG=os.path.join(LOGDIR,"network_traffic_daemon.log")
ACCESS_LOG=os.path.join(LOGDIR,"access_log_daemon.log")
LISTENER_LOG=os.path.join(LOGDIR,"django_listener_daemon.log")
TCP_LOG=os.path.join(LOGDIR,"tcp_daemon.log")
MEMORY_LOG=os.path.join(LOGDIR,"memory_daemon.log")


HOSTNAME="dev.asymptopia.org"#"127.0.0.1"#"192.168.31.1"#"rpi.asymptopia.org"
BUFFSIZE=100.#seconds: keep this small for safety ... daemons will delete buffer beyond t=BUFFSIZE.  Increase saved length via .js saved
TSLEEP=1.5
hexchars=['8','9','A','B','C','D','E','F']#'0','1','2','3','4','5','6','7',

ERROR_LOGS=[
	'/var/log/apache2/error.log',	#geonode
	'/var/log/apache2/error.const',	#const
	'/var/log/apache2/error.aorg',	#aorg
	'/var/log/apache2/error.pac',	#pac
]
ACCESS_LOGS=[
	'/var/log/apache2/access.log',	#geonode
	'/var/log/apache2/access.const',#const
	'/var/log/apache2/access.aorg',	#aorg
	'/var/log/apache2/access.pac',	#pac
]

def device_from_mac(mac):
	wc=WifiClient.objects.get(mac=mac)
	device_name=wc['device_name']
	return device_name
	
def generate_random_color():
	color=""
	for cidx in range(6):
		for ridx in range(len(hexchars)):
			color+=hexchars[cidx]
	return color

def get_best_name(n):
	infname='/var/lib/misc/dnsmasq.leases'
	inf=open(infname)
	lines=inf.readlines()
	inf.close()
	for line in lines:
		if string.find(line,n)>-1:
			sline=string.split(line,' ')
			return sline[3]
	return n
	
def mktstamp():
	tstamp="%s"%datetime.datetime.now()
	truncated=string.split(tstamp,".")[0]
	return  truncated

def get_rpc_hostname():
	
	if True:
		return HOSTNAME
	
	if AM_DEMO:
		return HOSTNAME
	try:
		cmd="ifconfig %s"%INTERFACE
		#logging.debug(cmd)
		p=os.popen(cmd)
		lines=p.readlines()
		p.close()
		s1=string.split(lines[1],":",1)[1]
		s2=string.strip(string.split(s1," ",1)[0])
		return s2
	except Exception,e:pass
	return "192.168.66.1"

RPC_HOSTNAME=get_rpc_hostname()



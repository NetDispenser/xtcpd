from SimpleXMLRPCServer import SimpleXMLRPCServer
import os,string,logging,json,re,datetime,time
import sys,threading,thread,random,urllib2,copy
"""
This cannot live in service_utils b/c service_utils is shared btw django and non-django daemons and import paths differ.
This is called from django-side, so import w/ django module path.
"""

from router.services.models import *
from router.services.service_utils import *
from router.atauth.models import *

def process_pckts(pckts):
	
	logging.debug("process_pckts processing %d pckts"%len(pckts))
	need_upload=False
	
	for pckt in pckts:
		
		logging.debug(json.dumps(pckt))
		
		wc=None
		if pckt.has_key('mac'):
			
			if pckt['mac']=="":continue
			msg="pckt['mac']=%s"%pckt['mac']
			logging.debug(msg)
			
			try:
				wc=WifiClient.objects.get(mac=pckt['mac'])
			except Exception,e:
				wc=WifiClient()
				wc.mac=pckt['mac']
				atusers=ATUser.objects.all()#we're on the router so it's okay
				for atuser in atusers:
					if atuser.is_parent:
						wc.account_id=atuser.account_id
				wc.save()
				logging.debug("New WifiClient %s saved"%wc.mac)
				need_upload=True
				
		elif pckt.has_key('ip'):
			try:wc=WifiClient.objects.get(ip=pckt['ip'])
			except Exception,e:pass
			
		else:
			logging.debug("that pckt did not have key==mac or ip ... did nothing!")
		
		
		if wc!=None:
			
			wc.last_contact=datetime.datetime.now()
			
			if pckt.has_key('service'):
				if pckt['service']=='sshd':
					#logging.debug("!!NOT SETTING LINUX USERNAME (sshd)  FOR DJANGO SESSION!!")
					return
			
			for key in pckt.keys():
				if key=='ip':
					if wc.ip!=pckt['ip']:
						wc.ip=pckt['ip']
						wc.save()
						need_upload=True
						
				if key=='device_name':
					if wc.device_name!=pckt['device_name']:
						wc.device_name=pckt['device_name']
						wc.save()
						need_upload=True
						
				if key=='username':
					if wc.username!=pckt['username']:
						wc.username=pckt['username']
						wc.save()
						need_upload=True
				
				if key=='status':
					
					if pckt[key]=='connected':
						logging.debug("setting connection_status='1'")
						wc.connection_status="1"
						wc.save()
						logging.debug("saved:%s"%wc.connection_status)
					
					if pckt[key]=='disconnected':
						logging.debug("setting connection_status='0'")
						wc.connection_status="0"
						wc.save()
						logging.debug("saved:%s"%wc.connection_status)
						
			#upload to online database for web-sync
			if need_upload:
				atusers=ATUser.objects.all()#we're on the router so it's okay
				for atuser in atusers:
					if atuser.is_parent:
						account_id=atuser.account_id
						username=atuser.username
						password=atuser.password
						
						wc_mac=wc.mac
						wc_device_name=wc.device_name
						wc_username=wc.username
						wc_ip=wc.ip
						
						url="http://%s?account_id=%s&username=%s&password=%s&wc_mac=%s&wc_device_name=%s&wc_username=%s&wc_ip=%s"%(RECEIVE_URL,account_id,username,password,wc_mac,wc_device_name,wc_username,wc_ip)
						logging.debug(url)
						f=urllib2.urlopen(url)
						rval=f.read(100)
						f.close()
						logging.debug("client sent to online website")

				
"""	
	account_id=models.SlugField()
	mac=models.CharField(max_length=17,default="Unk")
	device_name=models.CharField(max_length=100,default="Unk")
	username=models.CharField(max_length=30,default="Unk")
	ip=models.IPAddressField(default="0.0.0.0")
	history=PickledObjectField()
"""

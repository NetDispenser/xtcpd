#!/usr/bin/python
import thread,time,string,re,os,unicodedata,math,sys
from string import *
import pygeoip
from dict_formatter import *
from mk_whois import *

gip=pygeoip.GeoIP("/usr/share/GeoIP/GeoLiteCity.dat")
MONTHLIST=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
YEARLIST=['2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017']
date_re = re.compile(r'''(?P<day>\d*)/(?P<month>.*)/(?P<year>\d*):(?P<hour>\d*):(?P<min>\d*):(?P<sec>\d*) *(?P<gmt_offset>.*)''')

def ProcessLine(a):
	
	rdict={}
	
	try:ip=a.group(1)
	except:ip="0.0.0.0"
		
	try:
		netrange_orgname=myWhoisLookup(ip)
		if not netrange_orgname:
			print 'calling doExternLookup'
			wdict=doExternLookup(ip)
			newRecord(wdict,ip)
			netrange_orgname=myWhoisLookup(ip)
		
		if not netrange_orgname:
			netrange='Netrange Not Found'
			orgname='Orgname Not Found'
		else:
			netrange=string.split(netrange_orgname,"\t")[0]
			orgname=string.split(netrange_orgname,"\t")[1]
	
	except Exception,e:
		print "netrange/orgname exception: ",e,ip
		netrange="0.0.0.0 -  0.0.0.0"
		orgname=ip
		
	
	try:
		dmy=a.group(2) 		#day/month/year
		dmy=string.split(dmy,'/',2)
		dmy="%04s:%02d:%02s"%(dmy[2],MONTHLIST.index(dmy[1])+1,dmy[0])
	except Exception,e:
		print "dmy exception: ",e
		dmy="0000:00:00"
	
	try:tod=a.group(3) 		#time of day
	except Exception,e:
		print "tod exception: ",e
		tod="unknown"
	
	#tzone=a.group(4) 	#timezone
		
	try:rcode=a.group(6) 	#code 200 for success, 404 for not found, etc.
	except Exception,e:
		print "tod exception: ",e
		rcode=999
	
	try:bytes=a.group(7) 	#bytes transferred
	except Exception,e:
		print "bytes exception: ",e
		bytes=999
	
	try:refer=a.group(8)[1:-1] 	#referrer
	except Exception,e:
		print "refer exception: ",e
		refer=""
	
	try:browser=a.group(9)[1:-1]#browser
	except Exception,e:
		print "browser exception: ",e
		browser=""
	
	req=action=url=None	
	try:
		req=a.group(5)[1:-1]#request
		split_req=string.split(req,' ',3)
		
		action=split_req[0]
		
		url=split_req[1]
		#action=split_req[2]
	except Exception,e:
		print "req exception: ",e
		if not req:req=""
		if not action:action=""
		if not url:url=""

	rdict['ip']=ip
	rdict['netrange']=netrange
	
	rdict['orgname']=string.strip(orgname)
	orgname=rdict['orgname']
	if not orgname:orgname=''
	safe_orgname=''
	for ridx in range(len(orgname)):
		try:safe_orgname+=unicode(orgname[ridx])
		except Exception,e:
			print 'UNICODE SKIP:orgname = ',orgname
		
	rdict['orgname']=safe_orgname

	rdict['tstamp']=dmy
	rdict['bytes']=bytes
	rdict['refer']=refer
	rdict['browser']=browser
	rdict['rcode']=rcode
	
	rdict['url']=url
	url=rdict['url']
	if not url:url=''
	safe_url=''
	for ridx in range(len(url)):
		try:safe_url+=unicode(url[ridx])
		except Exception,e:
			print 'UNICODE SKIP:url = ',url
		
	rdict['url']=safe_url

	rdict['action']=action
	rdict['tod']=tod

	try:
		rec=gip.record_by_addr(ip)
		
	except:
		pass
		
	if not rec:	
		rec={
			'city': '', 
			'region': '', 
			'area_code': 0.0, 
			'longitude': 0.0, 
			'country_code3': '', 
			'latitude': 0.0, 
			'postal_code': '', 
			'dma_code': 0, 
			'country_code': '', 
			'country_name': ''
		}
	
	#keys returned @frontend:
	#keys=['tod','ip','city','region','country_name','orgname','rcode','url']
	
	city=rec['city']
	if not city:city=''
	safe_city=''
	for ridx in range(len(city)):
		try:safe_city+=unicode(city[ridx])
		except Exception,e:
			print 'UNICODE SKIP:city = ',city
		
	rdict['city']=safe_city


	region=rec['region_code']
	if not region:region=''
	safe_region=''
	for ridx in range(len(region)):
		try:safe_region+=unicode(region[ridx])
		except Exception,e:
			print 'UNICODE SKIP:region = ',region
		
	rdict['region']=safe_region
	
	
	rdict['area_code']=rec['area_code']
	rdict['longitude']=rec['longitude']
	rdict['latitude']=rec['latitude']
	rdict['country_code']=rec['country_code']

	country_name=rec['country_name']
	if not country_name:country_name=''
	safe_country_name=''
	for ridx in range(len(country_name)):
		try:safe_country_name+=unicode(country_name[ridx])
		except Exception,e:
			print 'UNICODE SKIP:country_name = ',country_name
	
	rdict['country_name']=safe_country_name
	
	rdict['postal_code']=rec['postal_code']
	rdict['dma_code']=rec['dma_code']
	rdict['country_code3']=rec['country_code3']
	
	for key in rdict.keys():
		if rdict[key]==None:rdict[key]=""
		if not rdict[key]:rdict[key]=''
	
	return rdict
	

from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
import logging,json,time,os,string,sys,datetime
PY3=True
#FORMAT = '%(asctime)-15s %(message)s'
FORMAT = 'VIEWS: %(message)s'
logging.basicConfig(filename='/var/log/xtcpd/xtcpd.log',level=logging.INFO, format=FORMAT)

import xmlrpc.client

#from lanwatch.daemons.service_utils import *
#from lanwatch.models import NetworkEvent
from django.contrib.auth.decorators import login_required


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def editor(request):
	logging.debug("editor")
	if len(request.META['QUERY_STRING'])>0:
		logging.debug('query_string')
	if request.method=="POST":
		logging.debug(request.POST.get('mytextarea'))
		logging.debug(request.POST)
	return render(request, 'editest.html',
		context={'title': 'EdiTest',},
		content_type='text/html'
	)

def lanwatch(request):
	return render(request,'lanwatch2017.html',context={'title':'LAN-Watch'},content_type="text/html")

def traffic(request):
	#traffic->getalldata?
	#logging.debug(request.META)
	try:
		qs=request.META['QUERY_STRING']
		if len(qs)>1:
			s=None
			rval={
			'keys':['tstamp','msg',],
			'tstamp':str(datetime.datetime.now()),
			'msg':'01 Next: rpc call to get ifstat from trafd',
			}
			if qs=='get_data':
				client_ip=str(get_client_ip(request))
				rval={}
				s=xmlrpc.client.Server("http://meter.creditfeed.me:8005")
				rval['traffic']=s.get_data((client_ip))
				s=xmlrpc.client.Server("http://meter.creditfeed.me:8009")#8000=xtcpd;8009=spectra
				rval['spectra']=s.get_data((client_ip))
				logging.debug("returned from call to spectrad")
				s=xmlrpc.client.Server("http://meter.creditfeed.me:8007")
				rval['clients']=s.get_data((client_ip))
				logging.debug("printing spectra")
				logging.debug(rval['spectra'])
				rval['t0']=time.time()-60.
				rval['t1']=time.time()
			return HttpResponse(json.dumps(rval))
	except:
		logging.exception(str(get_client_ip(request)))

	return render_to_response(
	    'traffic.html',{
			'keys':['tstamp','msg',],
			'tstamp':str(datetime.datetime.now()),
			'msg':'00 Next: rpc call to get ifstat from trafd',
		},
	)

@login_required
def xtcpd(request):
	#logging.debug(request.META)
	try:
		qs=request.META['QUERY_STRING']
		if len(qs)>1:
			s=None
			if PY3:
				s=xmlrpc.client.Server("http://192.168.22.1:8000")
			else:
				s=xmlrpclib.Server("http://xtcpd.asymptopia.org:8000")
			#s=xmlrpc.client.Server("http://192.168.68.1:8000")
			client_ip=str(get_client_ip(request))
			if qs=='get_data':
				logging.debug(client_ip)
				rval=s.get_data((client_ip))
			elif qs=='toggle_debug':
				rval=s.toggle_debug()
			elif qs=='toggle_running':
				rval=s.toggle_running()
			elif qs=='reload_config':
				rval=s.reload_config()
			elif qs=='reset':
				rval=s.reset((client_ip))
			return HttpResponse( json.dumps(rval) )
	except:
		logging.exception(sys.exc_info())

	return render_to_response(
	    'xtcpd.html',{},
	)

def home(request):
	return render_to_response(
	    'd3.html',{},
	)

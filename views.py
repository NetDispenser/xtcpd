from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
import logging,json,time,os,string,sys
import xmlrpc.client

#from lanwatch.daemons.service_utils import *
#from lanwatch.models import NetworkEvent
from django.contrib.auth.decorators import login_required

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(filename='/var/log/xtcpd/xtcpd.log',level=logging.DEBUG, format=FORMAT)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def xtcpd(request):
	logging.debug(request.META)
	try:
		qs=request.META['QUERY_STRING']
		if len(qs)>1:
			s=xmlrpc.client.Server("http://hotspot.asymptopia.org:8000")
			#s=xmlrpc.client.Server("http://192.168.68.1:8000")
			if qs=='get_data':
				client_ip=str(get_client_ip(request))
				logging.debug(client_ip)
				rval=s.get_data((client_ip))
			elif qs=='toggle_debug':
				rval=s.toggle_debug()
			elif qs=='toggle_running':
				rval=s.toggle_running()
			elif qs=='reload_config':
				rval=s.reload_config()
			elif qs=='reset':
				rval=s.reset()
			return HttpResponse( rval )
	except:
		logging.exception(sys.exc_info())

	return render_to_response(
	    'xtcpd.html',{},
	)

def home(request):

	s=xmlrpc.client.Server("http://localhost:8000")
	rval=None
	try:rval=s.get_data()
	except:rval={}

	return render_to_response(
	    'xtcpd.html',{
            'title':'XTCPD',
			'rval':rval,
        },
	)

from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
import logging,json,time,os,string
import xmlrpc.client

#from lanwatch.daemons.service_utils import *
#from lanwatch.models import NetworkEvent
from django.contrib.auth.decorators import login_required

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(filename='/var/log/xtcpd/xtcpd.log',level=logging.DEBUG, format=FORMAT)

def home(request):
	s=xmlrpc.client.Server("http://localhost:8000")
	rval=s.is_even(3)
	return render_to_response(
                'xtcpd.html',
                {
                        'title':'xtcpd',
			'rval':rval,
                },
#                context_instance=RequestContext(request)
	)

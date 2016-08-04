from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
import logging,xmlrpclib,json,time,os,string

from lanwatch.daemons.service_utils import *
from lanwatch.models import NetworkEvent
from django.contrib.auth.decorators import login_required

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(filename='/var/log/lanwatch/lanwatch.log',level=logging.INFO, format=FORMAT)

@login_required
def home(request):
	#return HttpResponse("Yay")
	logging.debug("lanwatch.home")
	try:
		qs=request.META['QUERY_STRING']
		if len(qs)>1:


			if qs=='get_data':

				overview_pyld={}
				overview_pyld['t1']=time.time()

				server_str="http://%s:%s"%(RPC_HOSTNAME,MEMORY_PORT)
				logging.debug(server_str)
				s=xmlrpclib.Server(server_str)
				overview_pyld['memory_data']=s.get_data()
				logging.debug(overview_pyld['memory_data']);

				server_str="http://%s:%s"%(RPC_HOSTNAME,TRAFFIC_SERVICE_PORT)
				s=xmlrpclib.Server(server_str)
				overview_pyld['traffic_data']=s.get_data()

				server_str="http://%s:%s"%(RPC_HOSTNAME,TCP_SERVICE_PORT)
				s=xmlrpclib.Server(server_str)
				overview_pyld['tcp_data']=s.get_data()

				server_str="http://%s:%s"%(RPC_HOSTNAME,TCP_SERVICE_PORT)
				s=xmlrpclib.Server(server_str)
				overview_pyld['geoip_buffer']=s.get_geoip()

				server_str="http://%s:%s"%(RPC_HOSTNAME,ACCESS_LOG_SERVICE_PORT)
				s=xmlrpclib.Server(server_str)
				overview_pyld['apache_data']=s.get_data()

				p=os.popen('date')
				overview_pyld['server_date']=string.strip(p.readline())
				p.close()

				ev=NetworkEvent()
				ev.tstamp=time.time()
				ev.src_ip='208.111.39.69'
				ev.dest_ip=overview_pyld['geoip_buffer']['ip']
				ev.src_idn=0
				ev.dest_idn=overview_pyld['geoip_buffer']['ip_idn']
				ev.src_port=overview_pyld['geoip_buffer']['src_port']
				ev.dest_port=overview_pyld['geoip_buffer']['dest_port']
				ev.ctry_idn=overview_pyld['geoip_buffer']['idn_country']
				ev.lat=overview_pyld['geoip_buffer']['latitude']
				ev.lon=overview_pyld['geoip_buffer']['longitude']
				ev.save()
				logging.debug("NetworkEvent saved:"+ev.tstamp)
				#msg="%s\t%d\t%d"%(qs,len(overview_pyld['tcp_data']),len(overview_pyld['traffic_data']))
				#logging.debug(msg)

				return HttpResponse( json.dumps(overview_pyld) )

	except Exception,e:
		logging.exception("Exception getting data")


	return render_to_response(
		'lanwatch.html',
		{
			'title':'LAN-Watch'
		},
		context_instance=RequestContext(request)
	)

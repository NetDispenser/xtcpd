from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
import logging,xmlrpclib,json

RPC_HOSTNAME="www.asymptopia.org"
ACCESS_LOG_PORT=8029

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(filename='/var/log/lanwatch/lanwatch.log',level=logging.DEBUG, format=FORMAT)

def home(request):
	#return HttpResponse("Yay")
	try:
		qs=request.META['QUERY_STRING']
		if len(qs)>1:
			logging.debug(qs)
			server_str="http://%s:%s"%(RPC_HOSTNAME,ACCESS_LOG_PORT)
			s=xmlrpclib.Server(server_str)
			
			if qs=='get_data':
				logging.debug("calling get_data")
				#data=s.get_data()
				#logging.debug(len(data))
				data={'hello':'data'}
				return HttpResponse( json.dumps(data) )
	
	except Exception,e:
		logging.exception("Exception getting data")
	
	
	return render_to_response(
		'lanwatch.html',
		{
			'title':'LAN-Watch'
		},
		context_instance=RequestContext(request)
	)

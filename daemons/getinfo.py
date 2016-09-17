#!/usr/bin/python
import xmlrpc.client

client_ip="127.0.0.1"
rval={}
s=xmlrpc.client.Server("http://spytools.asymptopia.org:8005")
rval['traffic']=s.get_data((client_ip))
s=xmlrpc.client.Server("http://spytools.asymptopia.org:8009")#8000=xtcpd;8009=spectra
rval['xtcpd']=s.get_data((client_ip))
s=xmlrpc.client.Server("http://spytools.asymptopia.org:8007")
rval['clients']=s.get_data((client_ip))

keys=rval['xtcpd']['data']['keys']
keys.sort()
for k in keys:
	print(k)
	for ip in rval['xtcpd']['data'][k]['ips']['keys']:
		print("\t%s: %s"%(ip,rval['xtcpd']['data'][k]['ips'][ip]))

print(rval['clients'])
print (keys)

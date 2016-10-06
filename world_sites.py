#!/usr/bin/python3
import os
sites=[
	'http://www.garena.co.id',
	'http://www.news.com.au/',
	'http://www.vedur.is/',
	'http://www.cic.gc.ca/english/',
	'http://www.cdmx.gob.mx/',
	'',
	'',
]
for site in sites:
	cmd="wget %s"%site
	print(cmd)
	p=os.popen(cmd)
	garbage=p.readline()
	p.close()

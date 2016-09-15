#!/usr/bin/python

db={
'192.168.66.0 - 192.168.66.255':{'netrange':'192.168.66.0 - 192.168.66.255'},
'208.11.0.0 - 208.11.255.255':{'netrange':'208.11.0.0 - 208.11.255.255'},
'132.001.001.0 - 132.001.001.255':{'netrange':'132.1.1.0 - 132.1.1.255'},
'128.33.0.0 - 128.36.255.255':{'netrange':'128.33.0.0 - 128.36.255.255'},
}

class dbMgr:
	def __init__(self):
		print ('dbMgr')

	def lookup(self,ipn):
		for key in db.keys():
			min4,max4=key.split(" - ")
			min4=min4.split('.')
			max4=max4.split('.')
			mid4=ipn.split('.')
			for i in range(4):
				if int(min4[i]) <= int(mid4[i]) and int(mid4[i])<=int(max4[i]):pass
				else:break
				if i==3:
					print('Found it:'+key)
					return db[key]

		return None

if __name__=='__main__':
	x=dbMgr()
	rval=x.lookup('128.34.120.9')
	print(rval)

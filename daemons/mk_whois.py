#!/usr/bin/python
"""
When used standalone, this collection of functions (+ main @bottom) parse logfile(s) -> myWhois.db
All functions are standalone, though, so imported -> webalyzerd
"""
import string,os,re,sys


rexp = re.compile('(\d+\.\d+\.\d+\.\d+) - - \[([^\[\]:]+):(\d+:\d+:\d+) -(\d\d\d\d)] ("[^"]*") (\d+) (-|\d+) ("[^"]*") (".*")\s*\Z')

def randomIP():
	a=int(random.random()*256)
	b=int(random.random()*256)
	c=int(random.random()*256)
	d=int(random.random()*256)
	
	ip="%d.%d.%d.%d"%(a,b,c,d)
	return ip
	
def pad(ip):
	a=eval(string.split(ip,'.')[0])
	b=eval(string.split(ip,'.')[1])
	c=eval(string.split(ip,'.')[2])
	d=eval(string.split(ip,'.')[3])
	
	IP="%03d.%03d.%03d.%03d"%(a,b,c,d)
	return IP	

def get2xNetRange(ip):
	#print "get2xNetRange(%s)"%ip
	a=eval(string.split(ip,'.')[0])
	b=eval(string.split(ip,'.')[1])
	#c=eval(string.split(ip,'.')[2])
	#d=eval(string.split(ip,'.')[3])
	netrange="%d.%d.0.0 - %d.%d.255.255"%(a,b,a,b)
	#print "get2xNetRange(%s) returning %s"%(ip,netrange)
	return netrange
	
def get1xNetRange(ip):
	#print "get1xNetRange(%s)"%ip
	a=eval(string.split(ip,'.')[0])
	b=eval(string.split(ip,'.')[1])
	c=eval(string.split(ip,'.')[2])
	netrange="%d.%d.%d.0 - %d.%d.%d.255"%(a,b,c,a,b,c)
	#print "get1xNetRange(%s) returning %s"%(ip,netrange)
	return netrange
	
def get3xHead(ip):
	a=eval(string.split(ip,'.')[0])
	b=eval(string.split(ip,'.')[1])
	c=eval(string.split(ip,'.')[2])
	head="%d.%d.%d"%(a,b,c)
	return head

def get2xHead(ip):
	a=eval(string.split(ip,'.')[0])
	b=eval(string.split(ip,'.')[1])
	head="%d.%d"%(a,b)
	return head

def get1xHead(ip):
	#print "get1xHead(%s)"%ip
	a=eval(string.split(ip,'.')[0])
	head="%d"%(a)
	#print "get1xHead(%s) returing %s"%(ip,head)
	return head

def checkHeadMatches(headMatchLines,ip):
	
	#print "headMatchLines=",headMatchLines
	
	a=eval(string.split(ip,'.')[0])
	b=eval(string.split(ip,'.')[1])
	c=eval(string.split(ip,'.')[2])
	d=eval(string.split(ip,'.')[3])
	
	for line in headMatchLines:
		try:
			netRange=string.lstrip(line.split("\t",1)[0])
			netMin=string.lstrip(string.rstrip(netRange.split("-",1)[0]))
			netMax=string.lstrip(string.rstrip(netRange.split("-",1)[1]))
			
			amin=eval(string.split(netMin,'.')[0])
			bmin=eval(string.split(netMin,'.')[1])
			cmin=eval(string.split(netMin,'.')[2])
			dmin=eval(string.split(netMin,'.')[3])
			
			amax=eval(string.split(netMax,'.')[0])
			bmax=eval(string.split(netMax,'.')[1])
			cmax=eval(string.split(netMax,'.')[2])
			dmax=eval(string.split(netMax,'.')[3])
			
			if amin<=a<=amax:pass
			else:continue
			
			if bmin<=b<=bmax:pass
			else:continue
	
			if cmin<=c<=cmax:pass
			else:continue
	
			if dmin<=d<=dmax:pass
			else:continue
			
			return line
		
		except Exception,e:
			print line,e
	
	return False
		
def myWhoisLookup(ip):
	"""
	#032609: Found this on ... was short-circuiting new lookups!	
	#iplist: already looked-up
	cmd="grep \"%s\" iplist"%ip
	#print cmd
	#return None
	p=os.popen(cmd)
	line=p.readline()
	p.close()
	if len(line)>6:return line
	"""
	
	"""
	#unknowns: lookup trouble
	cmd="grep \"%s\" unknowns"%ip
	p=os.popen(cmd)
	line=p.readline()
	p.close()
	if len(line)>6:return line
	"""
	
	netrange=get2xNetRange(ip)
	cmd="grep \"%s\" myWhois.db"%netrange
	p=os.popen(cmd)
	line2x=p.readline()
	p.close()
	if len(line2x)>6:return line2x
	#print cmd,' failed'
	
	netrange=get1xNetRange(ip)
	cmd="grep \"%s\" myWhois.db"%netrange
	p=os.popen(cmd)
	line1x=p.readline()
	p.close()
	if len(line1x)>6:return line1x
	#print cmd,' failed'
	
	#now grepping outward ...
	for i in range(3,0,-1):
		if False:pass
		elif i==3:head=get3xHead(ip)
		elif i==2:head=get2xHead(ip)
		elif i==1:head=get1xHead(ip)
		cmd="grep \"%s\" myWhois.db"%head
		p=os.popen(cmd)
		head3xmatches=p.readlines()
		p.close()
		#print 'calling checkHeadMatches ...'
		rval=checkHeadMatches(head3xmatches,ip)
		#print 'back from checkHeadMatches'
		if rval:return rval
		#print cmd,' failed'
	
	netrange=ip#0x netrange
	cmd="grep \"%s\" myWhois.db"%netrange
	p=os.popen(cmd)
	line=p.readline()
	p.close()
	if len(line)>6:return line
	#print cmd,' failed'

	return None

def doExternLookup(ip):
	rec={}
	cmd="whois %s"%ip
	pipe=os.popen(cmd)
	lines=pipe.readlines()
	pipe.close()
	for lidx in range(len(lines)):
		line=lines[lidx]
		if line.count("#"):continue
		
		elif line.count(":"):
			split_line=line.split(':')
			if len(split_line)<2:
				if line=='\n':continue
				rec['unk'+`lidx`]=string.rstrip(line)
			else:
				key=split_line[0]
				val=string.rstrip(split_line[1])
				rec[key]=val
		
		elif line.count("[") and line.count("]"):
			try:
				#jp like 210.188.206.196 w/[key]
				idx_lhs=line.index("[")
				idx_rhs=line.index("]")
				key=string.lstrip(string.rstrip(line[idx_lhs+1:idx_rhs]))
				val=string.lstrip(string.rstrip(line[idx_rhs+1:len(line)-1]))
				rec[key]=val
				continue
			except:
				continue
		
		else:
			rec['unk'+`lidx`]=string.lstrip(string.rstrip(line))
		
	return rec
	
def toggle_template_bits(template_bits,addr):
	#addr in 0-255, template_bits="11111111"
	#Don't toggle "X" bits, but do toggle all others...
	bitvals=[128,64,32,16,8,4,2,1]
	sum=0
	toggled_template_bits=""
	for bidx in range(len(template_bits)):
		if sum+bitvals[bidx]<=eval(addr):
			if template_bits[bidx]!="X":
				toggled_template_bits+="1"
				sum+=bitvals[bidx]
			else:
				toggled_template_bits+="X"
					
		else:
			if template_bits[bidx]!="X":
				toggled_template_bits+="0"
			else:
				toggled_template_bits+="X"
		
	return toggled_template_bits

def cdir2ip(addr_subnetmask):
	
	"""
	The subnet mask determines what portion of the TCP/IP address represents 
	your network and what portion can be used for your hosts.
	"""
	
	addr=string.split(addr_subnetmask,"/")[0]
	submask=eval(string.split(addr_subnetmask,"/")[1])
	
	#Calculate the minimum of the ip range:
	split_addr=string.split(addr,".")
	min_addr=[]
	for qidx in range(len(split_addr)):
		min_addr.append(eval(split_addr[qidx]))
	for qidx in range(4-len(min_addr)):
		min_addr.append(0)
	

	#Now make a binary ip template using n=submask bits:
	template_bits=""
	for octet in range(0,4):
		for bit in range(0,8):
			count=8*octet+bit
			if count<submask:template_bits+="1"
			else:template_bits+="X"
			
		if octet<3:template_bits+="."
	
	print template_bits
	
	#Now toggle the non-X bits to correspond with the addr octets:
	split_addr=string.split(addr,".")
	split_template_bits=string.split(template_bits,".")
	toggled_template_bits=[]
	for qidx in range(len(split_addr)):
		toggled_template_bits.append(toggle_template_bits(split_template_bits[qidx],split_addr[qidx]))
	for qidx in range(4-len(toggled_template_bits)):
		toggled_template_bits.append("XXXXXXXX")
		
	print toggled_template_bits
	
	#Now calculate the max netrange by setting all "X" bits -> "1" and summing bitvals:
	max_addr=[]
	bitvals=[128,64,32,16,8,4,2,1]
	for qidx in range(len(toggled_template_bits)):
		int_sum=0
		octet=toggled_template_bits[qidx]
		for bidx in range(len(octet)):
			if octet[bidx]!="0":int_sum+=bitvals[bidx]
		max_addr.append(int_sum)
		
	#Now format the netrange:
	
	netrange="%d.%d.%d.%d - %d.%d.%d.%d"%(min_addr[0],min_addr[1],min_addr[2],min_addr[3],max_addr[0],max_addr[1],max_addr[2],max_addr[3])
	return netrange


def newRecord(wdict,ip):
	netrange_prefs=['NetRange','netrange','NetNum','netnum','inetnum','net-num','Network Number','Netblock']
	orgname_prefs=['OrgName','NetName','orgname','org-name','netname','orgid','netid','owner','Organization','Netname']
	netrange=ip
	orgname="Unknown"
	keys=wdict.keys()
	#print keys
	for nidx in range(len(netrange_prefs)):
		try:
			kidx=keys.index(netrange_prefs[nidx])
			#print keys[kidx]
			netrange=string.lstrip(wdict[keys[kidx]])
			break
		except:pass
	
	for oidx in range(len(orgname_prefs)):
		try:
			kidx=keys.index(orgname_prefs[oidx])
			#print keys[kidx]
			orgname=string.lstrip(wdict[keys[kidx]])
			break
		except:pass
	
	if netrange.count("/"):
		netrange=cdir2ip(netrange)
		#print "netrange=",netrange
		
	if orgname=="Unknown":
		if wdict.has_key('unk0') and wdict.has_key('unk1'):
			
			#Percent signs correspond to lookup limit exceeded warning!!
			if wdict['unk0'].count("%") or wdict['unk1'].count("%"):return
			if wdict['unk0'].count("No match"):return
			if wdict['unk1'].count("No match"):return
			
			orgname=wdict['unk0']
			try:
				oidx=orgname.index('(')
				orgname=orgname[0:oidx]
			except:pass		
			
			if netrange==ip:#already defined if Netblock, for example...
				for idx in range(1,5):
					if wdict['unk'+`idx`]=="":continue
					netrange=wdict['unk'+`idx`]
					break
			
			#record="%33s\t%s\n"%(netrange,orgname)
			#print record
			#return
			
	if orgname=="Unknown":
		cmd="echo \"%s\"|cat>>unknowns2"%ip
		os.system(cmd)
		return
	else:print "orgname=",orgname	
	
	record="%33s\t%s\n"%(netrange,orgname)
	ouf=open('myWhois.db','a')
	ouf.write(record)
	ouf.close()
	
	cmd="echo %s|cat>>iplist"%(ip)
	os.system(cmd)
	
if __name__=='__main__':
	
	ouf=open("unknowns","w")
	
	fnames=os.listdir('.')
	flist=[]
	print flist
	for fname in fnames:
		print fname,string.find('access_log',fname)
		if string.find(fname,'access_log')>-1:flist.append(fname)
	print flist
	for fname in flist:
		#if fname=='access_log_stripped':continue
		#cmd="./stripper.py %s"%fname
		#print cmd
		#continue
		#rval=os.system(cmd)
		#sys.exit()	
	
		#infname="access_log_stripped"
		#infname="access_log"
		infname=fname
		
		inf=open(infname)
		lines=inf.readlines()
		inf.close()
		
		lastip=None
		while len(lines)>0:
			line=lines.pop()
			a=rexp.match(line)
			ip=None
			
			try:
				ip=a.group(1)
				if ip==lastip:continue
				lastip=ip
				print ip
				ouf.write(ip+'\n')
				
			except:continue
	
	ouf.close()
	#sys.exit()
	
	inf=open('unknowns')
	lines=inf.readlines()
	inf.close()
	
	
	#lines=["68.3.29.29"]
	
	
	for ipidx in range(len(lines)):
			
			print "%d/%d"%(ipidx,len(lines))
			
			ip=lines[ipidx]
			ip=string.rstrip(ip)
			print 'current:',ip
			
			rval=None
			try:
				rval=myWhoisLookup(ip)
				#print 'back from myWhoisLookup'
			except Exception,e:
				print "Exception from myWhoisLookup ",ip,e
				#sys.exit()
			
			#continue
			
			if rval:print 'found:',rval,len(lines)
			else:
				#x=raw_input('performlookup '+ip+'?')
				#if x=='q':sys.exit
				try:
					wdict=doExternLookup(ip)
					newRecord(wdict,ip)
					new_rval=myWhoisLookup(ip)
					if new_rval:print 'new  :',new_rval,len(lines)
					else:print ip,'FAIL',wdict
				except Exception,e:
					print "Exception in doExternLookup/newRecord/myWhoisLookup ",ip,e
					
	#	cmd="rm access_log_stripped"
	#	os.system(cmd)

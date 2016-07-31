#!/usr/bin/env python
#Wed Jul 12 10:13:08 MDT 2000 CC
import os,time,string,sys
global statfields
statfields=[	'name',		'state',		'ppid',
		'pgrp',		'sessionid',		'tty',
		'tpgid',	'flags',		'minflt',
		'cminflt',	'majflt',		'cmajflt',
		'utime',	'stime',		'cutime',
		'cstime',	'counter',		'priority',
		'timeout',	'itrealvalue',		'starttime',
		'vsize',	'rss',			'rlim',
		'startcode',	'endcode',		'startstack',
		'kstkesp',	'kstkei',		'signal',
		'blocked',	'sigignore',		'sigcatch',
		'wchan'		
	   ]
statmfields=[	'tot_prog_size',
		'm_res_size',
		'n_pgs_shared',
		'n_pgs_code',
		'n_pgs_datastck',
		'n_pgs_lib',
		'n_pgs_drty'
	    ]
		
class Table:
	def __init__(self):
		global root,proctable,statfields
		root='/proc'
		proctable={}
		self.update()
		os.system('clear')
		print os.uname()
		
		
	def update(self):
		global root,proctable
		os.chdir(root)
		flist=os.listdir(root)
		dlist=[]
		proctable.clear()
		#make list of all process dirs:
		for f in flist:
			if os.path.isdir(f):
				try:garb=int(f);dlist.append(f)
				except:pass
				
		for d in dlist:
			dest=os.path.join(root,d)
			os.chdir(dest)
			f=open('stat')
			line=f.readline()
			stats=string.split(line,' ',36)
			
			#make proctable:
			stats[1]=string.replace(stats[1],'(','')
			stats[1]=string.replace(stats[1],')','')
			proctable[stats[0]]={}
			for i in range(1,35):
				try:
					proctable[stats[0]][statfields[i-1]]=stats[i]
				except:
					proctable[stats[0]][statfields[i-1]]=''
			#print proctable.keys()

	def PIDNAMES(self):
		global root,proctable
		sortedlist=[]
		self.update()
		keys=proctable.keys()
		for item in keys:
			item=int(item)
			sortedlist.append(item)
		sortedlist.sort()
		del keys;keys=[]
		for item in sortedlist:
			item=str(item)
			keys.append(item)
		del sortedlist
		for key in keys:
			print "%s\r\t%s" % (key,proctable[key]['name'])
			
	def show_ioports(self):
		try:
			os.system('cat /proc/ioports')
		except:	
			print 'failed(?!)';return 
			
	def show_stats(self):
		global root,proctable
		self.update()
		req=raw_input('Enter PID: ')
		if req=='':return 
		for item in statfields:
			print "%s\r\t\t%s"%(item,proctable[req][item])
		
		
	def memory_monitor(self):
		try:
		  while 1:
			os.system('clear')
			os.system('cat /proc/meminfo')
			time.sleep(1.5)
		except:
		  return 
			
	def killName(self,name):
		global root,proctable
		self.update()
		p2kill=name
		if p2kill=='':return 
		try:
			garb=int(p2kill)
			cmd='kill -9 '+p2kill
			os.system(cmd)
			return 
		except:
			for key in proctable.keys():
				if proctable[key]['name']==p2kill:
					cmd='kill -9 '+key
					os.system(cmd)
			return 

	def killproc(self):
		global root,proctable
		self.update()
		p2kill=raw_input('Enter Nothing(exit), PID or Name: ')
		if p2kill=='':return 
		try:
			garb=int(p2kill)
			cmd='kill -9 '+p2kill
			os.system(cmd)
			return 
		except:
			for key in proctable.keys():
				if proctable[key]['name']==p2kill:
					cmd='kill -9 '+key
					os.system(cmd)
			return 

	def show_cpuinfo(self):
		try:
			os.system('cat /proc/cpuinfo')
		except:
			print 'failed(?!)';return 
		
	def proc_summary(self,*args):
		if len(args)==0:return 
		PID=args[0]
		env=self.get_env(PID)
		try:print "\nPID\r\t%s"%PID
		except:pass
		try:print "USER\r\t%s"%env['USER']
		except:pass
		try:print "HOST\r\t%s"%env['HOST']
		except:pass
		try:print "DISPLAY\r\t%s"%env['DISPLAY']
		except:pass
		try:print ""
		except:pass
		
	def process_monitor(self):
		req=self.get_pid()
		if req=='':return 
		try:
			garb=int(req)
			choice=req
		except:
			choices=[]
			for key in proctable.keys():
				if proctable[key]['name']==req:
					choices.append(key)
			if len(choices)>0:
				for PID in choices:
					self.proc_summary(PID)
				choice=raw_input('choice? ')
		#Now we know which PID user wants...
		print 'MONITORING %s'%choice
		mdict={}
		try:
		   while 1:
		   	os.system('clear')
			file='/proc/'+choice+'/statm'
			#cmd='os.system(\'cat '+file+'\')'
			#exec cmd
			cmd='cat '+file
			f=os.popen(cmd)
			mlist = string.split(string.strip(f.readlines()[0]),' ',6)
			f.close
			#print mlist
			for i in range(0,len(statmfields)):
				print '%s\r\t\t%s'%(statmfields[i],mlist[i])
			
			time.sleep(1)
		except Exception,e:
			print e
		
	def monitor_all(self):
	   while 1:
		cmd='cat /proc/meminfo'
		meminfo=os.popen(cmd).readlines()
		
		mem=string.split(meminfo[1],' ',10)
		while 1:
		    try:mem.remove('')
		    except:break
		mtot=float(mem[1])
		muse=float(mem[2])
		puse=muse/mtot*100.
		#print mtot,muse,puse
		
		share=string.split(meminfo[5],' ',10)
		while 1:
		    try:share.remove('')
		    except:break
		share=float(share[1])*1000.
		
		buff=string.split(meminfo[6],' ',10)
		while 1:
		    try:buff.remove('')
		    except:break
		buff=float(buff[1])*1000.
		
		cache=string.split(meminfo[7],' ',10)
		while 1:
		    try:cache.remove('')
		    except:break
		cache=float(cache[1])*1000.
		
		swaptot=string.split(meminfo[8],' ',10)
		while 1:
		    try:swaptot.remove('')
		    except:break
		swaptot=float(swaptot[1])
		
		swapfre=string.split(meminfo[9],' ',10)
		while 1:
		    try:swapfre.remove('')
		    except:break
		swapfre=float(swapfre[1])
		try:
			pctswapuse=swapfre/swaptot*100.
		except:pctswapuse=0
		swapuse=swaptot-swapfre
		#print swaptot,swapfre,pctswapuse,swapuse
		
		
		self.update()
		pcs={}
		biggest={}
		keylist=[]
		totprocmem=0
		for key in proctable.keys():
			
			keylist.append(int(key))
			#print key
			
			file='/proc/'+key+'/statm'
			cmd='cat '+file
			f=os.popen(cmd)
			mlist = string.split(string.strip(f.readlines()[0]),' ',6)
			f.close()
			totprocmem=totprocmem+int(mlist[0])
			pcs[key]=[proctable[key]['name'],mlist[0],mlist[1],mlist[4],]
		
			pid=key
			biggest[mlist[0]]=pid
		
		biglist=[]
		thelist=biggest.keys()
		for item in thelist:
			x=int(item)
			biglist.append(x)
		biglist.sort()
		biglist.reverse()
		
		pidlist=[]
		for size in biglist:
			if size!=0:
				pidlist.append(biggest[`size`])
		
		os.system('clear')
		print '%s\r\t%s\r\t\t\t%s\r\t\t\t\t\t%s'%('pid','name','prog_siz','mem_res')
		#for key in pidlist:#note that pidlist!=dictionary
		for i in range(1,10):
			key=pidlist[i]
			print '%s\r\t%s\r\t\t\t%s\r\t\t\t\t\t%s'%(key,pcs[key][0],pcs[key][1],pcs[key][2])
		
		#keylist.sort()
		#print individual procs:
		#for key in keylist:
		#	#print type(key)
		#	print '%d\r\t%s\r\t\t\t%s\r\t\t\t\t\t%s'%(key,pcs[`key`][0],pcs[`key`][1],pcs[`key`][2])
		
		mem_cache=muse+cache
		mem_cache_share=mem_cache+share
		mem_cache_share_buff=mem_cache_share+buff
		
		print '\n'
		print '%s\r\t\t%s\r\t\t\t\t\t%s'%('swap','free','pctused')
		print '%d\r\t\t%d\r\t\t\t\t\t%d\n'%(swaptot,swapfre,pctswapuse)
		print '%s\r\t\t%s\r\t\t\t\t\t%s'%('mem','mem','totprocmem')
		print '%d\r\t\t%d\r\t\t\t\t\t%d\n'%(muse,muse,totprocmem*10000)
		print '%s\r\t\t%s\r\t\t\t\t\t%s'%('cache','mem_cache','totprocmem')
		print '%d\r\t\t%d\r\t\t\t\t\t%d\n'%(cache,mem_cache,totprocmem*10000)
		print '%s\r\t\t%s\r\t\t\t\t\t%s'%('share','mem_cache_share','totprocmem')
		print '%d\r\t\t%d\r\t\t\t\t\t%d\n'%(share,mem_cache_share,totprocmem*10000)
		print '%s\r\t\t%s\r\t\t\t\t\t%s'%('buffer','mem_cache_share_buf','totprocmem')
		print '%d\r\t\t%d\r\t\t\t\t\t%d'%(buff,mem_cache_share_buff,totprocmem*10000)
		time.sleep(1)
	   
	   return
	"""
	statmfields=[	'tot_prog_size',
		'm_res_size',
		'n_pgs_shared',
		'n_pgs_code',
		'n_pgs_datastck',
		'n_pgs_lib',
		'n_pgs_drty'
	    ]
	"""	
	def eth0_watcher(self):
		try:
		    while 1:
			os.system('clear')
		  	os.system('cat /proc/net/dev')
			time.sleep(1)
		except:return 
	
	def get_pid(self,*args):
		if len(args)==0:
			name=raw_input('Enter process name (or PID): ')
			if name=='':return 
			try:
				garb=int(name)
				#user entered PID already, so...
				return name
			except:pass
		else:
			name=args[0]
		choices=[]
		for key in proctable.keys():
			if proctable[key]['name']==name:
				choices.append(key)
		if len(choices)==0:return 
		for PID in choices:
			self.proc_summary(PID)
		choice=raw_input('choice? ')
		return choice
		
	def compare_2pids(self):
		global root,proctable
		pair=[]
		pair.append(self.get_pid())
		pair.append(self.get_pid())
		#pair=string.split(raw_input('Enter 2 PIDs: '),' ',2)
		self.update()
		print "%s\r\t\t%s\r\t\t\t\t%s"%('PID',pair[0],pair[1])
		for item in statfields:
			print "%s\r\t\t%s\r\t\t\t\t%s"%\
		 	(item,proctable[pair[0]][item],proctable[pair[1]][item])
			
	def get_statm(self):
		global root,proctable
		req=self.get_pid()
		if req=='':return 
		try:
			dest=os.path.join(root,req)
			os.chdir(dest)
			f=open('statm')
			s=f.readline()
			f.close()
			ss=string.split(s,' ',7);del s
			statm={}
			for key in statmfields:
				statm[key]=ss[statmfields.index(key)]
				print "%s\t%s"%(key,statm[key])
			del statm
		except:return 
	
	def get_env(self,*args):
		global root,proctable
		if len(args)==0:
			req=self.get_pid()
			if req=='':return 
			print 'getting ENV for PID=',req
		else:req=args[0]
		try:
			dest=os.path.join(root,req)
			os.chdir(dest)
			f=open('environ')
			s=f.readline()
			f.close()
			ss=string.split(s,'\000',100)
			del s;globals={}
			for item in ss:
				y=string.split(item,'=',2)
				globals[y[0]]=y[1]
			del ss;
		except:pass
		try:
			if len(args)==0:
				print globals
				globals.clear()
				return 
		except:
			return 
		try:
			return globals
		except:
			print 'NO INFO AVAILABLE'
			return 
		
				
	def menu(self):	
		global root,proctable
		raw_input('hit <return> to continue...')
		os.system('clear')
		print '1)  show PID:Names List'
		print '2)  killproc'
		print '3)  show stats'
		print '4)  memory monitor (system)'
		print '5)  show cpu info'
		print '6)  show ioports'
		print '7)  process monitor'
		print '8)  eth0 watcher'
		print '9)  get pid'
		print '10) compare stats (2 PIDs)'
		print '11) get env'
		print '12) get statm'
		print '13) monitor all'
		print 'q) exit'
		choice=raw_input('choice? ')
		self.update()
		if choice=='1':
			self.PIDNAMES()
		elif choice=='2':
			self.killproc()
		elif choice=='3':
			self.show_stats()
		elif choice=='4':
			self.memory_monitor()
		elif choice=='5':
			self.show_cpuinfo()
		elif choice=='6':
			self.show_ioports()
		elif choice=='7':
			self.process_monitor()
		elif choice=='8':
			self.eth0_watcher()
		elif choice=='9':
			self.get_pid()
		elif choice=='10':
			self.compare_2pids()
		elif choice=='11':
			self.get_env()
		elif choice=='12':
			self.get_statm()
		elif choice=='13':
			self.monitor_all()
		elif choice=='q':
			os.system('clear')
			return 0
		else: pass
		


if __name__=='__main__':
	x=Table()
	try:
		name=sys.argv[1]
		print 'killing %s'%name
		x.killName(name)
	except:
		while 1:
			val=x.menu()
			if val==0:break


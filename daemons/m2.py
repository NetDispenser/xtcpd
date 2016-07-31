#!/usr/bin/python
"""
m2: Multilog Monitor
Takes a list of logfiles, either from file or cmdline, and tails each, outputting the interleaved entries from all files, in chronological order.
"""
import os,sys,string,thread,time
DEBUG=True

class M2:
	def __init__(self):
		if DEBUG:print "M2.init"
		self.RUNNING=True
		self.flist=[]
		if len(sys.argv)==2:
			infname=sys.argv[1]
			inf=open(infname)
			lines=inf.readlines()
			inf.close()
			for line in lines:
				line=string.strip(line)
				if len(line)<1:continue
				if line[0]=="#":continue
				self.flist.append(line)
		
		
	
	def listener(self,args):
		#print "listener: %s"%args
		cmd="tail -0f %s"%args
		if DEBUG:print cmd
		p=os.popen(cmd)
		while self.RUNNING:
			line=os.path.basename(args)+": "+p.readline()
			line=string.strip(line)
			if len(line)>0:print line
			#time.sleep(1)
		
		print 'exiting',self.RUNNING
		p.close()
		thread.exit()	
		
	def run(self):
		self.RUNNING=True
		if DEBUG:print "M2.run"
		if DEBUG:print "launching %d threads"%len(self.flist)
		for idx in range(len(self.flist)):
			if DEBUG:print "launching %d: %s"%(idx,self.flist[idx])
			thread.start_new_thread(self.listener,(self.flist[idx],))
			
		while self.RUNNING:
			x=raw_input()
			if x=='q':
				self.RUNNING=False
				time.sleep(5)
				return 1

		
	
def show_usage():
	print "USAGE: m2.py [flist.txt | f1,f2,f3...]"
	
if __name__ == "__main__":
	if len(sys.argv)<2:show_usage()
	else:
		x=M2()
		rval=x.run()
		if DEBUG:print "M2.run returned rval=%d"%rval

sys.exit()

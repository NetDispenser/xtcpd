.. LAN-Watch documentation master file, created by
   sphinx-quickstart on Mon Jun 29 03:32:06 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

LAN-Watch has Documentation!
============================

.. image:: ./images/Screenshot_2014-12-25-22-14-20.png
This screenshot shows the original version which was tied to 
another project (autoteach).  This project (lanwatch) is re-implementing 
the same tool independent of other projects.


Contents:
=========

.. toctree::
   :maxdepth: 2



Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

Overview
========

LAN-Watch was designed for parents to see where their kids are connecting
and to monitor bandwidth.  LAN-Watch is a Web Application.  You use it by
pointing your browser at the lanwatch webpage after installation.

LAN-Watch comes in the form of a Django app.  You need to have a server running
Django before installing LAN-Watch.  



Daemon Configuration
====================

LAN-Watch uses 6 daemons that run as background processes on your server machine.  
The lanwatch webapp requests an update from the server every 5 seconds.  
These are AJAX requests so the page does not reload.  
The requests are received by lanwatch.views.home,
which pulls the latest from each of the 5 daemons and returns the 
lot as a JSON structure.

The 6 daemons are:

-  tcp_daemon maintains association between users and tcp/ip counts
-  messages_daemon monitors system messages via /var/log/messages
-  django_listener_daemon monitors django logfile /tmp/lanwatch.log
-  network_traffic_daemon  reads from /proc/net and handles running sums
-  credit_meter_daemon manages timers, accounts and firewall
-  acess_log_daemon monitors http requests to the web server (apache)

The configuration variables are all in: 
	**../lanwatch/daemons/service_utils.py**








Installation
============

- unpack lanwatch as an app under your django site
- add standard lanwatch to installed apps in settins.py
- add lanwatch/templates to template dirs in settings.py
- edit your site's urls.py with /lanwatch -> lanwatch.views.home
- restart apache
- navigate to http://your.site.com/lanwatch


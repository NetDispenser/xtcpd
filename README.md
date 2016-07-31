LAN-Watch (lanwatch)
====================

A Django App to deploy anywhere to monitor traffic at deployed system.

Look how easy it is to use:

    import project
    # Get your stuff done
    project.do_stuff()

Features
--------

- OpenLayers base map
- Realtime, Multiplexed data streams
- Traffic "spectrogram", i.e. freq and color by user


Installation
------------

Install LAN-Watch like any other Django app.  For example:
	cd /var/www/myserver
	git clone https://github.com/asymptopia/lanwatch.git 
	nano settings.py
		add 'lanwatch' to INSTALLED_APPS
		add '/var/www/myserver/lanwatch/' to TEMPLATE_DIRS
	nano urls.py
		url(r'^lanwatch','lanwatch/views.home',name='lanwatch'),


Contribute
----------

- Issue Tracker: github.com/asymptopia/lanwatch/issues
- Source Code: github.com/asymptopia/lanwatch

Support
-------

If you are having issues, please let us know.
We have a mailing list located at: lanwatch@googlegroups.com

License
-------

The project is licensed under the Create Commons Share Alike license.
=======
# LAN-Watch
A Django app to monitor traffic at deployed location.
>>>>>>> 31e5851558995c2946302cf4072f859049a8305e

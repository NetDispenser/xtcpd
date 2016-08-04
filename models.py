from __future__ import unicode_literals
from django.db import models
import os

class NetworkEvent(models.Model):
    tstamp=models.TimeField(auto_now=True)
    src_ip=models.GenericIPAddress()
    dest_ip=models.GenericIPAddress()
    src_idn=models.PositiveInteger()
    dest_idn=models.PositiveInteger()
    src_port=models.PositiveInteger()
    dest_port=models.PositiveInteger()
    ctry_idn=models.PositiveInteger()
    lat	= models.FloatField(blank=False)
    lon	= models.FloatField(blank=False)

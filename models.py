from __future__ import unicode_literals
from django.db import models
import os

class NetworkEvent(models.Model):
    tstamp=models.TimeField(auto_now=True)
    src_ip=models.GenericIPAddressField()
    dest_ip=models.GenericIPAddressField()
    src_idn=models.PositiveIntegerField()
    dest_idn=models.PositiveIntegerField()
    src_port=models.PositiveIntegerField()
    dest_port=models.PositiveIntegerField()
    ctry_idn=models.PositiveIntegerField()
    lat	= models.FloatField(blank=False)
    lon	= models.FloatField(blank=False)

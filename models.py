from __future__ import unicode_literals
from django.db import models
import os

class NetworkEvent(models.Model):
    tstamp=models.TimeField(auto_now=True)
    src_ip=models.GenericIPAddressField(blank=False)
    dest_ip=models.GenericIPAddressField(blank=False)
    src_idn=models.PositiveIntegerField(blank=False)
    dest_idn=models.PositiveIntegerField(blank=False)
    src_port=models.PositiveIntegerField(blank=False)
    dest_port=models.PositiveIntegerField(blank=False)
    ctry_idn=models.PositiveIntegerField(blank=False)
    lat	= models.FloatField(blank=False)
    lon	= models.FloatField(blank=False)

    def __unicode__(self):
        return `self.tstamp`

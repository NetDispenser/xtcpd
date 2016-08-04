from __future__ import unicode_literals
from django.db import models
import os
from tinymce.models import HTMLField

class NetworkEvent(models.Model):
    src_ip=models.GenericIPAddressField()
    src_idn=models.PositiveIntegerField()
    dst_ip=models.GenericIPAddressField()
    dst_idn=models.PositiveIntegerField()
    src_port=models.PositiveIntegerField()
    dst_port=models.PositiveIntegerField()
    tstamp=TimeField(auto_now=True)
    country_idn=models.PositiveIntegerField()
    lat=models.FloatField(blank=True)
    lon=models.FloatField(blank=True)

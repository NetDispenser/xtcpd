/***
	Global variables for LAN-Watch
***/

var LAYOUTS={
	'horizontal':{'division':0.60,'font':'12pt sans-serif','label_height':20,'SF':1.0},//AR>1
	'vertical':{'division':0.40,'font':'8pt sans-serif','label_height':15,'SF':0.75},//AR<1
};

var W_TCP_RECT=5;
var HOME_LONLAT=[-106.,32.];
var H_HEADER=35;
var H_FOOTER=50;
var H_BUTTON=40;
var H2_HEADER=H_HEADER+H_FOOTER;

var CLIENT_BUFFSIZE=50;
var TIMEOUT=5000;
var LOCKED_COLOR="orange";
var UNLOCKED_COLOR="#666666";
var DJANGO_COLOR="#ff7a68";
var LABEL_OPACITY=1.0;

IFACE_NAMES=["ETH0:","LO:"]

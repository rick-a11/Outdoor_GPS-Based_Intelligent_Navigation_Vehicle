#!/usr/bin/env python3

from gps3 import agps3
import coordTransform_py.coordTransform_utils as transform 
import time

#GPSDSocket creates a GPSD socket connection & request/retrieve GPSD output.
gps_socket = agps3.GPSDSocket()
#DataStream unpacks the streamed gpsd data into python dictionaries.
data_stream = agps3.DataStream()
gps_socket.connect()
gps_socket.watch()

gcj02_lng_lat = [0.0,0.0]
bd09_lng_lat = [0.0,0.0]

print('gps device make wgs84 coordinate\r\ngcj02 coordinate is for amap or google map\r\nbd09 coordinate is for baidu map\r\n\033[1;31m Please press Ctrl+c if want to exit \033[0m')
for new_data in gps_socket:
    if new_data:
        data_stream.unpack(new_data)
        if data_stream.lat != 'n/a' and data_stream.lon != 'n/a':
            gcj02_lng_lat = transform.wgs84_to_gcj02(float(data_stream.lon),float(data_stream.lat))
            bd09_lng_lat = transform.wgs84_to_bd09(float(data_stream.lon),float(data_stream.lat))
            print('altitude       = ', data_stream.alt,'M',end='\r\n',flush=True) 
            print('wgs84 lon,lat  = ',data_stream.lon,',',data_stream.lat,end='\r\n',flush=True)                   # gps device make
            print('google lon.lat = %.9f,%.9f' %(gcj02_lng_lat[1],gcj02_lng_lat[0]),end='\r\n',flush=True)         # google map could use
            print('amap lon.lat   = %.9f,%.9f' %(gcj02_lng_lat[0],gcj02_lng_lat[1]),end='\r\n',flush=True)         # amap soso map could use
            print('bd09 lon,lat   = %.9f,%.9f' %(bd09_lng_lat[0],bd09_lng_lat[1]),end='\r\n',flush=True)           # baidu map could use
            print('speed          = ', data_stream.speed,'KM/H',end='\r\n',flush=True)
            for i in range(0,10):
                print('update after {0} seconds'.format(10-i),end='\r',flush=True)
                time.sleep(1)
            print('\x1b[6A',end='\r')
        else:
            print('\033[1;32m Module dont ready,please move the antenna to outdoors \033[0m',end='\r',flush=True)

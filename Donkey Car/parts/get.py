import requests
import threading
import time
import utm
import csv
import json

class get():
    def __init__(self, path,origin_reset,ctr,gps_latest_position) -> None:
        self.DeviceId = '1100048518'
        self.APIKey = "d4Rs4uU=tusmD3Dmh3KI1OcPvzg="
        self.download_url = f"http://api.heclouds.com/devices/1100048518/datastreams"
        self.upload_url = f"http://api.heclouds.com/devices/1100048518/datapoints"
        self.headers = {
            'api-key': self.APIKey,
            'Content-Type': 'application/json'
        }
        self.session = requests.Session()
        self.latitude_series = []
        self.longitude_series = []
        self.utm_series = []
        self.signal =  0 # 初始信号为0，表示使用默认路径
        self.last_signal = 0  # 记录上一次的 signal 状态
        self.poll_delay = 1
        self.path = path  # 传入的 path 对象
        self.origin_reset = origin_reset
        self.ctr = ctr
        self.gps_latest_position = gps_latest_position
        self.running = True  # 控制线程运行的标志
        self.xunhangline_data = None
        self.chargeline_data = None
        self.utm_position=None
        self.coordinates =None
        self.chargeline_data_utm=None
        self.stop_signal=1
        self.stop_last_signal=1
        self.throttle_value=0.3
        self.charge_last_signal=0
        self.charge_signal=0
    def update(self):
        while self.running:
            self.poll()
            self.upload_gps_to_onenet()
            time.sleep(self.poll_delay)

    def poll(self):
        try:
            response = self.session.get(self.download_url, headers=self.headers)
            response.raise_for_status()
            params = response.json()
#             print(params)
            a=params['data']
#             print(params)
            
            if 'error' not in a:
                for datastream in a:
                    if datastream['id'] == 'Location':
                        self.xunhangline_data=datastream['current_value']['road_message']                   
                        self.signal = datastream['current_value']['signal']  # 获取最新的信号值
                    elif datastream['id'] == 'stop':
                        self.stop_signal =datastream['current_value']['road_message'][0]['signal']
                    elif datastream['id'] == 'xunhangline':
                        self.chargeline_data=datastream['current_value']['road_message']

                # 检查经纬度数组是否同步更新，然后转换为UTM坐标
                self.coordinates = [(float(coord['longitude']), float(coord['latitude'])) for coord in self.xunhangline_data]
#                 print(self.coordinates)
                self.chargeline_data_utm = [(float(charge['longitude']), float(charge['latitude'])) for charge in self.chargeline_data]
#                 print(self.chargeline_data_utm)
                print("xunhang")
                print(self.signal)
                print("zanting")
                print(self.stop_signal)
                print(self.stop_last_signal)
                # 根据 signal 信号来决定是否调用 path.load
                
            if self.signal == 1 and self.last_signal == 0:
                    
                    self.write_to_csv('onenet.csv',self.coordinates,self.throttle_value)
                    self.ctr.button_down_trigger_map['start']()
                    self.path.load('onenet.csv')
                    self.ctr.button_down_trigger_map['start']()
                    print("load onenet.csv")
                    self.last_signal = self.signal
                    
            if self.stop_signal ==0 and self.stop_last_signal ==1:
                    
                    self.ctr.button_down_trigger_map['start']()
                    self.ctr.emergency_stop()
                    self.stop_last_signal = self.stop_signal
                    print("E-stop")
                    self.charge_last_signal=0
                                   
            if self.stop_signal ==1 and self.stop_last_signal ==0:
                    
                    self.write_to_csv('chongdianzhuang.csv',self.chargeline_data_utm,self.throttle_value)
                    
                    self.path.load('chongdianzhuang.csv')      
                    print("chongdianzhuang.csv") 
                    self.ctr.button_down_trigger_map['start']()

                    self.stop_last_signal = self.stop_signal
                     
        except requests.RequestException as e:
            print(f"请求出错: {e}")

    def run_threaded(self):
        
            return self.signal  # 如果没有数据返回空列表和信号

    def start_polling(self):
#         self.running = True  # 启动前确保标志为True
        thread = threading.Thread(target=self.update)
        thread.daemon = True
        thread.start()
        print("get start")
    def write_to_csv(self,filename,data,throttle_value):
        with open(filename,'w',newline='') as csvfile:
            writer=csv.writer(csvfile)
            print("write success")
            for coord in data:
                formatted_throttle = f"{throttle_value:.10e}"
                writer.writerow([coord[0],coord[1],formatted_throttle])
                
    def stop_polling(self):
        self.running = False  # 设置标志为False以停止线程

    def shutdown(self):
        self.session.close()
        
    def upload_gps_to_onenet(self):
        
        if self.gps_latest_position is not None:
          try:
                # 获取最新的GPS位置
                latest_position = self.gps_latest_position.get_latest_position()
#                 print("chenggong45646")
                if latest_position is not None:
                    # 假设 latest_position 是一个元组 (easting, northing)
                    easting, northing = latest_position[1:]
#                     print([easting,northing])
                    # 构建数据
                    values = {
                        'datastreams': [
                            {
                                'id': 'GPS',
                                'datapoints': [
                                    {
                                        'value': {
                                            'latitude': easting,  # 这里假设 easting 代表纬度信息
                                            'longitude': northing  # 这里假设 northing 代表经度信息
                                        }
                                    }
                                ]
                            }
                        ]
                    }

                    # 上传数据
                    jdata=json.dumps(values).encode("utf-8")
                    response = requests.post(self.upload_url, headers=self.headers, data=jdata) 
                    print("Upload response:",response.content)
                else:
                    print("No GPS position available.")
          except requests.RequestException as e:
                print(f"上传出错: {e}")



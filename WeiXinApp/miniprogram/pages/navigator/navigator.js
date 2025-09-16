var mapTransfrom = require("../../utils/util.js");

const app = getApp()
let timer = null
Page({

  data: {
    you_lat: '',    //用户经度,
    you_lon: '',    //用户纬度
    car_lat: '' ,   //小车纬度 
    car_lon: '',     //小车经度
//     you_lat_wgs: '39.95931974341126',    //用户经度,
//     you_lon_wgs: '116.35349922981466',    //用户纬度
//     car_lat_wgs: '39.9598033938959' ,   //小车纬度 
//     car_lon_wgs: '116.3537147710828',     //小车经度
    you_lat_wgs: '',    //用户经度,
    you_lon_wgs: '',    //用户纬度
    car_lat_wgs: '' ,   //小车纬度 
    car_lon_wgs: '',     //小车经度
    zhuang_lat: '39.96095633632223',          //充电庄纬度
    zhuang_lon: '116.35963887860662',           //充电庄经度
    latitude: 39.961850,
    longitude: 116.357252,

    road_start: '', // 生成路径的起点
    road_end: '', // 生成路径的终点

    road_start_wgs: '', // 生成路径的起点
    road_end_wgs: '', // 生成路径的终点

    waitTime: '',  //等待时间

    markers: [],
    customCalloutMarkerIds: [],
    // OneNET平台接收信息
    datapoint_xunhang: {
      "datastreams": [{
        "id": "Location",
        "datapoints": [{
          "value": {
            "text": '规划路线',
            "signal": 0,
            "road_message": '',
          },
        }]
      }]
    },
},

  onLoad() {
    wx.showLoading({
      title: '加载位置信息中',
    })
    // 获取用户所在位置的经纬度信息
    var that = this
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
    }).then(res => {
      console.log("ren:",res.latitude,res.longitude)
      const baiduInstance = new mapTransfrom();
      baiduInstance.Google_Coordinates(res.latitude, res.longitude)
      // 将用户当前位置经纬度信息记录下来，作为路径生成的起点参数
      this.data.road_end = baiduInstance.Lat_Goodle + ',' + baiduInstance.Lon_Goodle
      console.log('end:',this.data.road_end)
      // 修改展示页面的经纬度展示
      this.addMarker()
      this.getuserstation()  //获取用户位置
      this.getlonlaufrompi()
      wx.hideLoading()
      this.data.datapoint_xunhang["datastreams"][0]["datapoints"][0]["value"]["signal"] = 0
      wx.request({
        url: 'https://api.heclouds.com/devices/1100048518/datapoints',
        header: {
           "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
        },
        method: 'POST',
        data: this.data.datapoint_xunhang,
        success: res => {
        },
        fail: err => {
        }
      })
          const interval = () => {
            timer = setTimeout(() => {
              // 执行代码块
              this.getlonlaufrompi()  //实时获取小车经纬度坐标
              this.addMarker()      //更新地图坐标点
              this.getuserstation()  //用户位置
              interval()
            }, 1000)
          }
          interval()
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  //添加map标记
  addMarker() {
    const you = {
      id: 1,
      latitude: this.data.you_lat,
      longitude: this.data.you_lon,
      iconPath: 'cloud://xuehaolin-9gpfu9n5283fbe3e.7875-xuehaolin-9gpfu9n5283fbe3e-1314104796/bao/location.png',
      width: '40', // 标记点图标宽度
      height:'40', // 标记点图标高度
      callout: {
        content: '您',
        color: '#ff0000',
        fontSize: 14,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#000000',
        bgColor: '#fff',
        padding: 5,
        display: 'ALWAYS',
        textAlign: 'center'
      },
    }
    const car = {
      id: 2,
      latitude: this.data.car_lat,
      longitude: this.data.car_lon,
      iconPath: 'cloud://xuehaolin-9gpfu9n5283fbe3e.7875-xuehaolin-9gpfu9n5283fbe3e-1314104796/bao/location.png',
      width: '40', // 标记点图标宽度
      height:'40', // 标记点图标高度
      callout: {
        content: '小车',
        color: '#ff0000',
        fontSize: 14,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#000000',
        bgColor: '#fff',
        padding: 5,
        display: 'ALWAYS',
        textAlign: 'center'
      },
    }
    const zhuang = {
      id: 3,
      latitude: this.data.zhuang_lat,
      longitude: this.data.zhuang_lon,
      iconPath: 'cloud://xuehaolin-9gpfu9n5283fbe3e.7875-xuehaolin-9gpfu9n5283fbe3e-1314104796/bao/location.png',
      width: '40', // 标记点图标宽度
      height:'40', // 标记点图标高度
      callout: {
        content: '充电桩',
        color: '#ff0000',
        fontSize: 14,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#000000',
        bgColor: '#fff',
        padding: 5,
        display: 'ALWAYS',
        textAlign: 'center'
      },
    }
    const allMarkers = [you,car,zhuang]
    const markers = allMarkers
    this.setData({
      markers,
      customCalloutMarkerIds: [1,2,3],
    })
  },
  //用户位置
getuserstation(e){
  wx.getLocation({
    type: 'wgs84',
    isHighAccuracy: true,
    altitude:true,
    highAccuracyExpireTime:5000
  }).then(res => {
    console.log('用户：',res)
    const baiduInstance = new mapTransfrom();
    baiduInstance.Google_Coordinates(res.latitude, res.longitude)
    this.setData({
      you_lat_wgs:res.latitude,
      you_lon_wgs:res.longitude,
      you_lon: baiduInstance.Lon_Goodle,
      you_lat: baiduInstance.Lat_Goodle
    })
    //  console.log("you_wgs:",this.data.you_lat_wgs,this.data.you_lon_wgs)
  })
},
   //获取小车实时的经纬度信息
getlonlaufrompi(e) {
    wx.request({
      url: 'https://api.heclouds.com/devices/1100048518/datapoints',
      header: {
           "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
      },
      method: "GET",
      success: res => {
        // console.log('res:',res)
        const baiduInstance = new mapTransfrom();
        baiduInstance.Google_Coordinates(res.data.data.datastreams[2].datapoints[0].value.longitude, res.data.data.datastreams[2].datapoints[0].value.latitude)
        this.setData({
          car_lat : baiduInstance.Lat_Goodle,
          car_lon : baiduInstance.Lon_Goodle,
          road_start : baiduInstance.Lat_Goodle +','+ baiduInstance.Lon_Goodle,
          car_lat_wgs : res.data.data.datastreams[2].datapoints[0].value.longitude,
          car_lon_wgs : res.data.data.datastreams[2].datapoints[0].value.latitude,
          road_start_wgs : res.data.data.datastreams[2].datapoints[0].value.longitude +','+res.data.data.datastreams[2].datapoints[0].value.latitude,
        })
      // console.log('start:',this.data.road_start)
      // console.log('start_G:',this.data.road_start_wgs)
      },
      fail: err => {
        console.log(err, '获取数据失败')
      }
    })
  },
//实际路线调用，演示用不上
cargo(e){
//     var _this = this
//        // 生成路径经纬度信息点
//        wx.request({
//         url: 'https://apis.map.qq.com/ws/direction/v1/walking',
//         data: {
//           // "from": this.data.road_start,
//           // "to": this.data.road_end,
//           "from": '39.95977423991506,116.36031193990021',
//           "to": '39.959972,116.359658',
//           "speed": '0.00000000001',
//           "accuracy": '0.00000000000000000000000000000001',
//           "key": "JOJBZ-EUPYQ-RUG5V-BK7Q6-ANOYV-3HFC6",
//         },
//         success: res => {
//           console.log(res)
//           this.getlonlaufrompi()
//           var route_list = res.data.result.routes[0].polyline
//           var pl = [
//             // {latitude: Number(this.data.car_lat),
//             // longitude: Number(this.data.car_lon)}
//           ]
//           // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
//           var kr = 1000000;
//           for (var i = 2; i < route_list.length; i++) {
//             route_list[i] = Number(route_list[i - 2]) + Number(route_list[i]) / kr;
//           }
//           // 将解压后的坐标放入点串数组pl中
//           for (var i = 0; i < route_list.length; i += 2) {
//             pl.push({
//               latitude: route_list[i],
//               longitude: route_list[i + 1]
//             })
//           }
//           pl.push({
//             latitude: this.data.you_lat,
//             longitude: this.data.you_lon
//             // latitude: 39.961850,
//             // longitude: 116.357252,
//           })
//           this.data.datapoint_xunhang["datastreams"][0]["datapoints"][0]["value"]["road_message"] = pl
//           console.log(pl)
//           this.uplonlaufrompi();
//           this.setData({
//             // 将路线的起点设置为地图中心点
//              latitude: pl[0].latitude,
//              longitude: pl[0].longitude,
//              waitTime : res.data.result.routes[0].duration,
//                 // 绘制路线
//                 polyline: [{
//                   points: pl,
//                   color: '#54dde7',
//                   width: 6,
//                   borderColor: '#2f693c',
//                   arrowLine: true,
//                   borderWidth: 2
//                 }]
//               })
//           },
// })
}, 
//获取用户与小车之间的距离
getDistanceAndTime(e) {
  wx.getLocation({
    type: 'wgs84',
    isHighAccuracy: true,
  }).then(res => {
    const baiduInstance = new mapTransfrom();
    baiduInstance.Google_Coordinates(res.latitude, res.longitude)
    var start = baiduInstance.Lat_Goodle + ',' + baiduInstance.Lon_Goodle
    this.setData({
      you_lon: baiduInstance.Lon_Goodle,
      you_lat: baiduInstance.Lat_Goodle
    }),
    //console.log('start:',start)
    // 2、获取小车实时的经纬度信息
    wx.request({
      url: 'https://api.heclouds.com/devices/1100048518/datapoints',
      header: {
         "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
      },
      method: "GET",
      success: res => {
        const endInstance = new mapTransfrom();
        endInstance.Google_Coordinates(res.data.data.datastreams[1].datapoints[0].value.longitude,res.data.data.datastreams[1].datapoints[0].value.latitude)
        var end = endInstance.Lat_Goodle + ',' + endInstance.Lon_Goodle
        console.log('end:',end)
        // 3、发送api调用请求，获取当前的小车和用户的距离以及预计到达时间
        wx.request({
          url: 'https://apis.map.qq.com/ws/direction/v1/walking',
          data: {
            "from": start,
            "to": end,
            // "from": '39.959972,116.359658',
            // "to": '39.961850,116.357252',
            "key": "JOJBZ-EUPYQ-RUG5V-BK7Q6-ANOYV-3HFC6"
          },
          success: res => {
            this.setData({
              distance: res.data.result.routes[0].distance,
              waitTime: res.data.result.routes[0].duration,
            })
            wx.hideLoading()
          }
        })
      },
      fail: err => {
       // console.log(err, '获取数据失败')
      }
    })
  })
},
songbao(e){
  var _this = this
  var distance = Math.round(this.haversineDistance(parseFloat(this.data.car_lat_wgs), parseFloat(this.data.car_lon_wgs), parseFloat(this.data.you_lat_wgs), parseFloat(this.data.you_lon_wgs)))*2
  console.log('distance:',distance)
  // 生成路径经纬度信息点
  var route_list = this.interpolateLinear(parseFloat(this.data.car_lat_wgs), parseFloat(this.data.car_lon_wgs), parseFloat(this.data.you_lat_wgs), parseFloat(this.data.you_lon_wgs), distance)
  // console.log(route_list)
  // console.log(this.data.you_lat_wgs,this.data.you_lon_wgs)
  // console.log(this.data.car_lat_wgs,this.data.car_lon_wgs)
  //上传用的WGS坐标
  var pl_wgs = []
  // 将解压后的坐标放入点串数组pl中
  for (var i = 0; i < route_list.length; i += 1) {
          pl_wgs.push({
            latitude: route_list[i][0],
            longitude: route_list[i][1]
          })
        }
        pl_wgs.push({
          latitude: parseFloat(this.data.you_lat_wgs),
          longitude: parseFloat(this.data.you_lon_wgs)
        })
        console.log('pl_wgs:',pl_wgs)
        this.data.datapoint_xunhang["datastreams"][0]["datapoints"][0]["value"]["road_message"] = pl_wgs
        this.data.datapoint_xunhang["datastreams"][0]["datapoints"][0]["value"]["signal"] = 1
      //画图用的火星坐标
        var pl = [
          {
            latitude: parseFloat(this.data.car_lat),
            longitude: parseFloat(this.data.car_lon)
          }
        ]
      // 将解压后的坐标放入点串数组pl中
      for (var i = 0; i < route_list.length; i += 1) {
        const baiduInstance = new mapTransfrom();
        baiduInstance.Google_Coordinates(route_list[i][0],route_list[i][1])
              pl.push({
                latitude: baiduInstance.Lat_Goodle,
                longitude: baiduInstance.Lon_Goodle
              })
            }
            pl.push({
              latitude: parseFloat(this.data.you_lat),
              longitude: parseFloat(this.data.you_lon)
            })
        // console.log('pl:',pl)
        console.log('小车已出发')
        this.uplonlaufrompi();
        this.setData({
          // 将路线的起点设置为地图中心点
           latitude: pl[0].latitude,
           longitude: pl[0].longitude,
          //  waitTime : res.data.result.routes[0].duration,
              // 绘制路线
              polyline: [{
                points: pl,
                color: '#54dde7',
                width: 10,
                borderColor: '#2f693c',
                arrowLine: true,
                borderWidth: 2
              }]
            })
            wx.showToast({
              title: '小车已出发',
              icon: 'success'
            })
}, 
  //上传小车实时的路径信息
  uplonlaufrompi(e) {
      wx.request({
        url: 'https://api.heclouds.com/devices/1100048518/datapoints',
        header: {
           "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
        },
        method: 'POST',
        data: this.data.datapoint_xunhang,
        success: res => {
          console.log('sussese')
        },
        fail: err => {
        }
      })
  },
// 计算两个经纬度点之间的距离（单位：米）
haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 地球半径，单位为米
  const toRadians = (degree) => degree * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 返回两个坐标点之间的距离，单位为米
},
// 线性插值函数
interpolateLinear(lat1, lon1, lat2, lon2, numPoints) {
  const points = [];
  // 在每个插值点之间进行线性插值计算
  for (let i = 1; i <= numPoints; i++) {
      const fraction = i / (numPoints + 1); // 插值比例
      
      // 线性插值计算纬度和经度
      const lat = lat1 + fraction * (lat2 - lat1);
      const lon = lon1 + fraction * (lon2 - lon1);
      
      points.push([lat, lon]); // 将插值点添加到结果数组中
  }
  return points;
},
})
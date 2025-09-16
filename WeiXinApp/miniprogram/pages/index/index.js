var mapTransfrom = require("../../utils/util.js");
const db = wx.cloud.database()
const app = getApp()
let timer = null
Page({
  data: {
    car_can_use: 1,    // 小车是否可以使用
    identification: 0, //小车预约状态判断,0:巡航 , 1:送宝中 , 2:预约中
    needWaitPeople: 0,     //等待的人数
    openId:'',      //用户ID
    userList:[],    //用户列表

    distance: '', //当前小车距离你的距离
    WaitTime: '', //当前小车需要等待的时间

    //小车巡航轨迹
    PL:[
      39.958413,116.3541142,39.95841433,116.3541222,39.95841517,116.354128,39.95841617,116.354134,39.9584175,116.3541412,39.95841883,116.3541472,39.95841983,116.3541542,39.95842117,116.3541617,39.95842383,116.3541715,39.958426,116.3541815,39.958427,116.3541877,39.95842933,116.3541968,39.95843067,116.3542017,39.95843283,116.3542098,39.958435,116.3542177,39.958438,116.3542263,39.95843933,116.3542325,39.95844217,116.3542397,39.9584455,116.3542492,39.958448,116.3542567,39.95845067,116.3542635,39.95845283,116.3542703,39.958456,116.3542778,39.95846,116.3542878,39.95846317,116.3542953,39.95846683,116.354305,39.95847067,116.3543113,39.95847233,116.3543162,39.958476,116.3543248,39.95847983,116.3543313,39.9584865,116.3543435,39.95849067,116.3543495,39.95849517,116.3543567,39.958498,116.3543615,39.9585015,116.3543678,39.95850417,116.3543723,39.958508,116.3543785,39.958512,116.3543845,39.958517,116.354392,39.95852217,116.3543988,39.95852617,116.3544042,39.95853067,116.3544102,39.9585365,116.3544175,39.95854133,116.3544235,39.95854617,116.3544293,39.958554,116.3544388,39.9585605,116.3544458,39.95856617,116.3544508,39.95857133,116.3544555,39.95857683,116.3544612,39.958582,116.3544663,39.9585895,116.3544733,39.95859533,116.3544785,39.9586025,116.3544843,39.95860767,116.3544882,39.9586125,116.354492,39.9586185,116.3544967,39.95862517,116.354502,39.958632,116.3545072,39.95863917,116.3545118,39.9586455,116.3545158,39.95865317,116.3545205,39.95865767,116.354523,39.9586635,116.3545262,39.9586705,116.3545298,39.958678,116.3545332,39.958685,116.3545365,39.95869183,116.3545397,39.958699,116.3545422,39.9587055,116.3545448,39.95871033,116.354547,39.95871733,116.3545495,39.95872333,116.3545515,39.95873033,116.3545537,39.95873733,116.3545555,39.9587425,116.3545568,39.95874817,116.354558,39.9587535,116.3545592,39.958762,116.354561,39.95877033,116.3545625,39.95877667,116.3545635,39.95878183,116.3545642,39.95878817,116.354565,39.9587935,116.3545657,39.95880467,116.3545663,39.95881133,116.3545667,39.9588185,116.354567,39.958825,116.3545672,39.95883217,116.3545668,39.9588385,116.3545672,39.95884367,116.3545667,39.95885067,116.3545662,39.958859,116.3545662,39.958866,116.3545652,39.95887283,116.3545648,39.95887867,116.3545645,39.9588845,116.3545642,39.95888967,116.3545642,39.95889617,116.354564,39.95890367,116.3545635,39.95891,116.3545632,39.9589205,116.3545622,39.95892867,116.354562,39.95893583,116.3545613,39.95894667,116.3545615,39.95895383,116.3545608,39.95896183,116.3545605,39.95897017,116.35456,39.95897933,116.3545597,39.958985,116.3545593,39.95899,116.354559,39.95899717,116.3545585,39.959005,116.3545578,39.95901233,116.3545572,39.95901983,116.3545573,39.959028,116.3545568,39.959037,116.3545562,39.95904467,116.3545555,39.9590515,116.3545553,39.959058,116.3545557,39.959064,116.3545553,39.95906933,116.3545547,39.95907533,116.3545545,39.95908317,116.354554,39.95909167,116.3545535,39.95909667,116.354553,39.95910217,116.3545525,39.95911183,116.3545525,39.9591205,116.3545525,39.959128,116.3545517,39.959134,116.3545513,39.95913983,116.3545508,39.9591455,116.3545505,39.959151,116.3545505,39.9591565,116.3545502,39.95916267,116.3545497,39.95916983,116.35455,39.95917733,116.3545497,39.95918267,116.3545492,39.959191,116.3545482,39.95919733,116.3545482,39.95920383,116.3545485,39.9592135,116.3545472,39.95922033,116.354547,39.95922617,116.3545468,39.95923283,116.3545463,39.95923833,116.3545457,39.95924567,116.354545,39.9592545,116.3545445,39.95926283,116.3545443,39.95926933,116.3545442,39.95927733,116.3545442,39.959285,116.3545435,39.95929133,116.3545428,39.9592975,116.3545425,39.95930583,116.3545423,39.95931417,116.3545417,39.9593195,116.3545415,39.95932517,116.3545418,39.95933167,116.3545415,39.95933733,116.3545412,39.959349,116.3545405,39.9593575,116.35454,39.95936267,116.3545398,39.95937267,116.3545385,39.95937817,116.3545383,39.95938433,116.3545382,39.95939067,116.3545377,39.95940067,116.3545367,39.959409,116.3545363,39.95941667,116.3545363,39.9594235,116.354536,39.95943083,116.3545357,39.95943717,116.354535,39.95944383,116.3545342,39.95945067,116.354534,39.95945883,116.3545335,39.95946633,116.3545328,39.95947433,116.3545332,39.95948267,116.3545325,39.95948983,116.3545323,39.95949767,116.3545318,39.959504,116.3545315,39.95950967,116.3545315,39.9595155,116.3545312,39.95952267,116.3545305,39.95953417,116.3545292,39.95953933,116.3545295,39.95954483,116.3545297,39.95954983,116.3545287,39.95955567,116.3545288,39.95956433,116.3545288,39.959572,116.3545275,39.95957917,116.3545265,39.95958733,116.3545265,39.9595925,116.3545263,39.95959767,116.3545262,39.9596035,116.3545258,39.95961083,116.3545255,39.959619,116.354525,39.95962917,116.3545237,39.95963567,116.3545228,39.95964517,116.3545212,39.95965167,116.3545198,39.95966217,116.3545175,39.959669,116.3545158,39.95967533,116.354514,39.95968083,116.3545123,39.95968583,116.3545105,39.95969217,116.354508,39.95969817,116.3545058,39.95970433,116.3545032,39.959709,116.3545012,39.95971383,116.3544995,39.95971917,116.3544978,39.95972417,116.3544947,39.95973133,116.3544922,39.95973767,116.3544888,39.95974417,116.3544852,39.9597505,116.3544817,39.95975683,116.354478,39.95976267,116.3544745,39.95977017,116.3544697,39.95977467,116.3544668,39.95977933,116.3544635,39.95978533,116.3544593,39.959792,116.3544545,39.95979733,116.3544505,39.95980317,116.3544462,39.95980867,116.3544418,39.95981367,116.3544373,39.95981833,116.3544327,39.95982333,116.3544282,39.95983067,116.3544217,39.959836,116.3544165,39.95984117,116.354411,39.95984617,116.3544055,39.9598505,116.3544007,39.95985633,116.354394,39.95986383,116.3543858,39.95986867,116.3543798,39.95987233,116.3543753,39.95987717,116.3543688,39.95988183,116.354363,39.95988517,116.3543583,39.95988967,116.3543527,39.959893,116.3543482,39.959897,116.3543427,39.95989967,116.3543383,39.95990267,116.3543338,39.959906,116.3543285,39.95990917,116.354323,39.95991217,116.3543183,39.95991467,116.354314,39.95992,116.3543052,39.95992433,116.354298,39.95992767,116.3542922,39.95993083,116.3542857,39.95993367,116.3542802,39.95993817,116.3542703,39.9599415,116.354263,39.959945,116.3542553,39.959948,116.3542487,39.95995067,116.3542418,39.9599535,116.3542343,39.95995717,116.354226,39.95995983,116.3542187,39.95996233,116.3542113,39.95996417,116.3542065,39.95996583,116.3542013,39.95996817,116.3541945,39.95997033,116.3541878,39.95997217,116.3541822,39.95997367,116.3541765,39.95997517,116.3541697,39.959977,116.354162,39.9599795,116.3541537,39.9599815,116.3541458,39.959983,116.3541378,39.959985,116.3541297,39.9599865,116.3541223,39.95998833,116.3541112,39.9599915,116.3541002,39.95999317,116.3540897,39.9599945,116.3540805,39.95999517,116.3540722,39.9599965,116.3540633,39.95999767,116.3540537,39.95999817,116.3540437,39.95999867,116.3540325,39.959999,116.3540215,39.95999883,116.3540127,39.95999983,116.3540043,39.96000017,116.3539943,39.95999967,116.353988,39.96000017,116.353976,39.9600005,116.3539673,39.95999983,116.353961,39.95999933,116.3539508,39.959999,116.3539412,39.95999817,116.3539313,39.9599975,116.3539203,39.9599965,116.3539108,39.95999517,116.3539003,39.95999383,116.3538902,39.95999233,116.3538792,39.95999033,116.3538667,39.95998767,116.353855,39.9599865,116.3538475,39.959985,116.3538415,39.959983,116.353833,39.95998083,116.3538248,39.95997883,116.3538165,39.95997667,116.353807,39.95997467,116.3537983,39.95997233,116.3537908,39.95996983,116.3537823,39.95996683,116.3537735,39.95996383,116.3537637,39.95996033,116.3537537,39.9599565,116.3537445,39.95995283,116.353736,39.95994933,116.3537278,39.959946,116.3537185,39.95994267,116.3537098,39.95993733,116.3536988,39.95993217,116.3536897,39.9599275,116.3536798,39.9599245,116.3536735,39.95992083,116.353667,39.95991583,116.3536587,39.95991183,116.3536528,39.95990633,116.3536437,39.95990233,116.3536363,39.95989783,116.3536292,39.95989417,116.3536235,39.95989083,116.3536195,39.95988633,116.3536137,39.95988283,116.3536092,39.95987983,116.353605,39.959876,116.3535998,39.95986983,116.3535918,39.9598655,116.3535868,39.95986017,116.3535807,39.95985567,116.3535745,39.95985083,116.3535692,39.959844,116.3535628,39.95983783,116.3535563,39.95983267,116.3535508,39.959828,116.3535463,39.95982217,116.3535407,39.95981617,116.3535362,39.95980967,116.3535308,39.959805,116.3535262,39.9597985,116.3535215,39.95979383,116.353518,39.95978683,116.3535125,39.95978183,116.3535095,39.95977733,116.3535055,39.95977067,116.3535008,39.95976383,116.3534963,39.95975733,116.3534925,39.95975167,116.3534893,39.9597435,116.3534855,39.95973767,116.3534825,39.95973333,116.35348,39.95972683,116.3534765,39.95971883,116.3534727,39.95971333,116.3534707,39.95970483,116.353467,39.9597,116.353465,39.95969467,116.3534635,39.95968883,116.3534617,39.9596825,116.3534595,39.95967567,116.3534575,39.95966833,116.353455,39.95965983,116.3534525,39.959654,116.3534515,39.95964833,116.3534505,39.959643,116.3534495,39.9596375,116.3534485,39.95963117,116.3534473,39.95962533,116.3534463,39.95962033,116.353446,39.9596105,116.3534455,39.9596035,116.3534445,39.959597,116.3534442,39.95959,116.3534435,39.95958267,116.3534433,39.95957483,116.3534443,39.95956817,116.3534435,39.95956233,116.3534445,39.959557,116.353445,39.95955183,116.3534452,39.95954333,116.3534458,39.959535,116.3534462,39.9595295,116.3534467,39.95952433,116.3534472,39.959515,116.353447,39.95950917,116.3534472,39.95950267,116.3534475,39.95949517,116.3534482,39.95948817,116.3534488,39.9594825,116.3534493,39.95947717,116.3534488,39.95946617,116.3534495,39.959458,116.3534503,39.95945067,116.3534498,39.9594445,116.3534502,39.95943867,116.3534505,39.959433,116.3534513,39.9594275,116.3534518,39.9594225,116.3534522,39.95941617,116.3534525,39.95940783,116.353453,39.9594015,116.3534537,39.95939167,116.353453,39.95938333,116.3534533,39.959377,116.3534538,39.959368,116.3534548,39.95935917,116.3534545,39.95935333,116.3534553,39.95934717,116.3534552,39.95934133,116.3534563,39.95933583,116.3534567,39.95933017,116.353457,39.95932317,116.3534575,39.95931767,116.3534578,39.95930733,116.353458,39.95930217,116.3534583,39.959297,116.3534587,39.95929117,116.3534588,39.95928617,116.3534593,39.95928,116.3534597,39.959275,116.3534597,39.95926983,116.3534602,39.95926267,116.3534613,39.95925567,116.3534613,39.95924517,116.3534608,39.95923667,116.3534622,39.9592255,116.3534623,39.959218,116.3534623,39.95921133,116.3534632,39.959205,116.3534638,39.959198,116.3534642,39.95919083,116.3534645,39.95918483,116.3534647,39.95917867,116.353465,39.959173,116.3534657,39.95916467,116.3534657,39.959157,116.3534657,39.95915017,116.3534662,39.95913983,116.3534668,39.95913017,116.3534665,39.95912383,116.3534667,39.95911383,116.3534682,39.95910683,116.3534678,39.9590975,116.3534688,39.95909167,116.3534698,39.959086,116.3534703,39.95907783,116.3534707,39.95907083,116.3534703,39.95906283,116.3534712,39.95905533,116.3534712,39.95904833,116.3534718,39.9590395,116.3534723,39.95903117,116.3534727,39.959023,116.3534728,39.959018,116.3534733,39.95901217,116.3534738,39.95900683,116.353474,39.95900133,116.3534743,39.95899517,116.3534752,39.958989,116.3534752,39.95898283,116.3534752,39.95897717,116.3534753,39.95897217,116.353476,39.9589625,116.3534768,39.95895683,116.3534772,39.95895117,116.3534773,39.95894317,116.3534778,39.95893767,116.3534782,39.95892933,116.3534783,39.9589225,116.3534783,39.958913,116.3534787,39.958904,116.3534802,39.9588985,116.35348,39.95889067,116.35348,39.95888517,116.3534805,39.9588795,116.3534812,39.9588745,116.3534817,39.95886383,116.3534812,39.9588575,116.3534822,39.958852,116.3534813,39.95884417,116.3534825,39.9588385,116.3534833,39.95883283,116.353483,39.95882567,116.3534838,39.9588195,116.3534847,39.95881217,116.3534843,39.95880583,116.3534842,39.958798,116.3534852,39.95878733,116.3534868,39.95877933,116.3534878,39.95877217,116.3534887,39.95876667,116.3534895,39.95876083,116.353491,39.95875267,116.3534915,39.95874733,116.3534933,39.95874133,116.3534943,39.9587355,116.353497,39.9587275,116.3534995,39.95871783,116.3535015,39.95870733,116.3535058,39.95870133,116.3535085,39.9586945,116.3535112,39.95868933,116.3535127,39.95868433,116.3535148,39.95867933,116.3535175,39.95867083,116.3535222,39.9586635,116.3535258,39.9586565,116.3535305,39.95865033,116.3535335,39.958644,116.3535375,39.95863833,116.3535415,39.95863283,116.3535452,39.9586265,116.3535495,39.95862083,116.3535533,39.95861267,116.353559,39.95860633,116.3535638,39.9585995,116.3535697,39.9585935,116.3535745,39.9585885,116.3535785,39.9585845,116.3535827,39.9585805,116.3535863,39.958576,116.3535907,39.95857133,116.353595,39.95856533,116.3536013,39.95855917,116.3536088,39.958555,116.3536138,39.95854817,116.3536198,39.9585425,116.3536262,39.95853817,116.353632,39.95853383,116.3536373,39.95852967,116.3536425,39.958525,116.3536485,39.95852,116.353655,39.9585145,116.3536623,39.95850983,116.3536697,39.95850667,116.3536748,39.95850267,116.3536815,39.95849933,116.3536873,39.95849583,116.3536928,39.95849317,116.3536978,39.9584905,116.3537025,39.9584875,116.3537073,39.958484,116.3537137,39.95848117,116.3537182,39.95847667,116.3537278,39.95847333,116.3537345,39.95846967,116.3537408,39.958467,116.3537465,39.95846483,116.353752,39.95846183,116.3537577,39.9584585,116.3537645,39.95845567,116.3537722,39.958454,116.3537773,39.9584515,116.3537828,39.95844883,116.3537895,39.95844583,116.3537975,39.95844383,116.353804,39.95844233,116.3538092,39.958439,116.3538177,39.9584375,116.3538227,39.95843533,116.3538285,39.9584335,116.3538345,39.9584315,116.353842,39.9584305,116.353847,39.9584295,116.3538522,39.95842683,116.3538598,39.95842583,116.3538663,39.95842483,116.353872,39.95842267,116.3538783,39.95842183,116.3538857,39.95842067,116.3538928,39.95841883,116.3538985,39.9584175,116.3539048,39.958416,116.3539155,39.95841517,116.3539213,39.95841433,116.3539267,39.95841333,116.3539353,39.95841217,116.3539438,39.95841117,116.3539535,39.95841117,116.3539597,39.95841033,116.3539657,39.95840967,116.3539715,39.95840883,116.3539785,39.95840883,116.3539863,39.958409,116.3539927,39.9584075,116.3540033,39.95840733,116.3540092,39.95840733,116.3540142,39.958407,116.3540207,39.95840667,116.3540265,39.95840667,116.3540322,39.958407,116.354041,39.95840783,116.3540498,39.95840833,116.3540558,39.95840867,116.354063,39.95840867,116.3540697,39.95840917,116.354075,39.95840933,116.3540828,39.95841,116.3540918,39.958411,116.3540985,39.95841117,116.3541053,39.95841267,116.3541152,39.95841467,116.3541235,39.95841517,116.354129,39.95841633,116.3541373,39.9584175,116.354145,39.95841833,116.3541508,39.95841917,116.354156
    ],
    markers: [],      //地图坐标
    customCalloutMarkerIds: [],   //地图坐标编号
    //巡航线上传
    datapoint_xunhang: {
      "datastreams": [{
        "id": "xunhangline",
        "datapoints": [{
          "value": {
            "text": '巡航线坐标点信息',
            "road_message": '',
          },
        }]
      }]
    },
    //充电桩坐标上传
    datapoint_zhuang: {
      "datastreams": [{
        "id": "zhuang",
        "datapoints": [{
          "value": {
            "text": '充电桩位置',
            "road_message": '',
          },
        }]
      }]
    },
    //控制启动停止
    datapoint_stop: {
      "datastreams": [{
        "id": "stop",
        "datapoints": [{
          "value": {
            "text": '开始巡航',
            "road_message": '',
          },
        }]
      }]
    },
        //控制启动停止
    datapoint_back: {
      "datastreams": [{
        "id": "back",
        "datapoints": [{
          "value": {
            "text": '返回路径',
            "road_message": '',
          },
        }]
      }]
    },
    // you_lat: '39.959972',    //用户经度,
    // you_lon: '116.359658',    //用户纬度
    // car_lat: '39.95977423991506' ,   //小车纬度 
    // car_lon: '116.36031193990021',     //小车经度
    you_lat: '',    //用户经度,
    you_lon: '',    //用户纬度
    car_lat: '' ,   //小车纬度 
    car_lon: '',     //小车经度

    car_lat_wgs: '' ,   //小车纬度 
    car_lon_wgs: '',     //小车经度
    zhuang_lat: '39.96095633632223',          //充电庄纬度
    zhuang_lon: '116.35963887860662',           //充电庄经度
    zhuang_lat_wgs: '39.959596166666664',          //充电庄纬度
    zhuang_lon_wgs: '116.35344233333333',           //充电庄经度
    latitude: '',   //地图中心坐标
    longitude: '',  //地图中心坐标
  },

  onLoad(e) {
    // 获取当前登录用户的_openid
    wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then(res => {
      this.setData({
        openId: res.result.openid
      })
      // 判断用户页面的展示情况
      var that = this
      const watcher = db.collection('waitCarList').doc('user').watch({
        onChange: function (snapshot) {
         that.checkCarStatus()
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
      this.checkCarStatus()
    }).catch(err => {
      console.error('云函数调用失败', err)
    })
        // 获取用户所在位置的经纬度信息
        var that = this
        wx.getLocation({
          type: 'wgs84',
          isHighAccuracy: true,
        }).then(res => {
          // 修改展示页面的经纬度展示
          const baiduInstance = new mapTransfrom();
      baiduInstance.Google_Coordinates(res.latitude, res.longitude)
          this.addMarker();  //添加地图坐标
          this.xunhangxian();   //绘制巡航线
          this.getcarstation();   //获得小车位置
          this.getuserstation();
          this.getDistanceAndTime();   //获取用户与小车之间的距离和时间
          wx.hideLoading();
          //循环调用位置信息函数this.getcarstation()，可以实时更新小车位置信息
          const interval = () => {
            timer = setTimeout(() => {
              // 执行代码块
              this.getuserstation()
             this.getcarstation()
              this.addMarker()
              // console.log(1)
              interval()
            }, 1000)
          }
          interval()
        })
  },

 //设定小车初始状态
 checkCarStatus(e) {
  wx.showLoading({
    title: '信息获取中…',
  })
  wx.cloud.database().collection('waitCarList').where({
      _openid: 'oJPfn4o841lCQyL4Ixd45YqqRDQI'
    })
    .get()
    .then(res => {
      this.data.userList = res.data[0].userList
      if (!this.data.userList.length) {
        this.setData({
          car_can_use: 1,
          identification: 0
        })
        wx.hideLoading()
      } else {
        const signal = this.data.userList.findIndex(e => e === this.data.openId)
        if (signal == -1) {
          this.setData({
            car_can_use: 0,
            identification: 1,
            needWaitPeople: this.data.userList.length
          })
          wx.hideLoading()
        } else if (signal == 0) {
          this.setData({
            car_can_use: 0,
            identification: 1
          })
          wx.hideLoading()
        } else {
          var index = this.data.userList.findIndex(e => e === this.data.openId)
          this.setData({
            car_can_use: 0,
            identification: 2,
            needWaitPeople: index
          })
          wx.hideLoading()
        }
        wx.hideLoading()
      }
    })
},
  // 用户点击叫车
 callingCar(e) {
      if (!this.data.identification) {
        this.data.userList.push(this.data.openId)
        db.collection('waitCarList').where({
          _openid: 'oJPfn4o841lCQyL4Ixd45YqqRDQI',
        })
          .update({
            data: {
              userList: this.data.userList
            }
          }).then(res => {
            this.setData({
              identification: 1,
              car_can_use: 0
            })
          })
      } else {
        wx.showToast({
          title: '叫车中…，请不要重复点击',
          icon: 'none'
        })
      }
  },
  // 是否预约小车
  bookingCar(e) {
      console.log('identification:',this.data.identification)
      if (this.data.identification == 2) {
        this.data.userList = this.data.userList.filter(item => item !== this.data.openId)
        wx.cloud.database().collection('waitCarList').where({
            _openid: 'oJPfn4o841lCQyL4Ixd45YqqRDQI'
          })
          .update({
            data: {
              userList: this.data.userList
            }
          })
          .then(res => {
            this.checkCarStatus()
            this.setData({
              identification: 1
            })
          })
      } else {
        this.data.userList.push(this.data.openId)
        wx.cloud.database().collection('waitCarList').where({
            _openid: 'oJPfn4o841lCQyL4Ixd45YqqRDQI'
          })
          .update({
            data: {
              userList: this.data.userList
            }
          })
          .then(res => {
            this.checkCarStatus()
            this.setData({
              identification: 2
            })
          })
      }
  },
  //连接map组件
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
  //绘制巡航线信息
xunhangxian(e){
    var _this = this
       // 生成路径经纬度信息点
    var route_list = this.data.PL  
    var pl = []
    // 将解压后的坐标放入点串数组pl中
    for (var i = 0; i < route_list.length; i += 2) {
      const baiduInstance = new mapTransfrom();
      baiduInstance.Google_Coordinates(route_list[i], route_list[i + 1])
      pl.push({
              latitude: baiduInstance.Lat_Goodle,
              longitude: baiduInstance.Lon_Goodle
            })
      }
    this.setData({
         // 将路线的起点设置为地图中心点
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
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
},
//获取用户与小车之间的距离
  getDistanceAndTime(e) {
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      altitude: true,
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
          endInstance.Google_Coordinates(res.data.data.datastreams[2].datapoints[0].value.longitude,res.data.data.datastreams[2].datapoints[0].value.latitude)
          var end = endInstance.Lat_Goodle + ',' + endInstance.Lon_Goodle
          //console.log('end:',end)
          // 3、发送api调用请求，获取当前的小车和用户的距离以及预计到达时间
          wx.request({
            url: 'https://apis.map.qq.com/ws/direction/v1/driving',
            data: {
              "from": start,
              "to": end,
              // "from": '39.959972,116.359658',
              // "to": '39.961850,116.357252',
              "key": "JOJBZ-EUPYQ-RUG5V-BK7Q6-ANOYV-3HFC6"
            },
            success: res => {
              // console.log(res)
              this.setData({
                distance: res.data.result.routes[0].distance,
                WaitTime: res.data.result.routes[0].duration,
              })
              wx.hideLoading()
            }
          })
        },
        fail: err => {
          console.log(err, '获取数据失败')
        }
      })
    })
  },
  // 填写目的地信息导航出发
  tonav(e) {
    setTimeout(() => {
      clearTimeout(timer)
    }, 1000);
    this.callingCar()
    wx.navigateTo({
      url: '../navigator/navigator',
    })
  },
  //未开发提示
  showReason(e) {
    wx.showToast({
      title: '尚未开发',
      icon: 'error'
    })
    this.backtochongdianzxhuang()
  },
//用户位置
getuserstation(e){
  wx.getLocation({
    type: 'wgs84',
    isHighAccuracy: true,
    altitude: true,
  }).then(res => {
    const baiduInstance = new mapTransfrom();
    baiduInstance.Google_Coordinates(res.latitude, res.longitude)
    this.setData({                                                          
      you_lon: baiduInstance.Lon_Goodle,
      you_lat: baiduInstance.Lat_Goodle
    })
    // console.log("you:",this.data.you_lat,this.data.you_lon)
  })
},
  //获取小车实时的经纬度信息
  getcarstation(e) {
    var that = this
    wx.request({
      url: 'https://api.heclouds.com/devices/1100048518/datapoints',
      header: {
           "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
      },
      success: res => {
        // console.log(res)
        const endInstance = new mapTransfrom();
          endInstance.Google_Coordinates(res.data.data.datastreams[2].datapoints[0].value.longitude,res.data.data.datastreams[2].datapoints[0].value.latitude)
        this.setData({
          car_lat_wgs: res.data.data.datastreams[2].datapoints[0].value.longitude,
          car_lon_wgs: res.data.data.datastreams[2].datapoints[0].value.latitude,
          car_lat: endInstance.Lat_Goodle,
          car_lon: endInstance.Lon_Goodle
        })
        // console.log("wgs:",this.data.car_lat_wgs,this.data.car_lon_wgs)
        // console.log(this.data.car_lat,this.data.car_lon)
      },
      fail: err => {
        console.log(err, '获取数据失败')
      }
    })
  },
  //小车回充电桩
  backtochongdianzxhuang(e){
    this.getcarstation()
    console.log(this.data.car_lat_wgs,this.data.car_lon_wgs)
    console.log(this.data.zhuang_lat_wgs,this.data.zhuang_lon_wgs)
    var distance = Math.round(this.haversineDistance(parseFloat(this.data.car_lat_wgs), parseFloat(this.data.car_lon_wgs), parseFloat(this.data.zhuang_lat_wgs), parseFloat(this.data.zhuang_lon_wgs)))*2
  console.log('distance:',distance)
  // 生成路径经纬度信息点
  var route_list = this.interpolateLinear(parseFloat(this.data.car_lat_wgs), parseFloat(this.data.car_lon_wgs), parseFloat(this.data.zhuang_lat_wgs), parseFloat(this.data.zhuang_lon_wgs), distance)
    // console.log(route_list)
    // console.log(this.data.zhuang_lat_wgs,this.data.zhuang_lon_wgs)
    // console.log(this.data.car_lat_wgs,this.data.car_lon_wgs)
    //上传用的WGS坐标
    console.log('小车位置：',this.data.car_lat_wgs,this.data.car_lon_wgs)
    var pl_wgs = [
    {
      latitude: parseFloat(this.data.car_lat_wgs),
      longitude: parseFloat(this.data.car_lon_wgs)
    }
    ]
    // 将解压后的坐标放入点串数组pl中
    for (var i = 0; i < route_list.length; i += 1) {
            pl_wgs.push({
              latitude: route_list[i][0],
              longitude: route_list[i][1]
            })
          }
          pl_wgs.push({
            latitude: parseFloat(this.data.zhuang_lat_wgs),
            longitude: parseFloat(this.data.zhuang_lon_wgs)
          })
          // console.log('pl_wgs:',pl_wgs)
          // var xunhangline = this.data.PL
        // 将解压后的坐标放入点串数组pl中
        // for (var i = 0; i < xunhangline.length; i += 2) {
        //         pl_wgs.push({
        //           latitude: xunhangline[i],
        //           longitude: xunhangline[i+1]
        //         })
        //       }
          // console.log('pl_2:',pl_wgs)
          this.data.datapoint_xunhang["datastreams"][0]["datapoints"][0]["value"]["road_message"] = pl_wgs
          this.uploadxunhang()
          console.log('小车回到充电桩')
  },
   //上传小车巡航线信息
  uploadxunhang(e){
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
  },
  //上传小车控制信息
  uploadgo(e) {
    var pl = []
    // 将解压后的坐标放入点串数组pl中
      pl.push({
              signal: 1,
            })
     this.data.datapoint_stop["datastreams"][0]["datapoints"][0]["value"]["road_message"] = pl
      wx.request({
        url: 'https://api.heclouds.com/devices/1100048518/datapoints',
        header: {
           "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
        },
        method: 'POST',
        data: this.data.datapoint_stop,
        success: res => {
          wx.showToast({
            title: '小车开始巡航',
            icon: 'success'
          })
        },
        fail: err => {
        }
      })

  },
  uploadstop(e) {
    var pl = []
    // 将解压后的坐标放入点串数组pl中
      pl.push({
              signal: 0,
            })
     this.data.datapoint_stop["datastreams"][0]["datapoints"][0]["value"]["road_message"] = pl
      wx.request({
        url: 'https://api.heclouds.com/devices/1100048518/datapoints',
        header: {
           "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
        },
        method: 'POST',
        data: this.data.datapoint_stop,
        success: res => {
          wx.showToast({
            title: '小车已停止',
            icon: 'error'
          })
        },
        fail: err => {
        }
      })
  },
  //上传充电桩位置信息
  uploadzhuang(e) {
    var pl = []
    // 将解压后的坐标放入点串数组pl中
      pl.push({
              latitude: this.data.zhuang_lat,
              longitude: this.data.zhuang_lon
            })
      this.data.datapoint_zhuang["datastreams"][0]["datapoints"][0]["value"]["road_message"] = pl
      wx.request({
        url: 'https://api.heclouds.com/devices/1100048518/datapoints',
        header: {
           "api-key": "d4Rs4uU=tusmD3Dmh3KI1OcPvzg=" //自己的api-key
        },
        method: 'POST',
        data: this.data.datapoint_zhuang,
        success: res => {
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
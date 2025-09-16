const pi = 3.14159265358979324;
const a = 6378245.0;
const ee = 0.00669342162296594323;
const x_pi = (3.14159265358979324 * 3000.0) / 180.0;

class Baidu {
  constructor() {
    this.Lon_Baidu = 0.0;
    this.Lat_Baidu = 0.0;
    this.Lon_Goodle = 0.0;
    this.Lat_Goodle = 0.0;
    this.GPS_Lon = 0;
    this.GPS_Lat = 0;
  }

  transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((y / 12.0) * pi) + 320 * Math.sin((y * pi) / 30.0)) * 2.0) / 3.0;
    return ret;
  }

  transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x / 30.0) * pi)) * 2.0) / 3.0;
    return ret;
  }

  bd_encrypt() {
    const x = this.Lon_Goodle;
    const y = this.Lat_Goodle;
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    this.Lon_Baidu = z * Math.cos(theta) + 0.0065;
    this.Lat_Baidu = z * Math.sin(theta) + 0.006;
  }

  transform() {
    let dLat = this.transformLat(this.GPS_Lon - 105.0, this.GPS_Lat - 35.0);
    let dLon = this.transformLon(this.GPS_Lon - 105.0, this.GPS_Lat - 35.0);
    const radLat = (this.GPS_Lat / 180.0) * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
    this.Lat_Goodle = this.GPS_Lat + dLat;
    this.Lon_Goodle = this.GPS_Lon + dLon;
  }

  Baidu_Coordinates(U_Lat, U_Lon) {
    this.GPS_Lat = U_Lat;
    this.GPS_Lon = U_Lon;
    this.transform();
    this.bd_encrypt();
  }

  Google_Coordinates(U_Lat, U_Lon) {
    this.GPS_Lat = U_Lat;
    this.GPS_Lon = U_Lon;
    this.transform();
  }
}

module.exports = Baidu;
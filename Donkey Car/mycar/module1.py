import serial
import subprocess

def setup_serial_port(port, baud_rate=115200, timeout=1):
    try:ser = serial.Serial(port, baud_rate, timeout)
        print(f"成功打开端口 {port}")
        return ser
    except serial.SerialException as e:
        print(f"无法打开端口 {port}: {e}")
        # 修改权限
        subprocess.run(['sudo', 'chmod', '666', port], check=True)
        # 再次尝试打开
        try:
            ser = serial.Serial(port, baud_rate, timeout)
            print(f"成功打开端口 {port}（重试后）")
            return ser
        except serial.SerialException as e:
            print(f"仍然无法打开端口 {port}: {e}")
            return None

if __name__ == "__main__":
    port = '/dev/ttyS0'
    ser = setup_serial_port(port)
    if ser:
        try:
            # 读取数据
            line = ser.readline()
            print(f"读取到的数据: {line}")
        finally:
            ser.close()
            print("端口已关闭")


TARGET=demo.bin
CXX=arm-linux-gnueabihf-g++

all:
	@$(CXX) app.c -o $(TARGET) -Wl,-rpath=./libs -Llibs  -Iinclude -fpermissive -lqxwz-pssdk-1.5.0-20200925-weixue-Linux-production-release -lwiringPi -lpthread


clean:
	@rm -rf $(TARGET)

.PHONY: all clean

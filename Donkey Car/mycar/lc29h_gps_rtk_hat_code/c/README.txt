This example is suitable for CHINA mainland region

1. users apply for an QXWZ account on https://www.qxwz.com/

2. Fill in the SDK key and secret on sdk_test() of app.c file
```
    sdk_config.key_type = QXWZ_SDK_KEY_TYPE_AK,
    strcpy(sdk_config.key, "A4901kjfiucc");
    strcpy(sdk_config.secret, "c3c7ff1615ef51d4");
 
```
3. and then compile it in the Raspberry Termimal
```
make
./app
```


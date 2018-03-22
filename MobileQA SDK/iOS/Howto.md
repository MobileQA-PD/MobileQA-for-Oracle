#CrashReport Library For iOS

비정상 종료 시 서버로 관련 정보를 전송 합니다. 만약 해당 시점에 전송이 실패하면, 다음 앱 실행시에 다시한번 crash정보를 전송 합니다.


#### 2. 라이브러리 설정
***CrashReportLib.framework*** 를 프로젝트에 포함시켜야 합니다.

Project Navigator에 프로젝트를 선택합니다.
우측 화면의 TARGETS에서 프로젝트를 선택합니다.
General 탭 하위의 Embedded Binaries에 ***CrashReportLib.framework*** 과 ***MqaCore.framework*** 를 추가합니다.


#### 3. 사용방법

* CrashReportLib/CrashReport.h를 import합니다.
* didFinishLaunchingWithOptions 메소드에 [CrashReport setCrashReport]를 호출 합니다.


```
#import <CrashReportLib/CrashReport.h>
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
// Override point for customization after application launch.


//
// 필수 : MobileQA - Crash 정보 전송 설정
//

[CrashReport setCrashReport: @"** user_id **"];


//
// 옵션 : Crash 정보를 받을때 추가로 받고자 하는 데이터를
// Key / Value 형태로 등록.
//
[CrashReport putCustom:@"tester" ForKey:@"name"];
...

return YES;
}
```

## * '** user_id **'은 오라클 서비스 접속을 위해 사전에 제공된 id를 입력하여야 합니다.
## * Sample Project Build 오류 발생시 Clean

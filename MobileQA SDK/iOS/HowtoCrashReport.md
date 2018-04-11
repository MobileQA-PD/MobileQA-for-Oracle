# CrashReport Library For iOS

비정상 종료 시 서버로 관련 정보를 전송 합니다. 만약 해당 시점에 전송이 실패하면, 다음 앱 실행시에 다시한번 crash정보를 전송 합니다.


#### 2. 라이브러리 설정
***CrashReportLib.framework*** 과 ***MqaCore.framework*** 를 프로젝트에 import 합니다.  
(자세한 import 방법은 Apple 개발자 document를 참고하시기 바랍니다.)

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

#### 4. API 소개

~~~~
+ (void) setCrashReport:(NSString *)id
~~~~

* Crash 정보를 Cloud에 전송 하도록 설정
* 앱 실행 시 onCreate에서 setContentView 이전에 설정 하는것을 권장한다.
* Parameters
    - id : 사전에 제공되는 Oracle Cloud ID



~~~~
+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
~~~~
* Crash 정보를 Cloud에 전송할때 추가로 전송하고자 하는 정보를 등록 및 수정
* 앱 실행중 언제든 사용 가능하다.
* Parameters
	- value : value string
    - key : key string

~~~~
+ (void) removeCustom : (NSString *)key;
~~~~
* 기 입력된 custom 정보를 삭제
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - key : key string

~~~~
+ (void) postCustomCrash:(NSString *)title
              Descrition:(NSString *)description
        CompletionHander:(void (^)(int response, NSString *description))completionHandler;

-- example --

[CrashReport postCustomCrash:@"Custom Crash iOS"
                  Descrition:@"Custom Crash Description"
            CompletionHander:^(int response, NSString *description) {
                NSLog(@"RESPONSE :%@ (%d)", description, response);
            }];
~~~~

* 크래쉬 정보를 cloud에 전송
* CrashReport.CompletionCallack interface 를 통해 전송 완료 정보를 전달 받을 수 있다.
* 실제로 Crash가 발생하지 않았으나 debuggin등의 목적으로 crash 정보를 생성하여 서버에 전송하고자 할때 사용한다.
* 위 api를 사용하더라도 실제로 crash가 발생하지 않는다.
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - title : title string
    - description : description string
    - CompletionHander : 전송 결과 Callback

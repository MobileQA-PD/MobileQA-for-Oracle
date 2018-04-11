# User Feedback For iOS

사용자의 Feedback을 수집합니다.

#### 1. 라이브러리 설정
***UserFeedback.framework*** 과 ***MqaCore.framework*** 를 프로젝트에 import 합니다.  
(자세한 import 방법은 Apple 개발자 document를 참고하시기 바랍니다.)

Project Navigator에 프로젝트를 선택합니다.  
우측 화면의 TARGETS에서 프로젝트를 선택합니다.
General 탭 하위의 Embedded Binaries에 ***UserFeedback.framewor*** 과 ***MqaCore.framework*** 를 추가합니다.  

(세부적인 Framework Import 방법은 Apple의 개발자 document를 참고하세요)

#### 2. 사용방법

* UserFeedback/UserFeedback.h 를 import합니다.
* didFinishLaunchingWithOptions 메소드에 UserFeedback의 setFeedback 메소드를 호출 합니다.
* Feedback 화면 노출을 위하여 UserFeedback의 showFeedback 메소드를 호출 합니다

```
#import <UserFeedback/UserFeedback.h>
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	// Override point for customization after application launch.
	

	//
	// 필수 : MobileQA - User Feedback 정보 전송 설정
	//
	[UserFeedback setFeedback: @"** user_id **"];

	//
	// 옵션 : Crash 정보를 받을때 추가로 받고자 하는 데이터를 
	// Key / Value 형태로 등록.
	//
	[UserFeedback putCustom:@"tester" ForKey:@"name"];
	...

	return YES;
}

...

- (IBAction)onClickFeedback:(id)sender {
    
    // User Feedback 화면이 노출 됩니다
    [UserFeedback showFeedback];    
}
```

#### 5. API 소개

~~~~
+ (void) setFeedback:(NSString *)userId;
~~~~

* Crash 정보를 Cloud에 전송 하도록 설정
* 앱 실행 시 MainActivity의 onCreate에서 설정 하는것을 권장한다.
* Parameters
    - id : 사전에 제공되는 Oracle Cloud ID

~~~~
+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
~~~~
* Crash 정보를 Cloud에 전송할때 추가로 전송하고자 하는 정보를 등록 및 수정
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - value : value string
    - forKey : key string

~~~~
+ (void) removeCustom : (NSString *)key;
~~~~
* 기 입력된 custom 정보를 삭제
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - key : key string

~~~~
+ (void) showFeedback;
~~~~
* User Feedback 화면을 노출.
* 앱 실행중 언제든 사용 가능하다.


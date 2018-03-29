# User Feedback For iOS

사용자의 Feedback을 수집합니다.

#### 1. 라이브러리 설정
***UserFeedback.framework*** 과 ***MqaCore.framework*** 를 프로젝트에 포함시켜야 합니다.   

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

### '** user_id **'은 오라클 서비스 접속을 위해 사전에 제공된 id를 입력하여야 합니다.
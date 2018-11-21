OCAM for Oracle Cloud Service
=============================

주요 기능 소개
-----------


## Crash Management

### Support platform

- Android Native App
- iOS Native App
- Web Site 및 Web App (javascript)
- Web (serveside)
- Android, iOS SDK 및 Document

### Feature

* App Crash 정보 및 운영 환경 정보 전송 (os, version, device, memory, cpu사용량)
* 전송 오류 보정 - 전송 오류 발생시 다음 실행 단계에 발송
* 실시간 Crash 수집 pause 및 resume 제어
* *rash 발생 시 User Feedback (Screen Capture 포함) 입력화면 노출 Option 제공
* *rash User Feedback 노출 옵션 실시간 제공
* *집된 Crash 정보를 Issue Management 로 전송 가능
* *ustom crash 전송
* *rash 데이터 전송시 사용자 지정 data 전송

## User Feedback

### Support platform

- Android Native App
- iOS Native App
- Web Site 및 Web App
- Feature

* User Feedback 화면 Full Customizable
* 자동 Screen Capture
* 수집된 Crash 정보를 Issue Management 로 전송 가능


## Issue Management

Oracle Development Cloud 의 Issue 시스템과 연동  
통합 App을 통하여 간편하게 Issue 관리  
OCAM의 Crash Management와 User Feedback에서 제공된 데이터를 구분하여 관리  


## OCAM Manager

OCAM에서 지원하는 모든 기능을 모니터링, 조회, 관리할 수 있는 앱 제공 
Desktop 및 Mobile 환경 지원

<br>
<br>
<br>

iOS, Android native SDK
=======================

# Crash Report

App의 Crash 정보를 OCAM service로 전송


## iOS

#### 기본 설정

1. libMqaCore.a 와 libCrashReport.a 를 프로젝트에 import
2. AppDelegate.h 에 Crash 발생 감시 설정
~~~
...

#import <CrashReport/CrashReport.h>

...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  ...

  // Override point for customization after application launch.
  [CrashReport setCrashReport:@" -- 발급된 OCAMs ID -- "];

  ...
    
}
~~~

#### Custom Data 설정 API (Option)

crash가 발생하여 정보가 ocam service로 전송될 때 추가로 전송하고자 하는 data를 설정

~~~~
+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey
~~~~
* Crash 발생시 추가로 전송하고자 하는 정보를 등록 및 수정
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - value : value string
    - key : key string

~~~~
+ (void)removeCustom : (NSString *)key
~~~~
* 기 입력된 custom 정보를 삭제
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - key : key string


#### 사용자 Crash 전송 (Option)
디버깅 목적 등의 용도로,  인위적으로 crash 정보를 생성하여 서버로 전송

API
~~~~
+ (void) postCustomCrash:(NSString *)title
              Descrition:(NSString *)description
        CompletionHander:(void (^)(int response, NSString *description))completionHandler;
~~~~
* Parameters
    - title : custom crash 등록 제목
    - description : custom crash 본문
    - completionHandler : 전송 완료 callback

Example
~~~
    [CrashReport postCustomCrash:@"Custom Crash iOS"
                      Descrition:@"Custom Crash Description"
                CompletionHander:^(int response, NSString *description) {
                    NSLog(@"RESPONSE (%d)", response);
                }];
~~~

## Android

#### 기본 설정

1. mqacore-xxx.aar 과 crashreportlib-xxx.aar 을 프로젝트에 import
2. MainActivity.java 에 Crash 발생 감시 설정
~~~
...
import kr.peopledream.mqa.crashreportlib.CrashReport;
...


    @Override
    protected void onCreate(Bundle savedInstanceState) {
      ...

      CrashReport.setCrashReport(this, " -- 발급된 OCAMs ID -- ");

      ...

    }
~~~


#### Custom Data 설정 API (Option)

crash가 발생하여 정보가 ocam service로 전송될 때 추가로 전송하고자 하는 data를 설정

~~~~
static
putCustom(String key, String value)
~~~~
* Crash 발생시 추가로 전송하고자 하는 정보를 등록 및 수정
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - key : key string
    - value : value string

~~~~
static
removeCustom(String key, String value)
~~~~
* 기 입력된 custom 정보를 삭제
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - key : key string


#### 사용자 Crash 전송 (Option)
디버깅 목적 등의 용도로,  인위적으로 crash 정보를 생성하여 서버로 전송

callback interface
~~~
public interface CompletionCallback {
  void onSendComplete(int resultCode, String response);
}
~~~

API
~~~~
static
postCustomCrash(final String title, final String description, final CompletionCallback callback)
~~~~
* Parameters
    - title : custom crash 등록 제목
    - description : custom crash 본문
    - callback : 전송 완료 callback

Example
~~~
CrashReport.postCustomCrash("Custom Crash Title", "Custom Crash Description", new CrashReport.CompletionCallback() {
                    @Override
                    public void onSendComplete(int resultCode, String response) {
                        Log.d("MainActivity","SEND CUSTOM CRASH COMPLETE :" + resultCode + "   " + response);
                    }
                });
~~~


# User Feedback

App 내에서 user의 feedback을 사용자 환경과 함께 ocam service 로 전송


## iOS

#### 기본 설정

1. libMqaCore.a 와 libUserFeedback.a 를 프로젝트에 import
2. AppDelegate.h 에 UserFeedback 기능 설정
3. 필요한 곳에서 User Feedback 호출

~~~
...

#import <UserFeedback/UserFeedback.h>

...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  ...

  // Override point for customization after application launch.
  [UserFeedback setFeedback:@" -- 발급된 OCAMs ID -- "];

  ...
    
}

// User Feedback 노출 Sample 
// (IBAction으로 button click event 연결)

- (IBAction)onClickShowFeedback:(id)sender {
    [UserFeedback showFeedback];
}
~~~


#### Custom Data 설정 API (Option)
~~~
+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
+ (void) removeCustom : (NSString *)key;
~~~
세부 내역은 Crash 부분과 동일


## Android

#### 기본 설정

1. mqacore-xxx.aar 과 userfeedback-xxx.aar 을 프로젝트에 import
2. MainActivity.java 에 UserFeedback 기능 설정
3. 필요한 곳에서 User Feedback 호출

~~~
...
import kr.peopledream.mqa.userfeedback.UserFeedback;
...


    @Override
    protected void onCreate(Bundle savedInstanceState) {
      ...

      // Initialize User Feedback
      UserFeedback.setFeedback(this, " -- 발급된 OCAMs ID -- ");

      ...


      // User Feedback 노출 Sample (Button 이벤트 listener에 등록)
      Button feedbackButton = (Button) findViewById(R.id.buttonFeedback);
      feedbackButton.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            UserFeedback.showFeedback();
        }
      });

    }

~~~

#### Custom Data 설정 API (Option)
~~~
public static void putCustom(String key, String value) 
public static void removeCustom(String key)
~~~
세부 내역은 Crash 부분과 동일
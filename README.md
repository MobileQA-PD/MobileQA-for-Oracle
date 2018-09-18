OCAM for Oracle Cloud
=====================


# Crash Repor

App의 Crash 정보를 OCAM service로 전송

## iOS

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

## Android

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


# User Feedback

App 내에서 user의 feedback을 사용자 환경과 함께 ocam service 로 전송

## iOS

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



## Android

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


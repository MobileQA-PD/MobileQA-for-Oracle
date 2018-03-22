#CrashReport Library For Android

#### 1. Library Information
* Compile SDK : API26
* Build Tools : 26.0.2  
* Min SDK Ver : API 16 - Android 4.1(Jelly Bean)  
* 배포형태 : aar  

(기타 빌드 환경에서의 라이브러리 필요 시, 빌드 환경 정보와 함께 별도 요청 바랍니다)


#### 2. 크래쉬 레포트 라이브러리 모듈 추가
crashlibrary-debug.arr (crashlibrary-release.arr)을 개발중인 project에 import합니다.

1. File->Project Structure... 선택
2. New Module 화면 하단의 Import .JAR/.AAR Package 선택
3. 좌상단의 + 를 누르고, 배포된 aar 파일을 선택해서 프로젝트에 포함


#### 3. Dependency 설정
1. 포함하고자 하는 모듈을 선택하고, Dependencies를 선택
2. Dependencies창 좌하단의 + -> Module Dependency 선택
3. 새로 추가된 crashlibrary-XXX 를 선택


#### 4. MainActivity 수정

~~~~
// 안드로이드용 SDK import
import kr.peopledream.crashlibrary.CrashCatchForAndroid;

 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ....


        //
        // MobileQA - Crash 정보 전송 설정
        //
        
        if (savedInstanceState == null) {
            CrashCatchForAndroid.Initialize(this);

            // Option
            CrashCatchForAndroid.setUserId("user_id");
        }        

        .....

    }
~~~~


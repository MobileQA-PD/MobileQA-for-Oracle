# CrashReport Library For Android

#### 1. Library Information

비정상 종료 시 서버로 관련 정보를 전송 합니다. 만약 해당 시점에 전송이 실패하면, 다음 앱 실행시에 다시한번 crash정보를 전송 합니다.

* Min SDK Ver : API 16 - Android 4.1(Jelly Bean)  
* 배포형태 : aar  

(특수 빌드 환경에서의 라이브러리 필요 시, 빌드 환경 정보와 함께 별도 요청 바랍니다)


#### 2. 크래쉬 레포트 라이브러리 모듈 추가
crashlibrary-debug.arr (crashlibrary-release.arr)과 mqacore-debug.arr (mqacore-release.arr)을 개발중인 project에 import합니다.

1. File->Project Structure... 선택
2. 좌상단의 + 를 누르고, New Module 화면 하단의 Import .JAR/.AAR Package 선택
3. 배포된 aar 파일을 선택해서 프로젝트에 포함

(자세한 라이브러리 추가 방법은 Android 개발자 도큐먼트를 참고하세요)

#### 3. Dependency 설정
1. 포함하고자 하는 모듈을 선택하고, Dependencies를 선택
2. Dependencies창 좌하단의 + -> Module Dependency 선택
3. 새로 추가된 crashlibrary-XXX,  mqacore-xxx를 선택


#### 4. MainActivity 수정

~~~~
// 안드로이드용 SDK import
import kr.peopledream.mqa.crashreportlib.CrashReport;;

 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        
        if (savedInstanceState == null) {
            //
            // 필수 : MobileQA - Crash 정보 전송 설정
            // "** user_id **"는 사전에 제공되는 Oracle ID를 입력하여야 합니다.
            //
            CrashReport.setCrashReport(this, "** user_id **");
            
        }

        //
        // 옵션 : Crash 정보를 받을때 추가로 받고자 하는 데이터를 
        // Key / Value 형태로 등록.
        //
        CrashReport.putCustom("name", "tester");
        ...


        setContentView(R.layout.activity_main);

        .....

    }
~~~~


#### 5. API 소개

~~~~
static
setCrashReport(final Context context, final String id)
~~~~

* Crash 정보를 Cloud에 전송 하도록 설정
* 앱 실행 시 onCreate에서 setContentView 이전에 설정 하는것을 권장한다.
* Parameters
    - context : MainActivity Instance
    - id : 사전에 제공되는 Oracle Cloud ID



~~~~
static
putCustom(String key, String value)
~~~~
* Crash 정보를 Cloud에 전송할때 추가로 전송하고자 하는 정보를 등록 및 수정
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

~~~~
static
postCustomCrash(final String title, final String description, final CompletionCallback callback)


-- Interface --

public interface CompletionCallback {
    void onSendComplete(int resultCode, String response);
}

-- example --

CrashReport.postCustomCrash("Title", "Description", 
    new CrashReport.CompletionCallback() {
                    @Override
                    public void onSendComplete(int resultCode, String response) {
                        Log.d("MainActivity","SEND CUSTOM CRASH COMPLETE :" + resultCode + "   " + response);
                    }
                });
~~~~
* 크래쉬 정보를 cloud에 전송
* CrashReport.CompletionCallack interface 를 통해 전송 완료 정보를 전달 받을 수 있다.
* 실제로 Crash가 발생하지 않았으나 debuggin등의 목적으로 crash 정보를 생성하여 서버에 전송하고자 할때 사용한다.
* 위 api를 사용하더라도 실제로 crash가 발생하지 않는다.
* 앱 실행중 언제든 사용 가능하다.
* Parameters
    - title : title string
    - description : description string
    - callback : CrashReport.CompletionCallack interface를 상속받은 객체


# User Feedback For Android

#### 1. Library Information

사용자의 Feedback을 수집 합니다.

* Min SDK Ver : API 16 - Android 4.1(Jelly Bean)  
* 배포형태 : aar  
 
(특수한 빌드 환경에서의 라이브러리 필요 시, 빌드 환경 정보와 함께 별도 요청 바랍니다)


#### 2. 크래쉬 레포트 라이브러리 모듈 추가
userfeedback-debug.arr (userfeedback-release.arr)과 mqacore-debug.arr (mqacore-release.arr)을 개발중인 project에 import합니다.

1. File->Project Structure... 선택
2. 좌상단의 + 를 누르고, New Module 화면 하단의 Import .JAR/.AAR Package 선택
3. 배포된 aar 파일을 선택해서 프로젝트에 포함

(자세한 라이브러리 추가 방법은 Android 개발자 도큐먼트를 참고하세요)

#### 3. Dependency 설정
1. 포함하고자 하는 모듈을 선택하고, Dependencies를 선택
2. Dependencies창 좌하단의 + -> Module Dependency 선택
3. 새로 추가된 userfeedback-XXX,  mqacore-xxx를 선택


#### 4. MainActivity 수정

~~~~
// 안드로이드용 SDK import
import kr.peopledream.mqa.userfeedback.UserFeedback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (savedInstanceState == null) {
            
            //
            // 필수 : MobileQA - Crash 정보 전송 설정
            // "** user_id **"는 사전에 제공되는 Oracle ID를 입력하여야 합니다.
            //
            UserFeedback.setFeedback(this, "** user_id **");
        }

        //
        // 옵션 : Crash 정보를 받을때 추가로 받고자 하는 데이터를 
        // Key / Value 형태로 등록.
        //
        UserFeedback.putCustom("name", "tester");
        ...



        //
        // 버튼을 Click 하였을때 User Feedback 화면이 노출되도록 설정한 Sample
        //
        buttonFeedback.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                
                //
                // User Feedback 화면을 노출시킵니다.
                //
                UserFeedback.showFeedback();

            }
        });

    }

    ...
~~~~


#### 5. API 소개

~~~~
static
setFeedback(final Context context, final String id)
~~~~

* Crash 정보를 Cloud에 전송 하도록 설정
* 앱 실행 시 MainActivity의 onCreate에서 설정 하는것을 권장한다.
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
showFeedback()
~~~~
* User Feedback 화면을 노출.
* 앱 실행중 언제든 사용 가능하다.
    


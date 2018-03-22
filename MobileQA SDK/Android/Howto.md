#### 1. Library Information

비정상 종료 시 서버로 관련 정보를 전송 합니다. 만약 해당 시점에 전송이 실패하면, 다음 앱 실행시에 다시한번 crash정보를 전송 합니다.

* Compile SDK : API26
* Build Tools : 26.0.2
* Min SDK Ver : API 16 - Android 4.1(Jelly Bean)
* 배포형태 : aar

(기타 빌드 환경에서의 라이브러리 필요 시, 빌드 환경 정보와 함께 별도 요청 바랍니다)


#### 2. 크래쉬 레포트 라이브러리 모듈 추가
crashlibrary-debug.arr (crashlibrary-release.arr)과 mqacore-debug.arr (mqacore-release.arr)을 개발중인 project에 import합니다.

1. File->Project Structure... 선택
2. 좌상단의 + 를 누르고, New Module 화면 하단의 Import .JAR/.AAR Package 선택
3. 배포된 aar 파일을 선택해서 프로젝트에 포함


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


//
// 필수 : MobileQA - Crash 정보 전송 설정
//
if (savedInstanceState == null) {
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

## * '** user_id **'은 오라클 서비스 접속을 위해 사전에 제공된 id를 입력하여야 합니다.
## * Sample Project Build 오류 발생시 Clean

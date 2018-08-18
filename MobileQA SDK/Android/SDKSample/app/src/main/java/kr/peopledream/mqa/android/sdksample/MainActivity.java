package kr.peopledream.mqa.android.sdksample;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import kr.peopledream.mqa.crashreportlib.CrashReport;
import kr.peopledream.mqa.userfeedback.UserFeedback;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        CrashReport.setCrashReport(this, "--oracle cloud id (email)--");
        UserFeedback.setFeedback(this, "--oracle cloud id (email)--");


        Button buttonCrash = (Button)findViewById(R.id.buttonCrash);
        buttonCrash.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                throw new RuntimeException();
            }
        });


        Button buttonFeedback = (Button)findViewById(R.id.buttonFeedback);
        buttonFeedback.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                UserFeedback.showFeedback();
            }
        });
    }


}

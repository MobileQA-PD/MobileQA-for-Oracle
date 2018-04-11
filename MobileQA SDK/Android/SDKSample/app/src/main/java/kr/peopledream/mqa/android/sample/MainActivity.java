package kr.peopledream.mqa.android.sample;

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


        // Initialize Crash Report
        CrashReport.setCrashReport(getApplicationContext(), "** user_id **");
        // Initialize User Feedback
        UserFeedback.setFeedback(MainActivity.this, "** user_id **");


        setContentView(R.layout.activity_main);



        ((Button)findViewById(R.id.buttonFeedback)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                // Open Feedback Activity
                UserFeedback.showFeedback();
            }
        });



        ((Button)findViewById(R.id.buttonCrash)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                throw new RuntimeException();
            }
        });

    }



}

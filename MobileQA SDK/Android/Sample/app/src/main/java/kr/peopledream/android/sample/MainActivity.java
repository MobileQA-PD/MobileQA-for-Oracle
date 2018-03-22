package kr.peopledream.android.sample;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

//
// Crash Reprot Library Import
//
import kr.peopledream.mqa.crashreportlib.CrashReport;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        //
        // Initialize Crash Report
        //
        // (repolace '*** input oracle cloud user id ***' to your oracle user id)
        //
        CrashReport.setCrashReport(this, "*** input oracle cloud user id ***");


        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        //
        // Make Exception For Test
        //
        Button button = findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                throw new RuntimeException();
            }
        });

    }
}

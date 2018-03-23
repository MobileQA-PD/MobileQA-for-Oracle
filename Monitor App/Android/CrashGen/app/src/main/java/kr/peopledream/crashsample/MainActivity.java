package kr.peopledream.crashsample;

import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import kr.peopledream.mqa.crashreportlib.CrashReport;

public class MainActivity extends AppCompatActivity {

    EditText editTextCloudId;
    TextView textViewMessage;
    Button buttonInitialize;
    Button buttonCrash;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        editTextCloudId = (EditText)findViewById(R.id.editTextCloudId);
        textViewMessage = (TextView)findViewById(R.id.textViewMessage);
        buttonInitialize = (Button)findViewById(R.id.buttonInitialize);
        buttonCrash = (Button)findViewById(R.id.buttonCrash);

        // 초기 상태
        buttonCrash.setEnabled(false);

        final String cloudId = loadCloudId();
        if (cloudId != null && !cloudId.isEmpty()) {
            editTextCloudId.setText(cloudId);
            CrashReport.setCrashReport(getApplicationContext(), cloudId);
            buttonCrash.setEnabled(true);
        }

        buttonInitialize.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                textViewMessage.setText("");

                String cloudId = editTextCloudId.getText().toString();

                if (cloudId == null || cloudId.isEmpty()) {
                    textViewMessage.setText("Input Cloud ID");
                }
                else {
                    saveCloudId(cloudId);
                    CrashReport.setCrashReport(getApplicationContext(), cloudId);
                    buttonCrash.setEnabled(true);
                }
            }
        });

        buttonCrash.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                textViewMessage.setText("");

                String cloudId = editTextCloudId.getText().toString();

                if (cloudId == null || cloudId.isEmpty()) {
                    textViewMessage.setText("Input Cloud ID");
                    buttonCrash.setEnabled(false);
                }
                else {
                    throw new RuntimeException();
                }
            }
        });


    }

    private void saveCloudId(String cloudId) {
        SharedPreferences sharedPrefs = getSharedPreferences("cloud_id", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPrefs.edit();
        editor.putString("cloud_id", cloudId);
        editor.commit();
    }

    private String loadCloudId() {
        SharedPreferences sharedPrefs = getSharedPreferences("cloud_id", MODE_PRIVATE);
        return sharedPrefs.getString("cloud_id", null);
    }

}

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['jquery', 'mcs'], function($, mcs) {

    // let baseUrl = "https://mobile-a522193.mobileenv.us2.oraclecloud.com:443"; // DEPLOY_OPTION=baseUrl
    // let backendId = "d07ac900-84f5-4757-ab68-ceeb2b71b596"; // DEPLOY_OPTION=backendId
    // let anonymousToken = "QTUyMjE5M19NT0JJTEVfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpScjIuMWt2bGR0YnpudQ=="; // DEPLOY_OPTION=anonymousToken

    var mcsConfig = {
        "logLevel": mcs.logLevelInfo,
        "mobileBackends": {
            "QoS_MBE": {
                "default": true,
                "baseUrl": "" ,
                "applicationKey": "",
                "authorization": {
                    "basicAuth": {
                        "backendId": "",
                        "anonymousToken": ""
                    },
                    "oAuth": {
                      "clientId": "",
                      "clientSecret": "",
                      "tokenEndpoint": ""
                    },
                    "facebookAuth":{
                      "facebookAppId": "YOUR_FACEBOOK_APP_ID"
                    },
                    "ssoAuth":{
                      "tokenEndpoint": ""
                    }

                }
            }
        }
    }
    
    
    return mcsConfig;
});

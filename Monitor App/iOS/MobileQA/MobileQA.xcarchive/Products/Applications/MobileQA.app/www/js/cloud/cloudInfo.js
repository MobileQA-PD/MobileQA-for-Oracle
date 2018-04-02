
define(['jquery'], function($) {

    function CloudInfoManager() {        
        var self = this;
        var cloudInfo = null;

        (function() {

        }())

        self.saveUserId = function(userId) {
            localStorage.setItem('ci_user_id', userId)
        }

        self.loadUserId = function() {
            return localStorage.getItem('ci_user_id')
        }

        self.savePassword = function(password) {
            localStorage.setItem('ci_password', password)
        }

        self.loadPassword = function() {
            return localStorage.getItem('ci_password')
        }

        self.loadCloudInfo = function(userId) {

            if (userId == null) {
                return null
            }

            if (cloudInfo == null) {
                return null
            }
                
            if (cloudInfo.username.toLowerCase() != userId.toLowerCase()) {
                return null
            }

            return cloudInfo

            /*
            if (userId == null) {
                return null
            }

            var cloudInfoString = localStorage.getItem(userId.toLowerCase() + "_cloudInfo.data")
            if (cloudInfoString != null) {
              return JSON.parse(cloudInfoString)
            }
            */
        }

        self.saveCloudInfo = function(userId, data) {

            cloudInfo = data;

            // localStorage.setItem(userId.toLowerCase() + "_cloudInfo.data", JSON.stringify(data))
        }

        self.setMcsConfig = function (mcsconfig, data) {

            let baseUrl = data.infos.serviceInstances.base.url
            let backendId = data.backend
            let token = data.token
  
            mcsconfig.mobileBackends.QoS_MBE.baseUrl = baseUrl;
            mcsconfig.mobileBackends.QoS_MBE.authorization.basicAuth.backendId = backendId;
            mcsconfig.mobileBackends.QoS_MBE.authorization.basicAuth.anonymousToken = token;
  
            mcsconfig.baseUrl = baseUrl
            mcsconfig.backendId = backendId
            mcsconfig.anonymousToken = token
  
            console.log("********************")
            console.log(JSON.stringify(mcsconfig))
            console.log("********************  mcs setup complete")
        }

        self.getCloudInfo = function(userId) {
            return new Promise(function(success, fail) {

                if (userId == null) {
                    fail("No User ID")
                    return;
                }

                

                let data = self.loadCloudInfo(userId)

                if (data != null) {
                    success(data)
                    return;
                }

                
                let reqBody = {
                    "userId" : userId
                }

                $.ajax({
                    url: "https://4dgjplznq6.execute-api.us-east-2.amazonaws.com/MqaInfo/getMqaInfo",
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json; charset=utf-8'
                    },
                    data: JSON.stringify(reqBody)

                    }).done(function (data, statusCode) {

                        console.log('status code : ' + statusCode)
                        console.log('data: ' + JSON.stringify(data))
            
                        if (data['errorMessage'] == null) {
                            // Cloud Info 저장
                            self.saveCloudInfo(userId, data)

                            success(data)
                        }
                        else {
                            fail (data.errorMessage)
                        }
        
                    }).fail(function (xhr, statusCode) {
                        console.log('ERROR: ' + statusCode)
                        fail ('Get Cloud Info Error (' + statusCode + ')')
                    })

            });
          };
        
        self.getCurrentCloudInfo = () => {
          return cloudInfo
        }
    }
    return new CloudInfoManager();
}) 
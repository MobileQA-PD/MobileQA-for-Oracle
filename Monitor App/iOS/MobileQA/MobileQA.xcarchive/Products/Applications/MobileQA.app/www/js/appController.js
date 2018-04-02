/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */



define(['ojs/ojcore', 'knockout', 'mbe', 'mcsconfig', 'cloudInfo', 'ojs/ojrouter', 'ojs/ojarraytabledatasource', 'ojs/ojmoduleanimations',
    'ojs/ojbutton', 'ojs/ojinputtext', 'ojs/ojcollapsible'],
  function(oj, ko, mbe, mcsconfig, cloudInfo) {
     function ControllerViewModel() {

      var self = this;
      var getTranslation = oj.Translations.getResource;

      self.isLoggedIn = ko.observable(false);
      self.companyName = ko.observable(getTranslation("companyName"));
      self.appName = ko.observable(getTranslation("appName"));

      self.username = ko.observable(cloudInfo.loadUserId());
      self.password = ko.observable(cloudInfo.loadPassword());

      self.buttonLogin = ko.observable(getTranslation("button.login"));
      self.buttonLogout = ko.observable(getTranslation("button.logout"));
      self.loginMessage = ko.observable('');
      self.navDataSource = ko.observable('');

      self.login = function() {
        
        function performLogin() {
          mbe.authenticate(self.username(), self.password()).then(function() {
            console.log("authentication success");

            // 비밀번호 저장
            cloudInfo.savePassword(self.password())

            self.isLoggedIn(true);
            //self.router.stateId = 'dashbard';
            self.router.go('dashboard');
            //oj.Router.rootInstance.go('dashboard');
            //self.router.stateId = {name: getTranslation('module.crashevent'), id: 'dashboard',
            //iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'};
          }, function() {  
            self.loginMessage('Invalid username and/or password');
            self.isLoggedIn(false);
          });
        }

        // Username 입력 Check
        if (self.username() == null) {
          self.loginMessage('Input Username')
          self.isLoggedIn(false)
          return
        }


        // cloud info를 가져 옵니다.
        cloudInfo.getCloudInfo(self.username()).then(
          function(data) {
            // user id는 정상이니 저장합니다.
            cloudInfo.saveUserId(self.username())
            // 접속 정보를 설정 합니다.
            cloudInfo.setMcsConfig(mcsconfig, data)
            self.initNav();
            // login을 진행 합니다.
            performLogin();
          },
          function(errormsg) {
            self.loginMessage(errormsg)
            self.isLoggedIn(false)
          }
        )
      };
      
      self.logout = function() {
          mbe.logout().then(function() {
              self.isLoggedIn(false);
              self.router.go('beforelogin');
              window.location.reload(true);
          }, function(e) {
             console.log("logout error: " + e); 
          });
      };
      
      self.onPageReady = function() {
        // self.username = ko.observable(cloudInfo.loadUserId());
        // self.password = ko.observable(cloudInfo.loadUserPasword());  
      };
      // Save the theme so we can perform platform specific navigational animations
      var platform = oj.ThemeUtils.getThemeTargetPlatform();

      // Router setup
      self.router = oj.Router.rootInstance;

      self.router.configure({
       'beforelogin': {label: 'BeforeLogin-invisible', isDefault: true},
       'dashboard': {label: getTranslation('module.crashevent')},
       'crashevent-list': {label: 'Crash Event List'},
       'crashevent-details': {label: 'Crash Event Details'},
       'report': {label: getTranslation('module.report')},
       'feedback': {label: getTranslation('module.feedback')},
       'feedback-list': {label: 'Feedback List'},
       'feedback-details': {label: 'Feedback Details'},
       'feedback-report': {label: getTranslation('module.feedbackReport')},
       'setting': {label: 'Settings'},
       'manage-members': {label: 'Manage Members'},
       'add-members': {label: 'Add Member'},
       'modify-members': {label: 'Recipients Management'},
       //'member-details': {label: 'Member Details'}

      });

      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
      // Callback function that can return different animations based on application logic.
      function switcherCallback(context) {
        if (platform === 'android')
          return 'fade';
        return null;
      };

      function mergeConfig(original) {
        return $.extend(true, {}, original, {
          'animation': oj.ModuleAnimations.switcher(switcherCallback)
        });
      }

      self.moduleConfig = mergeConfig(self.router.moduleConfig);

      // Navigation setup
      let navData = [];

      self.initNav = () => {
        let cdata = cloudInfo.getCurrentCloudInfo();
        // console.log('cdata: ' + JSON.stringify(cdata));

        navData = [];

        if (cdata.enabled.crash) {
          navData.push({
            name: getTranslation('module.crashevent'),
            id: 'dashboard',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
          });
    
          navData.push({
            name: getTranslation('module.report'),
            id: 'report',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
          });
        }

        if (cdata.enabled.feedback) {
          navData.push({
            name: getTranslation('module.feedback'),
            id: 'feedback',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
          });

          navData.push({
            name: getTranslation('module.feedbackReport'),
            id: 'feedback-report',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
          });
        }

        self.navDataSource(new oj.ArrayTableDataSource(navData, {idAttribute: 'id'}));
      }
      
      // navData.push({
      //   name: getTranslation('module.crashevent'),
      //   id: 'dashboard',
      //   iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
      // });

      // navData.push({
      //   name: getTranslation('module.report'),
      //   id: 'report',
      //   iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
      // });

      self.navDataSource(new oj.ArrayTableDataSource(navData, {idAttribute: 'id'}));

      // Header Setup
      self.getHeaderModel = function() {
        var headerFactory = {
          createViewModel: function(params, valueAccessor) {
            var model =  {
              pageTitle: self.router.currentState().label,
              logout: self.logout,
              goBack: function() { window.history.back() },
              modify: function() { self.router.go('modify-member') },
              buttonLogout: self.buttonLogout,
              handleBindingsApplied: function(info) {
                  console.log("handleBindingsApplied");
                // Adjust content padding after header bindings have been applied
                self.adjustContentPadding();
              }
            };
            return Promise.resolve(model);
          }
        }
        return headerFactory;
      }

      // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions. 
      // This method should be called whenever your fixed region height may change.  The application
      // can also adjust content paddings with css classes if the fixed region height is not changing between 
      // views.
      self.adjustContentPadding = function () {
        var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

        if (topElem) {
          contentElem.style.paddingTop = topElem.offsetHeight+'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.clientHeight+'px';
        }
        // Add oj-complete marker class to signal that the content area can be unhidden.
        // See the override.css file to see when the content area is hidden.
        contentElem.classList.add('oj-complete');
      }
    }

    return new ControllerViewModel();
  }
);

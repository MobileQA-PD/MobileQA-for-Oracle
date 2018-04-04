/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'mbe',
  'ojs/ojarraytabledatasource', 'ojs/ojlistview', 'ojs/ojmasonrylayout',
  'ojs/ojcollapsible', 'ojs/ojchart', 'ojs/ojselectcombobox'],
  function (oj, ko, $, app, mbe) {
    function AppNode (appId, appName) {
      this.appId = appId
      this.appName = appName
      this.appVersions = []
    }

    function DashboardViewModel () {
      var self = this
      self.app = app

      self.isLoggedIn = app.isLoggedIn

      self.applications = ko.observableArray([])
      self.applicationMap = {}
      self.dataSource = new oj.ArrayTableDataSource(self.applications, { idAttribute: 'appId' })

      self.selectedApplications = ko.observableArray([])

      self.selectedAppId = ko.observable('')
      self.selectedAppVersion = ko.observable('')

      self.appVersions = ko.observableArray([])

      self.deviceSeriesValue = ko.observableArray([])

      self.osSeriesValue = ko.observableArray([])

      self.centerLabel = ko.observable(null)
      self.selectionDevice = ko.observableArray([])
      self.selectionOS = ko.observableArray([])

      self.getTranslation = oj.Translations.getResource

      // Header Config
      self.headerConfig = {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()}

      // Below are a subset of the ViewModel methods invoked by the ojModule binding
      // Please reference the ojModule jsDoc for additionaly available methods.

      /**
       * Optional ViewModel method invoked when this ViewModel is about to be
       * used for the View transition.  The application can put data fetch logic
       * here that can return a Promise which will delay the handleAttached function
       * call below until the Promise is resolved.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
       * the promise is resolved
       */
      self.handleActivated = function (info) {
        console.log('handleActivated..')
        // Implement if needed
        console.log('logined: ' + app.isLoggedIn())
        if (app.isLoggedIn()) {
          if (self.applications().length === 0) self.getApplicationList()
        }
      }

      self.getApplicationList = function () {
        mbe.invokeCustomAPI('QoSEventAggService/applications', 'GET', null, function (statusCode, data) {
          console.log(JSON.stringify(data))

          self.applications([])
          self.applicationMap = {}

          for (var i = 0; i < data.length; i++) {
            var obj = self.applicationMap[data[i].appId]
            if (obj === undefined) {
              obj = new AppNode(data[i].appId, data[i].appName)
              self.applicationMap[data[i].appId] = obj
            }
            obj.appVersions.push(data[i].appVersion)
          }

          for (var key in self.applicationMap) {
            console.log('key: ' + key)
            var app = self.applicationMap[key]
            console.log('app: ' + JSON.stringify(app))
            self.applications.push(app)
          }

          if (self.applications().length > 0) {
            var appId = self.applications()[0].appId
            self.selectedApplications([appId])
            self.buildAppVersionOptions(self.applicationMap[appId].appVersions)
            self.selectedAppId(appId)
            self.selectedAppVersion('%')
            self.getReportStateValue()['appId'] = appId
            self.getSummary()
          }
        }, self.errorCallback)
      }

      self.getSummary = function () {
        if (self.selectedAppId() === '') return;

        var url = encodeURI('QoSEventAggService/summary?appId=' +
                self.selectedAppId() + '&appVersion=' +
                self.selectedAppVersion())
        console.log('url: ' + url)
        mbe.invokeCustomAPI(url, 'GET', null, function (statusCode, data) {
          console.log('getSummary')
          console.log(JSON.stringify(data))

          var items = data.items
          var deviceObj = {}
          var osObj = {}

          var totalCount = 0

          for (var i = 0; i < items.length; i++) {
            totalCount += items[i].count
            if (deviceObj[items[i].deviceModel] === undefined) {
              deviceObj[items[i].deviceModel] = items[i].count
            } else {
              deviceObj[items[i].deviceModel] += items[i].count
            }

            var osKey = items[i].osName + ' ' + items[i].os_Version
            if (osObj[osKey] === undefined) {
              osObj[osKey] = items[i].count
            } else {
              osObj[osKey] += items[i].count
            }
          }
          self.centerLabel('' + totalCount)

          var deviceSeries = []
          var deviceID = 0
          for (var device in deviceObj) {
            deviceSeries.push({ 'name': device, items: [ { 'value': deviceObj[device], 'id': deviceID++ } ] })
          }

          console.log('deviceSeries: ' + JSON.stringify(deviceSeries))
          var osSeries = []
          var osID = 0
          for (var os in osObj) {
            osSeries.push({ 'name': os, items: [ { 'value': osObj[os], 'id': osID++ } ] })
          }
          self.deviceSeriesValue(deviceSeries)
          self.osSeriesValue(osSeries)

          self.selectionDevice([])
          self.selectionOS([])

          console.log('osSeries: ' + JSON.stringify(osSeries))
        }, self.errorCallback)
      }

      self.applicationSelected = function (event, ui) {
        if (ui.option === 'selection' && ui.value.length > 0) {
          console.log('applicationSelected: ' + JSON.stringify(ui.value))
          console.log('applicationSelected: ' + JSON.stringify(self.selectedApplications()))

          var appId = ui.value[0]
          console.log('application: ' + JSON.stringify(self.applicationMap[appId]))
          self.buildAppVersionOptions(self.applicationMap[appId].appVersions)
          self.selectedAppId(appId)
          self.selectedAppVersion('%')

          self.getReportStateValue()['appId'] = appId

          self.getSummary()
        }
      }

      self.versionSelected = function (event, data) {
        if (data.option === 'value') {
          var version = data.value[0]
          self.selectedAppVersion(version)
          self.getSummary()
          self.getReportStateValue()['appVersion'] = version
        }
      }

      self.getReportStateValue = function () {
        if (self.app.router.getState('report').value === undefined) {
          self.app.router.getState('report').value = {}
        };
        return self.app.router.getState('report').value
      }

      self.buildAppVersionOptions = function (versionArray) {
        console.log('buildAppVersionOptions: ' + JSON.stringify(versionArray))
        self.appVersions([])
        self.appVersions.push({ 'value': '%', 'label': self.getTranslation('label.allVersions') })
        versionArray.forEach(function (element) {
          self.appVersions.push({'value': element, 'label': element})
        })
      }

      self.deviceSelected = function (event, ui) {
        if (ui.option === 'selection' && ui.value.length > 0) {
          console.log('deviceSelected: ' + JSON.stringify(self.selectionDevice()))
          console.log('deviceSelected: ' + JSON.stringify(ui.value[0]))
          var params = {
            'appId': self.selectedAppId(),
            'appVersion': self.selectedAppVersion(),
            'deviceModel': ui.value[0].series
          }
          self.app.router.getState('crashevent-list').value = params
          self.app.router.go('crashevent-list')
        }
      }

      self.osSelected = function (event, ui) {
        if (ui.option === 'selection' && ui.value.length > 0) {
          console.log('osSelected' + JSON.stringify(self.selectionOS()))

          var osString = self.selectionOS()[0].series
          var index = osString.indexOf(' ')
          var osName = osString.substring(0, index)
          var os_Version = osString.substring(index + 1, osString.length)

          var params = {
            'appId': self.selectedAppId(),
            'appVersion': self.selectedAppVersion(),
            'osName': osName,
            'os_Version': os_Version
          }

          console.log('params: ' + JSON.stringify(params))
          self.app.router.getState('crashevent-list').value = params
          self.app.router.go('crashevent-list')
        }
      }

      self.errorCallback = function (statusCode, data) {
        console.log(JSON.stringify(data))
      }

      self.selectApplication = function () {
        console.log('selectApplication')
      }

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
       */
      self.handleAttached = function (info) {
        // Implement if needed
      }

      /**
       * Optional ViewModel method invoked after the bindings are applied on this View.
       * If the current View is retrieved from cache, the bindings will not be re-applied
       * and this callback will not be invoked.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       */
      self.handleBindingsApplied = function (info) {
        // Implement if needed
      }

      /*
       * Optional ViewModel method invoked after the View is removed from the
       * document DOM.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
       */
      self.handleDetached = function (info) {
        // Implement if needed
      }
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constrcuted
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel()
  }
)

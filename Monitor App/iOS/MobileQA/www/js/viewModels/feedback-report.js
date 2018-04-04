/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'mbe', 'mcsconfig', 'cloudInfo','ojs/ojdatetimepicker',
  'ojs/ojselectcombobox', 'ojs/ojtimezonedata', 'ojs/ojbutton',
  'ojs/ojchart', 'ojs/ojtoolbar', 'ojs/ojinputtext', 'ojs/ojprogressbar'],
  function (oj, ko, $, app, mbe, mcsconfig, cloudInfo) {

    function FeedbackReportViewModel () {
      var self = this      
      self.getTranslation = oj.Translations.getResource
      
      self.app = app
      self.reportURI = ko.observable('')

      self.reportFilename = ko.observable('')

      self.appId = ko.observable('')
      self.appVersion = ko.observable('')

      var today = new Date()
      var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)))
      self.endDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(tomorrow))

      self.areaGroups = ko.observableArray([])
      self.osAreaSeries = ko.observableArray([])
      self.deviceAreaSeries = ko.observableArray([])
      self.countsPerDeviceModel = {}
      self.countsPerOSType = {}
      self.countsPerDeviceModelString = ko.observable('') // string value of countsPerDeviceModel excluded {}
      self.countsPerOSTypeString = ko.observable('') // string value of countsPerDeviceModel

      self.feedbackIdArray = []

      self.generatingFeedbackReport = ko.observable(false)
      self.progressValue = ko.observable(-1) // indetermiate

      self.generateEnabled = ko.observable(false)

      let cdata = cloudInfo.getCurrentCloudInfo();
      self.analyticsExport = ko.observable(cdata ? cdata.enabled.analyticsExport : false)

      console.log('analyticsExport: ' + self.analyticsExport() + ', cdata: ' + cdata);

      // Header Config
      self.headerConfig = { 'viewName': 'header', 'viewModelFactory': app.getHeaderModel() }

      self.setOneDay = function () {
        var today = new Date()
        var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
        self.startDate(oj.IntlConverterUtils.dateToLocalIso(today))
        self.endDate(oj.IntlConverterUtils.dateToLocalIso(tomorrow))
      }

      self.toDateString = function (date) {
        var text = ''
        text += date.getFullYear()
        text += '-'
        text += date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        text += '-'
        text += date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
        return text
      }

      self.toMonthAndDate = function (date) {
        var text = ''
        text += date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        text += '-'
        text += date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
        return text
      }

      self.setOneWeek = function () {
        var today = new Date()
        var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
        self.startDate(oj.IntlConverterUtils.dateToLocalIso(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)))
        self.endDate(oj.IntlConverterUtils.dateToLocalIso(tomorrow))
      }

      self.dateChanged = function (event, data) {
        console.log('event target: ' + event.target)
        console.log('data option: ' + data.option)

        if (data.option !== 'value') {
          return
        }

        if (self.analyticsExport()) {
          var sdate = new Date(self.startDate())
          var edate = new Date(self.endDate())
          console.log('sdate: ' + sdate)

          console.log('accessToken: ' + mbe.getAccessToken())

          var baseUrl = mcsconfig.mobileBackends.QoS_MBE.baseUrl
          var mbeID = mcsconfig.mobileBackends.QoS_MBE.authorization.basicAuth.backendId
          var url = baseUrl + '/mobile/system/analyticsExport/export/request'
          console.log('mbeID: ' + mbeID)
          var reqBody = {
            'startDate': self.toDateString(sdate),
            'endDate': self.toDateString(edate),
            'exportType': 'Events',
            'name': 'Feedback'
          }

          console.log('reqBody: ' + JSON.stringify(reqBody))
          $.ajax({
            url: url,
            method: 'POST',
            headers: {
              'oracle-mobile-backend-id': mbeID,
              'Authorization': mbe.getAccessToken(),
              'content-type': 'application/json; charset=utf-8'
            },
            data: JSON.stringify(reqBody)
          }).done(function (data, statusCode) {
            console.log('data: ' + JSON.stringify(data))
            self.doAnalytics(data.items);
            self.generateEnabled(true);
          }).fail(function (xhr, statusCode) {
            console.log('ERROR: ' + statusCode)
          })
        } else {
          var params = self.app.router.currentState().value
          var queryString = encodeURI(`appVersion=${self.appVersion()}&appId=${self.appId()}`)
          console.log('queryString: ' + queryString)

          self.feedbackIdArray = []
          var url = 'QoSFeedbackAggService/feedbacks?' + queryString
          mbe.invokeCustomAPI(url, 'GET', null, function (statusCode, data) {
            console.log('data: ' + JSON.stringify(data))
            self.doAnalyticsAgg(data.items);
            self.generateEnabled(true);
          },
          function (error) {
          })
        }
      }

      self.doAnalytics = (items) => {
        var sdate = new Date(self.startDate())
        var edate = new Date(self.endDate())
        console.log('sdate: ' + sdate)

        // filter by appName and version
        items = self.filterItems(items)
        console.log('filtered data: ' + JSON.stringify(items))

        var deviceModelMap = {}
        var osMap = {}
        var monthAndDateMap = {}
        self.areaGroups([])
        self.feedbackIdArray = []

        for (var i = 0; i < items.length; i++) {
          var monthAndDate = self.toMonthAndDate(new Date(items[i].timestamp))

          if (monthAndDateMap[monthAndDate] === undefined) {
            monthAndDateMap[monthAndDate] = {}
          }

          var prop = items[i].properties

          if (prop.id) {
            try {
              self.feedbackIdArray.push(parseInt(prop.id))
            } catch (error) {
              console.log('feedback id is invalid: ' + prop.id)
            }
          }

          if (deviceModelMap[prop.deviceModel] === undefined) {
            deviceModelMap[prop.deviceModel] = []
          }

          var osKey = prop.osName + ' ' + prop.os_Version
          if (osMap[osKey] === undefined) {
            osMap[osKey] = []
          }

          if (monthAndDateMap[monthAndDate][prop.deviceModel] === undefined) {
            monthAndDateMap[monthAndDate][prop.deviceModel] = 1
          } else {
            monthAndDateMap[monthAndDate][prop.deviceModel]++
          }

          if (monthAndDateMap[monthAndDate][osKey] === undefined) {
            monthAndDateMap[monthAndDate][osKey] = 1
          } else {
            monthAndDateMap[monthAndDate][osKey]++
          }
        }

        var dateArray = []
        for (var time = sdate.getTime(); time < edate.getTime(); time += (24 * 60 * 60 * 1000)) {
          dateArray.push(self.toMonthAndDate(new Date(time)))
        }

        self.areaGroups(dateArray)
        for (var i = 0; i < dateArray.length; i++) {
          for (var key in deviceModelMap) {
              if (monthAndDateMap[dateArray[i]] === undefined ||
                monthAndDateMap[dateArray[i]][key] === undefined) {
                deviceModelMap[key].push(0)
              } else {
                deviceModelMap[key].push(monthAndDateMap[dateArray[i]][key])
              }
          }
          for (var key in osMap) {
            if (monthAndDateMap[dateArray[i]] === undefined ||
              monthAndDateMap[dateArray[i]][key] === undefined) {
              osMap[key].push(0)
            } else {
              osMap[key].push(monthAndDateMap[dateArray[i]][key])
            }
          }
        }

        console.log('areaGroups: ' + JSON.stringify(self.areaGroups()))
        console.log('deviceModelMap: ' + JSON.stringify(deviceModelMap))
        console.log('osMap: ' + JSON.stringify(osMap))

        self.deviceAreaSeries([])
        self.countsPerDeviceModel = {}
        for (var key in deviceModelMap) {
          self.deviceAreaSeries.push({ 'name': key, 'items': deviceModelMap[key] })
          // sum each array
          self.countsPerDeviceModel[key] = deviceModelMap[key].reduce(function (value1, value2) {
            return value1 + value2
          }, 0)
        }

        self.osAreaSeries([])
        self.countsPerOSType = {}
        for (var key in osMap) {
          self.osAreaSeries.push({ 'name': key, 'items': osMap[key] })
          self.countsPerOSType[key] = osMap[key].reduce(function (value1, value2) {
            return value1 + value2
          }, 0)
        }
        self.reportFilename('')
        self.reportURI('')
        var deviceString = JSON.stringify(self.countsPerDeviceModel)
        var osString = JSON.stringify(self.countsPerOSType)
        self.countsPerDeviceModelString(deviceString.substring(1, deviceString.length - 1))
        self.countsPerOSTypeString(osString.substring(1, osString.length - 1))
      }

      self.doAnalyticsAgg = (items) => {
        var sdate = new Date(self.startDate())
        var edate = new Date(self.endDate())
        console.log('sdate: ' + sdate)

        let sDateString = self.toDateString(sdate);
        let eDateString = self.toDateString(edate);

        // filter by appName and version
        items = self.filterItemsAgg(items).filter((item) => {
          let dateString = self.toDateString(new Date(item.createdOn))
          return dateString >= sDateString && dateString <= eDateString
        })
        console.log('filtered data: ' + JSON.stringify(items))

        var deviceModelMap = {}
        var osMap = {}
        var monthAndDateMap = {}
        self.areaGroups([])
        self.feedbackIdArray = []

        items = items.sort((a, b) => {
          return a.id > b.id ? -1 : a.id < b.id ? 1 : 0
        })

        if (items.length > 0) {
          items.filter((item) => {
            let dateString = self.toDateString(new Date(item.createdOn))
            return dateString >= sDateString && dateString <= eDateString
          }).forEach((item) => {
            var monthAndDate = self.toMonthAndDate(new Date(item.createdOn))
  
            if (monthAndDateMap[monthAndDate] === undefined) {
              monthAndDateMap[monthAndDate] = {}
            }
  
            if (item.id) {
              try {
                self.feedbackIdArray.push(parseInt(item.id))
              } catch (error) {
                console.log('feedback id is invalid: ' + item.id)
              }
            }
  
            if (deviceModelMap[item.deviceModel] === undefined) {
              deviceModelMap[item.deviceModel] = []
            }
  
            var osKey = item.osName + ' ' + item.os_Version
            if (osMap[osKey] === undefined) {
              osMap[osKey] = []
            }
  
            if (monthAndDateMap[monthAndDate][item.deviceModel] === undefined) {
              monthAndDateMap[monthAndDate][item.deviceModel] = 1
            } else {
              monthAndDateMap[monthAndDate][item.deviceModel]++
            }
  
            if (monthAndDateMap[monthAndDate][osKey] === undefined) {
              monthAndDateMap[monthAndDate][osKey] = 1
            } else {
              monthAndDateMap[monthAndDate][osKey]++
            }
          })
        }

        var dateArray = []
        for (var time = sdate.getTime(); time < edate.getTime(); time += (24 * 60 * 60 * 1000)) {
          dateArray.push(self.toMonthAndDate(new Date(time)))
        }

        self.areaGroups(dateArray)
        for (var i = 0; i < dateArray.length; i++) {
          for (var key in deviceModelMap) {
              if (monthAndDateMap[dateArray[i]] === undefined ||
                monthAndDateMap[dateArray[i]][key] === undefined) {
                deviceModelMap[key].push(0)
              } else {
                deviceModelMap[key].push(monthAndDateMap[dateArray[i]][key])
              }
          }
          for (var key in osMap) {
            if (monthAndDateMap[dateArray[i]] === undefined ||
              monthAndDateMap[dateArray[i]][key] === undefined) {
              osMap[key].push(0)
            } else {
              osMap[key].push(monthAndDateMap[dateArray[i]][key])
            }
          }
        }

        console.log('areaGroups: ' + JSON.stringify(self.areaGroups()))
        console.log('deviceModelMap: ' + JSON.stringify(deviceModelMap))
        console.log('osMap: ' + JSON.stringify(osMap))

        self.deviceAreaSeries([])
        self.countsPerDeviceModel = {}
        for (var key in deviceModelMap) {
          self.deviceAreaSeries.push({ 'name': key, 'items': deviceModelMap[key] })
          // sum each array
          self.countsPerDeviceModel[key] = deviceModelMap[key].reduce(function (value1, value2) {
            return value1 + value2
          }, 0)
        }

        self.osAreaSeries([])
        self.countsPerOSType = {}
        for (var key in osMap) {
          self.osAreaSeries.push({ 'name': key, 'items': osMap[key] })
          self.countsPerOSType[key] = osMap[key].reduce(function (value1, value2) {
            return value1 + value2
          }, 0)
        }
        self.reportFilename('')
        self.reportURI('')
        var deviceString = JSON.stringify(self.countsPerDeviceModel)
        var osString = JSON.stringify(self.countsPerOSType)
        self.countsPerDeviceModelString(deviceString.substring(1, deviceString.length - 1))
        self.countsPerOSTypeString(osString.substring(1, osString.length - 1))
      }

      // filter by mobileAppName and mobileAppVersion if configured
      self.filterItems = function (items) {
        var appId = self.appId()
        var appVersion = self.appVersion()
        var filterOperation = null
        if (appVersion !== '%') {
          filterOperation = function (value) {
            return value.properties.appId === appId &&
              value.properties.appVersion === appVersion
          }
        } else {
          filterOperation = function (value) {
            return value.properties.appId === appId
          }
        }
        return items.filter(filterOperation)
      }

      self.filterItemsAgg = function (items) {
        var appVersion = self.appVersion()
        var filterOperation = null
        if (appVersion !== '%') {
          filterOperation = function (value) {
            return value.properties.appVersion === appVersion
          }
          return items.filter(filterOperation)
        } else {
          return items;
        }
      }

      self.generateFeedbackReport = function () {
        self.generatingFeedbackReport(true)

        let cdata = cloudInfo.getCurrentCloudInfo()
        // console.log('cdata in report :' + JSON.stringify(cdata))

        var reqBody = {
          'startDate': self.toDateString(new Date(self.startDate())),
          'endDate': self.toDateString(new Date(self.endDate())),
          'appId': self.appId(),
          'appVersion': self.appVersion(),
          'createdOn': new Date(),
          'idArray': self.feedbackIdArray,
          'countsPerDeviceModel': self.countsPerDeviceModel,
          'countsPerOSType': self.countsPerOSType,
          'folderId': cdata.folderId.FeedbackReports
        }

        console.log('reqBody: ' + JSON.stringify(reqBody))

        mbe.invokeCustomAPI('QoSFeedbackReportService/reports', 'POST', JSON.stringify(reqBody), function (statusCode, data) {
          let url = cdata.infos.serviceInstances.cecs.url

          self.reportFilename(data.name)
          self.reportURI(url + '/api/1.1/files/' + data.id + '/data')
          self.generatingFeedbackReport(false)
        }, function (err) {
          console.log('report error: ' + err)
          self.generatingFeedbackReport(false)
        })
      }

      self.clickFeedbackReport = function () {
        var mbeID = mcsconfig.mobileBackends.QoS_MBE.authorization.basicAuth.backendId
        var url = self.reportURI()

        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        // Now set response type
        xhr.responseType = 'arraybuffer'
        xhr.setRequestHeader('Authorization', mbe.getAccessToken()/* 'Basic Y2hvbC5oby5qb25nQG9yYWNsZS5jb206RGFpZGFpMTAh' */)
        xhr.addEventListener('load', function () {
          if (xhr.status === 200) {
            self.openPDF(xhr)
          }
        })
        xhr.send()
      }

      self.openPDF = function (xhr) {
        var filename = 'file.pdf'
        var disposition = xhr.getResponseHeader('Content-Disposition')
        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          var matches = filenameRegex.exec(disposition)
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '').replace(/UTF-8/g, '')
        }

        var type = xhr.getResponseHeader('Content-Type')
        var blob = new Blob([xhr.response], { type: type })
        var blobURL = URL.createObjectURL(blob)

        var isIOSVOSupported = (oj.AgentUtils.getAgentInfo()['os'] === oj.AgentUtils.OS.IOS)
        if (isIOSVOSupported) {
          var ref = cordova.InAppBrowser.open(blobURL, '_blank', 'location=no')
          return
          // pathFile = cordova.file.documentsDirectory
        } else {
          pathFile = cordova.file.externalDataDirectory
        }

        window.resolveLocalFileSystemURL(pathFile, function (dir) {
          dir.getFile(filename, { create: true }, function (file) {
            var fileOb = file
            fileOb.createWriter(function (fileWriter) {
              fileWriter.write(xhr.response)
              cordova.plugins.fileOpener2.open(pathFile + filename, 'application/pdf', {
                error: function (e) {
                  console.log('Error status: ' + e.status + ' - Error message: ' + e.message)
                },
                success: function () {
                  console.log('file opened successfully')
                }
              })
            }, function (e) { console.error(e) })
          })
        })
      }

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
        // Implement if needed
        var params = self.app.router.currentState().value

        console.log('params: ' + JSON.stringify(params))

        if (!params) {
          self.app.router.go('feedback');
        } else {
          self.appId(params['appId'])
          if (params['appVersion'] === '%' || params['appVersion'] == null) {
            self.appVersion('%')
          } else {
            self.appVersion(params['appVersion'])
          }

          self.dateChanged({}, { 'option': 'value' })
        }

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
    return new FeedbackReportViewModel()
  }
)

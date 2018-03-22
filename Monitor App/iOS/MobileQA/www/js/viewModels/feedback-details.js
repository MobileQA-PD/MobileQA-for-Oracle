/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'mbe',
  'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojtabs', 'ojs/ojconveyorbelt'],
  function (oj, ko, $, app, mbe) {
    function FeedbackDetailsViewModel () {
      var self = this
      self.getTranslation = oj.Translations.getResource

      self.app = app
      self.id = ko.observable('')
      self.feedbackId = ko.observable('')
      self.createdOn = ko.observable('')
      self.title = ko.observable('')
      self.description = ko.observable('')
      self.deviceUuid = ko.observable('')
      self.deviceModel = ko.observable('')
      self.deviceManufacturer = ko.observable('')
      self.osName = ko.observable('')
      self.os_Version = ko.observable('')
      self.osLanguage = ko.observable('')
      self.osCountry = ko.observable('')
      self.appId = ko.observable('')
      self.appName = ko.observable('')
      self.appVersion = ko.observable('')
      self.custom = ko.observable('')
      self.type = ko.observable('')
      self.rate = ko.observable('')
      self.picture = ko.observable('')

      // Header Config
      self.headerConfig = { 'viewName': 'feedback/header', 'viewModelFactory': app.getHeaderModel() }

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

        var url = 'QoSFeedbackAggService/feedbacks/' + params.id
        mbe.invokeCustomAPI(url, 'GET', null, function (statusCode, data) {
          console.log(JSON.stringify(data))

          if (data.items.length > 0) {
            var value = data.items[0]
            console.log('crash feedback: ' + JSON.stringify(value))
            self.id(value.id)
            self.feedbackId(value.feedbackId)
            self.createdOn(new Date(value.createdOn).toLocaleString())
            self.title(value.title)
            self.description(value.description)
            self.deviceUuid(value.deviceUuid)
            self.deviceModel(value.deviceModel)
            self.deviceManufacturer(value.deviceManufacturer)
            self.osName(value.osName)
            self.os_Version(value.os_Version)
            self.osLanguage(value.osLanguage)
            self.osCountry(value.osCountry)
            self.appId(value.appId)
            self.appName(value.appName)
            self.appVersion(value.appVersion)

            let customInfo = ''
            if (value.custom) {
              let jsonCustom = JSON.parse(value.custom)
              for (let item in jsonCustom) {
                if (customInfo.length > 0) customInfo += '\n'
                customInfo += item + ': ' + jsonCustom[item]
              }
            }
            self.custom(customInfo)

            self.type(value.type)
            self.rate(value.rate)
            self.picture(value.picture)
          }
        }, function (error) {
          console.log('ERROR: ' + error)
        })
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
    return new FeedbackDetailsViewModel()
  }
)

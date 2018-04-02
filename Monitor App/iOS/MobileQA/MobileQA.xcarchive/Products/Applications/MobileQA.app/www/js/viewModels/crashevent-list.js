/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'mbe',
  'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojarraytabledatasource'],
  function (oj, ko, $, app, mbe) {
    function ListViewModel () {
      var self = this
      self.app = app
      self.getTranslation = oj.Translations.getResource

      self.crashEvents = ko.observableArray([])
      self.dataSource = new oj.ArrayTableDataSource(self.crashEvents, { idAttribute: 'id' })
      // Header Config
      self.headerConfig = { 'viewName': 'crashevent/header', 'viewModelFactory': app.getHeaderModel() }

      self.toDateFormat = function (date) {
        return new Date(date).toLocaleString()
      }

      self.viewEventDetails = function (event, ui) {
        if (ui.option === 'selection' && ui.items.length > 0) {
          var selectedIdsArray = $.map(ui.items, function (selectedListItem) {
            return selectedListItem.id
          })
          console.log('selectedIdsArray: ' + JSON.stringify(selectedIdsArray))

          var crashEventID = selectedIdsArray[0]

          var params = {
            'id': crashEventID
          }

          self.app.router.getState('crashevent-details').value = params
          self.app.router.go('crashevent-details')
        }
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
        var queryString = ''
        for (var key in params) {
          queryString += '&' + key + '=' + params[key]
        }
        queryString = encodeURI(queryString.substring(1, queryString.length))
        console.log('queryString: ' + queryString)

        var url = 'QoSEventAggService/events?' + queryString
        mbe.invokeCustomAPI(url, 'GET', null, function (statusCode, data) {
          console.log(JSON.stringify(data))

          data.items.sort(function (a, b) {
            return a.id > b.id ? -1 : a.id < b.id ? 1 : 0
          })

          // if (data.items.length > 0) {
          //   for (var i = 0; i < data.items.length; i++) {
          //     data.items[i].priority = data.items[i].priority.toLowerCase()
          //   }
          // }
          self.crashEvents(data.items)
        },
        function (error) {
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
    return new ListViewModel()
  }
)

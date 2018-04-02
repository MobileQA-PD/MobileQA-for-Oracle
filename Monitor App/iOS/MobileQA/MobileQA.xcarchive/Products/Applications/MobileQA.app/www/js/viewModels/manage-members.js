/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * setting module
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'hammerjs', 'appController', 'mbe','ojs/ojknockout',
    'ojs/ojjquery-hammer', 'ojs/ojswipetoreveal', 'ojs/ojlistview',
    'ojs/ojdatacollection-common', 'ojs/ojbutton', 'ojs/ojmenu', 'ojs/ojdialog', 'ojs/ojinputtext'],
        function (oj, ko, $, Hammer, app, mbe)
        {
            function emailModel()
            {
                var self = this;
                self.getTranslation = oj.Translations.getResource;
                self.buttonAdd = ko.observable(self.getTranslation("button.add"));
                
                self.app = app;
                self.headerConfig = {'viewName': 'crashevent/header', 'viewModelFactory': app.getHeaderModel()};
                self.selectedData;
                self.allItems = ko.observableArray([]);
                self.dataSource = new oj.ArrayTableDataSource(this.allItems, {idAttribute: "id"});
           //     self.addMemberTitle = ko.observable(self.getTranslation("dialog.addMemberTitle"));
                self.firstName = ko.observable("Sung Hye");
                self.lastName = ko.observable("Jeon");
                self.email = ko.observable("sung.hye.jeon@oracle.com");
                self.mobile = ko.observable("010-0000-0000");
                self.url = "QoSMemberService/members";

                this.handleReady = function ()
                {
                    // register swipe to reveal for all new list items
                    $("#listview").find(".item-marker").each(function (index)
                    {
                        var item = $(this);
                        var id = item.prop("id");
                        var startOffcanvas = item.find(".oj-offcanvas-start").first();
                        var endOffcanvas = item.find(".oj-offcanvas-end").first();

                        // setup swipe actions       

                        oj.SwipeToRevealUtils.setupSwipeActions(startOffcanvas);
                        oj.SwipeToRevealUtils.setupSwipeActions(endOffcanvas);

                        // make sure listener only registered once
                        endOffcanvas.off("ojdefaultaction");
                        endOffcanvas.on("ojdefaultaction", function ()
                        {

                            self.handleDefaultAction(item);
                        });
                    });
                };

                this.handleDestroy = function ()
                {
                    // register swipe to reveal for all new list items
                    $("#listview").find(".item-marker").each(function (index)
                    {
                        var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
                        var endOffcanvas = $(this).find(".oj-offcanvas-end").first();

                        oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
                        oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);
                    });
                };

                this.handleMenuBeforeOpen = function (event, ui)
                {

                    var target = event.originalEvent.target;
                    var context = $("#listview").ojListView("getContextByNode", target);
                    if (context != null)
                    {
                        self.currentItem = $("#" + context['key']);
                    } else
                    {
                        self.currentItem = null;
                    }
                };

                this.handleMenuItemSelect = function (event, ui)
                {
                    var id = ui.item.prop("id");
                    if (id == "read")
                        self.handleRead();
                    else if (id == "more1" || id == "more2")
                        self.handleMore();
                    else if (id == "tag")
                        self.handleFlag();
                    else if (id == "delete")
                        self.handleTrash();
                };

                this.closeToolbar = function (which, item)
                {
                    var toolbarId = "#" + which + "_toolbar_" + item.prop("id");
                    var drawer = {"displayMode": "push", "selector": toolbarId};

                    oj.OffcanvasUtils.close(drawer);
                };
                
                self.refreshMembers = function() {
                    mbe.invokeCustomAPI(self.url, "GET", null, function (statusCode, data) {
                        console.log(JSON.stringify(data));
                        console.log((typeof data));
                        self.allItems(data);
                    }, function (error) {

                    });
                }
                self.handleActivated = function (info) {                    
                    self.refreshMembers();
                    
                    
                };

                this.handleAction = function (which, action, event)
                {                  
                    if (event != null)
                    {
                        self.currentItem = $(event.target).closest(".item-marker");
                        // offcanvas won't be open for default action case
                        if (action != "default")
                            self.closeToolbar(which, self.currentItem);
                    }

                    if (self.currentItem != null)
                        self.action("Handle " + action + " action on: " + self.currentItem.prop("id"));
                };


                self.openDialog = function () {
                    
                    $("#addmember").ojDialog("open");
                    $('#addmember').ojDialog("option", "title", 
                    self.getTranslation("dialog.addMemberTitle"));
                };

                self.handleFlag = function (data, event)
                {
                    self.selectedData = data;
                    self.firstName(data.firstName);
                    self.lastName(data.lastName);
                    self.email(data.email);

                    $("#modifymember").ojDialog("open");
                    $('#modifymember').ojDialog("option", "title",self.getTranslation("dialog.modifyMemberTitle"));

                };

                self.handleTrash = function (data, event)
                {
                    self.currentItem = $(event.target).closest(".item-marker");
                    self.selectedData = data;
                    $("#deletemember").ojDialog("open");
                    $('#deletemember').ojDialog("option", "title", self.getTranslation("dialog.deleteMemberTitle"));  

                };

                self.handleSave_delete = function () {
                  var modifiedUrl = self.url + '/' + self.selectedData.id;

                   mbe.invokeCustomAPI(modifiedUrl, "DELETE", '', function (statusCode, data) {
                        self.refreshMembers();
                        
                    }, function (error) {

                    }); 
                    
                    
                    
                    //self.remove(self.currentItem);
                    $("#deletemember").ojDialog("close");

                };
                self.handleSave_modify = function () {
                    
                    var modifiedUrl = self.url + '/' + self.selectedData.id;
                               console.log(modifiedUrl);
             
                    var JSONObj = 
                    {"firstName":self.firstName(), 
                    "lastName":self.lastName(), 
                    "email":self.email() };
                   mbe.invokeCustomAPI(modifiedUrl, "PUT", 
                      JSON.stringify(JSONObj) , function (statusCode, data) {                        
                        self.refreshMembers();
                        
                    }, function (error) {

                    });                    
                                       
                    
                    
                    $("#modifymember").ojDialog("close");

                };
                
                 //var url = "QoSMemberService/members";
                 
                self.handleSave_add = function () {


                   var JSONObj = 
                    {"firstName":self.firstName(), 
                    "lastName":self.lastName(), 
                    "email":self.email() };
                        console.log("!!!!!!" + JSON.stringify(JSONObj));
                   mbe.invokeCustomAPI(self.url, "POST", 
                      JSON.stringify(JSONObj) , function (statusCode, data) {
        
                        
                        self.allItems.push(data);
                    }, function (error) {

                    });                    
                    
                    $("#addmember").ojDialog("close");

                };                

                self.handleClose = function () {
                    $("#addmember").ojDialog("close");
                    $("#modifymember").ojDialog("close");
                    $("#deletemember").ojDialog("close");

                };

                this.handleDefaultAction = function (item)
                {
//                    self.currentItem = item;
//                    
//          
//                    var modifiedUrl = self.url + '/' + self.currentItem.prop("id");
//                    console.log(modifiedUrl);
//
//                   mbe.invokeCustomAPI(modifiedUrl, "DELETE", '', function (statusCode, data) {
//                        self.refreshMembers();
//                        
//                    }, function (error) {
//
//                    }); 
                  //  self.handleAction("second", "default");
                  //  self.remove(item);
                };

                this.remove = function (item)
                {
                    
                    // unregister swipe to reveal for removed item
                    var startOffcanvas = item.find(".oj-offcanvas-start").first();
                    var endOffcanvas = item.find(".oj-offcanvas-end").first();

                    oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
                    oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);

                    self.allItems.remove(function (current)
                    {
                        return (current.id == item.prop("id"));
                    });
                };
            }
            ;

            return new emailModel();
        });
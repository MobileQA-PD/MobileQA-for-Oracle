/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * setting module
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'hammerjs', 'ojs/ojknockout', 
    'ojs/ojjquery-hammer', 'ojs/ojswipetoreveal', 'ojs/ojlistview', 
    'ojs/ojdatacollection-common', 'ojs/ojbutton', 'ojs/ojmenu'],
function(oj, ko, $, Hammer)
{     
   function emailModel()
    {
        var self = this;

        this.allItems = ko.observableArray([{"id": "email_1", "title": "Meeting Invite: Product direction", "from": "Amy Bartlet", "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pharetra, risus ac interdum sollicitudin, sem erat ultrices ipsum."},
                                            {"id": "email_2", "title": "Re: Latest market analysis from XYZ", "from": "Nina Evans", "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pharetra, risus ac interdum sollicitudin, sem erat ultrices ipsum"}, 
                                            {"id": "email_3", "title": "Feedback from architecture review", "from": "James Marlow", "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pharetra, risus ac interdum sollicitudin, sem erat ultrices ipsum"}
                                           ]);
        this.dataSource = new oj.ArrayTableDataSource(this.allItems, {idAttribute: "id"});

        this.action = ko.observable("No action taken yet");

        this.handleReady = function()
        {
            // register swipe to reveal for all new list items
            $("#listview").find(".item-marker").each(function(index)
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
                endOffcanvas.on("ojdefaultaction", function() 
                {
                    self.handleDefaultAction(item);
                });
            });
        };

        this.handleDestroy = function()
        {
            // register swipe to reveal for all new list items
            $("#listview").find(".item-marker").each(function(index)
            {
                var startOffcanvas = $(this).find(".oj-offcanvas-start").first();                    
                var endOffcanvas = $(this).find(".oj-offcanvas-end").first();                    

                oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
                oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);
            });
        };

        this.handleMenuBeforeOpen = function(event, ui)
        {
            var target = event.originalEvent.target;
            var context = $("#listview").ojListView("getContextByNode", target);
            if (context != null)
            {
                self.currentItem = $("#"+context['key']);
            }
            else
            {
                self.currentItem = null;
            }
        };

        this.handleMenuItemSelect = function(event, ui)
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

        this.closeToolbar = function(which, item)
        {
            var toolbarId = "#"+which+"_toolbar_"+item.prop("id");
            var drawer = {"displayMode": "push", "selector": toolbarId};

            oj.OffcanvasUtils.close(drawer);
        };

        this.handleAction = function(which, action, event)
        {
            if (event != null)
            {
                self.currentItem = $(event.target).closest(".item-marker");

                // offcanvas won't be open for default action case
                if (action != "default")
                    self.closeToolbar(which, self.currentItem);
            }

            if (self.currentItem != null)
                self.action("Handle "+action+" action on: "+self.currentItem.prop("id"));
        };

        this.handleRead = function(data, event)
        {
            self.handleAction("first", "read", event);
        };

        this.handleMore = function(data, event)
        {
            self.handleAction("second", "more", event);
        };

        this.handleFlag = function(data, event)
        {
            self.handleAction("second", "flag", event);
        };

        this.handleTrash = function(data, event)
        {
            self.handleAction("second", "trash", event);
            self.remove(self.currentItem);
        };

        this.handleDefaultAction = function(item)
        {
            self.currentItem = item;
            self.handleAction("second", "default");
            self.remove(item);
        };

        this.remove = function(item)
        {
            // unregister swipe to reveal for removed item
            var startOffcanvas = item.find(".oj-offcanvas-start").first();                    
            var endOffcanvas = item.find(".oj-offcanvas-end").first();                    

            oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
            oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);

            self.allItems.remove(function(current)
            {
                return (current.id == item.prop("id"));
            });            
        };
    };

    return new emailModel();
});
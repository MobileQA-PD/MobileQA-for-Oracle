/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojpagingtabledatasource"],function(a){a.oh=function(a,c){this.OA=a;this.gs=c};o_("PagingHeaderSet",a.oh,a);a.oh.prototype.getData=function(a,c){return this.OA.getData(a+this.gs,c)};a.f.j("PagingHeaderSet.prototype.getData",{getData:a.oh.prototype.getData});a.oh.prototype.getMetadata=function(a,c){return this.OA.getMetadata(a+this.gs,c)};a.f.j("PagingHeaderSet.prototype.getMetadata",{getMetadata:a.oh.prototype.getMetadata});a.oh.prototype.getCount=function(){return this.OA.getCount()};
a.f.j("PagingHeaderSet.prototype.getCount",{getCount:a.oh.prototype.getCount});a.oh.prototype.getLevelCount=function(){return this.OA.getLevelCount()};a.f.j("PagingHeaderSet.prototype.getLevelCount",{getLevelCount:a.oh.prototype.getLevelCount});a.oh.prototype.getExtent=function(a,c){return this.OA.getExtent(a+this.gs,c)};a.f.j("PagingHeaderSet.prototype.getExtent",{getExtent:a.oh.prototype.getExtent});a.oh.prototype.getDepth=function(a,c){return this.OA.getDepth(a+this.gs,c)};a.f.j("PagingHeaderSet.prototype.getDepth",
{getDepth:a.oh.prototype.getDepth});a.oh.prototype.vsa=function(){return this.OA};a.f.j("PagingHeaderSet.prototype.getHeaderSet",{vsa:a.oh.prototype.vsa});a.oh.prototype.kL=function(){return this.gs};a.f.j("PagingHeaderSet.prototype.getStartIndex",{kL:a.oh.prototype.kL});a.Kb=function(g){if(!(g instanceof a.Lu))throw new a.ua("Not a datagridatasource","Not a datagridatasource",a.ua.sd.ERROR);this.ge=g;this.Ca=0;this.Init()};o_("PagingDataGridDataSource",a.Kb,a);a.f.ya(a.Kb,a.Lu,"oj.PagingDataGridDataSource");
a.Kb.prototype.Init=function(){a.Kb.O.Init.call(this);this.QJ()};a.f.j("PagingDataGridDataSource.prototype.Init",{Init:a.Kb.prototype.Init});a.Kb.prototype.QJ=function(){this.ge.on("change",this.WKa.bind(this))};a.Kb.prototype.getPage=function(){return this.Xe};a.f.j("PagingDataGridDataSource.prototype.getPage",{getPage:a.Kb.prototype.getPage});a.Kb.prototype.setPage=function(g,c){c=c||{};g=parseInt(g,10);try{a.Kb.O.handleEvent.call(this,a.Kd.fa.BEFOREPAGE,{page:g,previousPage:this.Xe})}catch(b){return Promise.reject(null)}this.Lb=
null!=c.pageSize?c.pageSize:this.Lb;c.startIndex=g*this.Lb;var d=this.Xe;this.Xe=g;this.Ca=c.startIndex;var e=this;return new Promise(function(a,b){e.Zh(c).then(function(){a(null)},function(){e.Xe=d;e.Ca=e.Xe*e.Lb;b(null)})})};a.f.j("PagingDataGridDataSource.prototype.setPage",{setPage:a.Kb.prototype.setPage});a.Kb.prototype.Zh=function(a){this.Bt=!0;this.Ca=a.startIndex;var c=this;return new Promise(function(a){c.handleEvent("change",{operation:"sync",pageSize:c.Lb});a(void 0)})};a.Kb.prototype.fetch=
function(a){this.Lb=a.pageSize+a.startIndex;a.startIndex=0;return this.Zh(a)};a.f.j("PagingDataGridDataSource.prototype.fetch",{fetch:a.Kb.prototype.fetch});a.Kb.prototype.getStartItemIndex=function(){return this.Ca};a.f.j("PagingDataGridDataSource.prototype.getStartItemIndex",{getStartItemIndex:a.Kb.prototype.getStartItemIndex});a.Kb.prototype.getEndItemIndex=function(){return this.Mm};a.f.j("PagingDataGridDataSource.prototype.getEndItemIndex",{getEndItemIndex:a.Kb.prototype.getEndItemIndex});a.Kb.prototype.getPageCount=
function(){var a=this.totalSize();return-1==a?-1:Math.ceil(a/this.Lb)};a.f.j("PagingDataGridDataSource.prototype.getPageCount",{getPageCount:a.Kb.prototype.getPageCount});a.Kb.prototype.WKa=function(g){switch(g.operation){case "refresh":this.Xe=this.Ca=0;this.handleEvent("change",{operation:"sync",pageSize:this.Lb});this.handleEvent(a.Qa.fa.REFRESH,null);break;case "reset":this.handleEvent(a.Qa.fa.RESET,null);break;case "insert":this.handleEvent(a.Qa.fa.ADD,{index:g.indexes.row});break;case "delete":this.handleEvent(a.Qa.fa.REMOVE,
null);break;case "update":g.indexes.row=0<=g.indexes.row-this.Ca?g.indexes.row-this.Ca:-1;this.handleEvent("change",g);break;default:this.handleEvent("change",g),this.handleEvent(a.Qa.fa.SYNC,null)}};a.Kb.prototype.getCount=function(a){var c=this.ge.getCount(a);return"row"===a&&0<=c?this.Ca+this.Lb<c?this.Lb:c-this.Ca:c};a.f.j("PagingDataGridDataSource.prototype.getCount",{getCount:a.Kb.prototype.getCount});a.Kb.prototype.getCountPrecision=function(a){return this.ge.getCountPrecision(a)};a.f.j("PagingDataGridDataSource.prototype.getCountPrecision",
{getCountPrecision:a.Kb.prototype.getCountPrecision});a.Kb.prototype.fetchHeaders=function(a,c,b){null==this.Bt?null!=c&&c.success&&c.success.call(b.success,null,a,null):"row"===a.axis?(a.start+=this.Ca,a.start+a.count>this.Ca+this.Lb&&(a.count=this.Lb-a.start),this.Hz={headerRange:a,callbacks:c,callbackObjects:b},this.ge.fetchHeaders(a,{success:this.R1.bind(this),error:this.yMa.bind(this)},b)):this.ge.fetchHeaders(a,c,b)};a.f.j("PagingDataGridDataSource.prototype.fetchHeaders",{fetchHeaders:a.Kb.prototype.fetchHeaders});
a.Kb.prototype.R1=function(g,c,b){var d,e;this.Hz.headerRange==c&&(c.start-=this.Ca,c.count+=1,null!=g&&(d=new a.oh(g,this.Ca)),null!=b&&(e=new a.oh(b,this.Ca)),g=this.Hz.callbacks.success,b=this.Hz.callbackObjects.success,this.Hz=null,g.call(b,d,c,e))};a.Kb.prototype.yMa=function(a){var c,b;c=this.Hz.callbacks.error;b=this.Hz.callbackObjects.error;this.Hz=null;c.call(b,a)};a.Kb.prototype.fetchCells=function(a,c,b){var d;if(null==this.Bt)d={getData:function(){return null},getMetaData:function(){return null},
getStart:function(){return 0},getCount:function(){return 0},getLevelCount:function(){return 0},getExtent:function(){return 0},getDepth:function(){return 1}},null!=c&&c.success&&c.success.call(b.success,d,a);else{for(d=0;d<a.length;d+=1)"row"===a[d].axis&&(a[d].start+=this.Ca,a[d].start+a[d].count>this.Ca+this.Lb&&(a[d].count=this.Lb-a[d].start));this.Gz={cellRanges:a,callbacks:c,callbackObjects:b};this.ge.fetchCells(a,{success:this.VKa.bind(this),error:this.UKa.bind(this)},b)}};a.f.j("PagingDataGridDataSource.prototype.fetchCells",
{fetchCells:a.Kb.prototype.fetchCells});a.Kb.prototype.VKa=function(g,c){var b,d,e;if(!this.Gz.cellRanges!=c){for(b=0;b<c.length;b+=1)"row"===c[b].axis&&(c[b].start-=this.Ca,c[b].count+=1);b=new a.hl(g,this.Ca);d=this.Gz.callbacks.success;e=this.Gz.callbackObjects.success;this.Gz=null;this.Mm=this.Ca+g.getCount("row")-1;this.handleEvent("sync",{data:Array(g.getCount("row")),startIndex:this.Ca});d.call(e,b,c)}};a.Kb.prototype.UKa=function(a){var c,b;c=this.Gz.callbacks.error;b=this.Gz.callbackObjects.error;
this.Gz=null;c.call(b,a)};a.Kb.prototype.keys=function(a){return this.ge.keys({column:a.column,row:a.row+this.Ca})};a.f.j("PagingDataGridDataSource.prototype.keys",{keys:a.Kb.prototype.keys});a.Kb.prototype.indexes=function(a){a=this.ge.indexes(a);-1!=a.row&&(a.row-=this.Ca);return a};a.f.j("PagingDataGridDataSource.prototype.indexes",{indexes:a.Kb.prototype.indexes});a.Kb.prototype.getCapability=function(a){return this.ge.getCapability(a)};a.f.j("PagingDataGridDataSource.prototype.getCapability",
{getCapability:a.Kb.prototype.getCapability});a.Kb.prototype.size=function(){var a;if(null==this.Bt)return-1;a=this.ge.getCount("row");return this.ge.getCount("row")>this.Lb?this.Lb:a};a.f.j("PagingDataGridDataSource.prototype.size",{size:a.Kb.prototype.size});a.Kb.prototype.sort=function(a,c,b){this.ge.sort(a,c,b)};a.f.j("PagingDataGridDataSource.prototype.sort",{sort:a.Kb.prototype.sort});a.Kb.prototype.totalSize=function(){return null==this.Bt?-1:this.ge.getCount("row")};a.f.j("PagingDataGridDataSource.prototype.totalSize",
{totalSize:a.Kb.prototype.totalSize});a.Kb.prototype.totalSizeConfidence=function(){return"actual"};a.f.j("PagingDataGridDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.Kb.prototype.totalSizeConfidence});a.Kb.prototype.moveOK=function(a,c,b){return this.ge.moveOK(a,c,b)};a.f.j("PagingDataGridDataSource.prototype.moveOK",{moveOK:a.Kb.prototype.moveOK});a.Kb.prototype.move=function(a,c,b,d,e){this.ge.move(a,c,b,d,e)};a.f.j("PagingDataGridDataSource.prototype.move",{move:a.Kb.prototype.move});
a.hl=function(a,c){this.AL=a;this.gs=c};o_("PagingCellSet",a.hl,a);a.hl.prototype.getData=function(a){return this.AL.getData({column:a.column,row:a.row+this.gs})};a.f.j("PagingCellSet.prototype.getData",{getData:a.hl.prototype.getData});a.hl.prototype.getMetadata=function(a){return this.AL.getMetadata({column:a.column,row:a.row+this.gs})};a.f.j("PagingCellSet.prototype.getMetadata",{getMetadata:a.hl.prototype.getMetadata});a.hl.prototype.getCount=function(a){return this.AL.getCount(a)};a.f.j("PagingCellSet.prototype.getCount",
{getCount:a.hl.prototype.getCount});a.hl.prototype.gsa=function(){return this.AL};a.f.j("PagingCellSet.prototype.getCellSet",{gsa:a.hl.prototype.gsa});a.hl.prototype.kL=function(){return this.gs};a.f.j("PagingCellSet.prototype.getStartIndex",{kL:a.hl.prototype.kL});a.hl.prototype.getExtent=function(a){return this.AL.getExtent({column:a.column,row:a.row+this.gs})};a.f.j("PagingCellSet.prototype.getExtent",{getExtent:a.hl.prototype.getExtent})});
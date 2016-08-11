// var createViewModel = require("./main-view-model").createViewModel;
var app = require("application");
var platform = require("platform");

var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var http = require("http");
var frameModule = require("ui/frame");

var pageNo = 1;
function getUrl(num) {
    return "http://3g.163.com/touch/reconstruct/article/list/BA8D4A3Rwangning/"+parseInt(num)*10+"-10.html";
}

function onPageLoaded(args) {
    console.log("============onPageLoaded");
    // var View = android.view.View;
    // if (app.android && platform.device.sdkVersion >= '21') {
    //     var window = app.android.startActivity.getWindow();
    //     var decorView = window.getDecorView();
    //     decorView.setSystemUiVisibility(
    //         View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    //         | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
    //         | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    //         | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
    //         // | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
    //         | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
    //         );
    // }
    var groceryList;
    var page = args.object;
    http.getJSON(getUrl(0)).then(function (r) {
        var realArray = [];
        // r.BA8D4A3Rwangning.shift();
        // r.BA8D4A3Rwangning.splice(6, 1);
        r.BA8D4A3Rwangning.forEach(function(item) {
            if(item.imgsrc3gtype=="1" && item.skipType!="special" && item.digest!=""){
                realArray.push(item);
            }
        });
        groceryList = new ObservableArray(realArray);
        page.bindingContext = new Observable({
            groceryList: groceryList,
            onPullToRefreshInitiated: onPullToRefreshInitiated,
            onLoadMoreItemsRequested: onLoadMoreItemsRequested,
            onItemSelected: onItemSelected
        });
    });
}

function onPullToRefreshInitiated(args) {
    // args.object.notifyPullToRefreshFinished();
    console.log("===========onPullToRefreshInitiated");
    http.getJSON(getUrl(0)).then(function (r) {
        var listView = args.object;
        var firstDocid = listView.items.getItem(0).docid;
        console.log(listView.items.length);
        var newData = [];
        for(var i=0; i<r.BA8D4A3Rwangning.length; i++){
            var item = r.BA8D4A3Rwangning[i];
            if(item.imgsrc3gtype=="1" && item.skipType!="special" && item.digest!=""){
                if(firstDocid != item.docid){
                    newData.push(item);
                }else{
                    break;
                }
            }
        }
        newData.reverse();
        newData.forEach(function(item) {
            listView.items.unshift(item);
        });
        console.log(listView.items.length);
        args.object.notifyPullToRefreshFinished();
    });
}

function onLoadMoreItemsRequested(args) {
    console.log("===========onLoadMoreItemsRequested");
    var listView = args.object;
    http.getJSON(getUrl(pageNo++)).then(function (r) {
        r.BA8D4A3Rwangning.forEach(function(item) {
            if(item.imgsrc3gtype=="1" && item.skipType!="special" && item.digest!=""){
                listView.items.push(item);
            }
        });
        listView.notifyLoadOnDemandFinished();
    });
}

function onItemSelected(args) {
    console.log("=========onItemSelected");
    
    var navigationEntry = {
        moduleName: "views/detail/detail",
        context: { items: args.object.getSelectedItems() },
        animated: false
    };
    var topmost = frameModule.topmost();
    topmost.navigate(navigationEntry);
}

exports.onPageLoaded = onPageLoaded;
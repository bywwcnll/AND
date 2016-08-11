var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var http = require("http");

function createViewModel() {
    http.getJSON("http://3g.163.com/touch/reconstruct/article/list/BA8D4A3Rwangning/0-10.html").then(function (r) {
        return new Observable({
            groceryList: new ObservableArray(r.BA8D4A3Rwangning)
        });
    }, function (e) {
        // console.log(e);
        return new Observable({
            groceryList: new ObservableArray([
                {
                    imgsrc: "~/images/18.png",
                    title: "雅虎48亿美元卖身Verizon 品牌将得到保留",
                    digest: "网易科技讯7月25日消息，据美国媒体报道，消息人士称，Verizon通信同意支付48亿美元收购雅虎，结束了这家处于困境中的互联网公司久拖不决的拍卖过程。此次收购包括了雅虎的核心互联网业务和部分房地产。"
                },
                {
                    imgsrc: "~/images/27.png",
                    title: "雅虎将保留阿里和雅虎日本股份:市值约400亿美元",
                    digest: "雅虎，这个曾经的互联网巨头如今落魄不已，正以出售核心资产的方式黯然告别自己最辉煌的时代。"
                }
            ])
        });
    });

}

exports.createViewModel = createViewModel;
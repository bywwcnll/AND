var http = require("http");
var Observable = require("data/observable").Observable;

exports.onNavigatingTo = function(args) {
    var page = args.object;
    var docid = page.navigationContext.items[0].docid;
    var url = "http://3g.163.com/touch/article/"+docid+"/full.html";
    console.log(url);

    // var wvid = page.getViewById("wvid");


    http.getJSON(url).then(function (r) {
        var j = r[docid];
        j.img.forEach(function(item) {
            j.body = j.body.replace(item.ref, "<img src='"+item.src+"' >");
        });
        j.body = "<html><head><meta charset='UTF-8'><meta name='viewport' content='initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'><style>img{width: 100% !important; margin: 10 0;}</style></head><body>"+j.body+"</body></html>";
        page.bindingContext = new Observable({
            title: j.title,
            ptimeAsource: j.ptime+"    "+j.source,
            body: j.body
        });
    });
}
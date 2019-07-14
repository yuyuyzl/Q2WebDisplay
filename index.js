var config={
    "BLDFAutoStart": true,
    "BLDFIntervalDelay": 2000,
    "BLDFNeedSubBody": true,
    "BLDFRegex": "(?<=[“【]).*(?=[】”])",
    "BLDFShowDanmaku": false,
    "BLDFShowMatchedDanmakuText": true,
    "BLDFShowOtherDanmaku": false,
    "BLTFUrlPrefix": "https://api.vtb.wiki/webapi/message/",
    "BLTFUrlId":"759280052",
    "BLTFUrlSuffix": "/history?filter=%E3%80%90&text=true&client=Fly_snow",
    "UpdateTime": "NAN",
    "BLTFDoMatch": true
}


$(function () {
    var BLDFReg = new RegExp(config.BLDFRegex);
    setInterval(function () {
        $.ajax({
            method: "GET",
            url: config.BLTFUrlPrefix+config.BLTFUrlId+config.BLTFUrlSuffix+"&t="+(Date.parse(new Date())),
            success: function(data) {
                var tsget=[];
                tsget=data.trim().split("\n");
                for(var i=0;i<tsget.length;i++){
                    var ss="";
                    while(ss!=tsget[i]){
                        ss=tsget[i];
                        tsget[i]=tsget[i].replace(/<.*>/g,"");
                    }
                    if((config.BLTFDoMatch))tsget[i]=tsget[i].match(BLDFReg);
                }
                var tsexist=[]
                $(".SubtitleTextBody p").each(function(i,obj){
                    if($(obj).attr("style")==null || $(obj).attr("style")=="")tsexist.push($(obj).text());
                });
                var pget=tsget.length-1;
                var pexist=0;
                while(pget>=0&&tsget[pget]!=tsexist[pexist])pget--;
                for(var i=pget+1;i<tsget.length;i++){
                    $('.SubtitleTextBody').prepend("<p class='new'>" + tsget[i] + "</p>");
                    setTimeout(function () {
                        $('.new').removeClass('new');
                    },1);
                }
                console.log(tsget);console.log(tsexist);

            }
        })
    },config.BLDFIntervalDelay);
});
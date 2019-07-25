var config={
    "BLDFIntervalDelay": 2000,
    "BLDFRegex": "(?<=[“【]).*(?=[】”])",
    "BLDFIgnore": "[【】]",
    "BLTFUrlPrefix": "https://api.vtb.wiki/webapi/message/",
    "BLTFUrlId":"759280052",
    "BLTFUrlSuffix": "/history?filter=%E3%80%90&text=true&client=Fly_snow",
}


$(function () {
    var lock=false;
    setInterval(function () {
        var BLDFReg = new RegExp(config.BLDFRegex);
        var BLDFIgnore = new RegExp(config.BLDFIgnore);
        lock=true;
        $.ajax({
            method: "GET",
            cache:false,
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
                    var matchls=tsget[i].match(BLDFReg);
                    if(matchls!=null)
                    for(var j=0;j<matchls.length;j++){
                        tsget[i]=tsget[i].replace(matchls[j],"<span class=\"translation\">"+matchls[j]+"</span>")
                    }
                    ss="";
                    while(ss!=tsget[i]){
                        ss=tsget[i];
                        tsget[i]=tsget[i].replace(BLDFIgnore,"");
                    }

                }
                var tsexist=[]
                $(".SubtitleTextBody p").each(function(i,obj){
                    if($(obj).attr("style")==null || $(obj).attr("style")=="")tsexist.push($(obj).html());
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


            },
            complete:function () {
                lock=false;
            }
        })
    },config.BLDFIntervalDelay);
});
var config = {
    "BLDFIntervalDelay": 3000,
    "BLDFRegex": "【(.+?)】",

    "CJId": "test",
    "CJUrlPrefix": "https://api.vtb.wiki/q2w"
};

var lastTime = '0';

$(function () {
    var lock = false;
    var BLDFReg = new RegExp(config.BLDFRegex, 'g');
    function update() {
        if (lock) return;
        lock = true;
        $.ajax({
            method: "GET",
            cache: true,
            url: config.CJUrlPrefix + "?"+"t="+(new Date().getTime())+"&"+"args=" + config.CJId + '|' + lastTime,

            success: function (data) {
                var tsget = data.trim().split("\n");
                lastTime = tsget[0];
                tsget.shift();
                tsget.slice().reverse().forEach(function (line, index) {
                    var lineProc = line.replace(/<.*>/g, "");
                    lineProc = filterXSS(lineProc);
                    var matches = lineProc.match(BLDFReg);
                    if (matches != null)
                        matches.forEach(function (match) {
                            lineProc = lineProc.replace(match, "<span class=\"translation\">" + match.replace("【", "").replace("】", "") + "</span>");
                        });

                    $('.SubtitleTextBody').prepend("<p class='new'>" + lineProc + "</p>");
                    setTimeout(function () {
                        $('.new').removeClass('new');
                    }, 1);
                })
            }, complete: function () {
                lock = false;
            }
        })
    }

    update();
    setInterval(function () {
        update();
    }, config.BLDFIntervalDelay);
});

var urls = "";
var down_ok_count = 0;
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        urls = repetition_filter(request.source)
    }
});

// request permission on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function onWindowLoad() {

    notify("欢迎使用网页图片下载工具");

    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });

}

window.onload = onWindowLoad;

(function(){


    

})(window);


$(function() {

    $("#downImg").click(function() {
        if(urls.length == 0){
            notify("(10KB 以上的图片)数量为0 ")
            return;
        }
        downLoad(urls, function(res) {
            notify("【"+down_ok_count+"】张图片保存成功 (10KB 以上的图片)")
        });
    });


    function downLoad(url_arr, callback) {
        url_arr = url_arr || [];
        var i = 0;
        var loop = function(i) {
            
            size_filter(url_arr[i],function(res){
                if(res === true){
                    chrome.downloads.download({
                        url: url_arr[i]
                    }, function(res) {
                        down_ok_count ++;
                        _continue();
                    });
                }else if(res === false){
                    _continue();
                }

                function _continue(){
                    if (i != url_arr.length - 1) {
                        i++;
                        loop(i);
                    } else {
                        if (typeof callback === "function") callback();
                    }
                }
                
            })
            

        }
        return loop(i);
    }
})

// 过滤....10KB 以上的图片
function size_filter(src,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", src, true);
    xhr.timeout = 5000;
    xhr.responseType = "arraybuffer";
    xhr.ontimeout = function (e) {
        // XMLHttpRequest timed out. Do something here.
        if (typeof callback === "function"){
            callback(false);
        }
    };

    xhr.onreadystatechange = function() {
        if(this.readyState == this.DONE) {
            if (typeof callback === "function"){
                if(this.response === null){
                    callback(false);
                    return;
                }
                if(this.response.byteLength > 10 * 1024){
                    callback(true);
                }else{
                    callback(false);
                }
            };
            // alert("Image size = " + this.response.byteLength + " bytes.");
        }
    };
    xhr.send(null);
}


// 过滤...去重
function repetition_filter(url_arr){
    url_arr = url_arr || [];
    var result = [];
    url_arr.forEach(function(item,index){
        if(result.indexOf(item) == -1){
            result.push(item);
        }
    });
    return result;
}



function notify(msg) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('消息提示', {
            icon: 'mint-leaf-icon.png',
            body: msg,
        });
        setTimeout(notification.close.bind(notification), 5000);
        notification.onclick = function() {
            
        };

    }

}
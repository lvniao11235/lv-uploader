; (function ($, window, document) {
    function uploaderId() {
        var id = 1;
        return function () {
            return id++;
        }
    }
    if (!window.hasOwnProperty("uploadercurrentid")) {
        window.uploadercurrentid = uploaderId();
    }
    $.fn.lvuploader = function (opt) {
        var id = window.uploadercurrentid();
        var argument = {
            url: '',
            progress: function (value) { },
            start: function () { },
            ctlFileId: "fileUploader" + id,
            ctlBtnId: "btnUploader" + id,

        }
        var uploader = new Uploader(this, opt);
        if (opt) {
            uploader.option = $.extend(argument, opt);
        } else {
            uploader.option = argument;
        }
        uploader.render();
    };
    var Uploader = function (target, option) {
        this.target = target;
        this.option = option;
    };
    Uploader.prototype = {
        constructor: Uploader,
        render: function () {
            this.target.append(this.format('<input id="{0}" type="file">', this.option.ctlFileId));
            this.target.append(this.format('<button id="{0}">upload</button>', this.option.ctlBtnId));
        },
        format: function () {
            if (arguments.length > 0) {
                var pattern = arguments[0];
                for (var i = 1; i < arguments.length; i++) {
                    var index = '{' + (i-1) + '}';
                    if(pattern.indexOf(index) != -1){
                        pattern = pattern.replace(index, arguments[i]);
                    } else {
                        break;
                    }
                }
                return pattern;
            }
            return "";
        }
    }
})(jQuery, window, document);
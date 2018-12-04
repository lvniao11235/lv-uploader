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
            block: 1024 * 1024,
            start: 0,
            file: null,
            guid: null,
            progressValue: 0,
            progress: function (value) { },
            ctlFileId: "fileUploader" + id,
            ctlBtnId: "btnUploader" + id
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
            var self = this;
            self.target.append(self.format('<input id="{0}" type="file">', self.option.ctlFileId));
            self.target.append(self.format('<button id="{0}">upload</button>', self.option.ctlBtnId));
            $("#" + self.option.ctlBtnId).click(function () {
                self.option.file = $("#" + self.option.ctlFileId)[0].files[0];
                self.start();
            });
        },
        format: function () {
            if (arguments.length > 0) {
                var pattern = arguments[0];
                for (var i = 1; i < arguments.length; i++) {
                    var index = '{' + (i - 1) + '}';
                    if (pattern.indexOf(index) != -1) {
                        pattern = pattern.replace(index, arguments[i]);
                    } else {
                        break;
                    }
                }
                return pattern;
            }
            return "";
        },
        start: function () {
            var self = this;
            $.ajax({
                url: self.option.url,
                type: 'post',
                dataType: 'json',
                data: { start: true }
            }).done(function (data) {
                self.option.guid = data.guid;
                self.upload();
            });
        },
        end: function(){
            var self = this;
            $.ajax({
                url: self.option.url,
                type: 'post',
                dataType: 'json',
                data: { end: true }
            }).done(function (data) {
                self.option.guid = data.guid;
                self.upload();
            });
        },
        upload: function () {
            var self = this;
            if (self.option.start * self.option.block > self.option.file.size) {
                self.end();
            }
            var end = Math.min((self.option.start + 1) * self.option.block, self.option.file.size);
            var filedata = self.option.file.slice(self.option.start * self.option.block, end);
            var data = new FormData();
            data.append("file", filedata);
            data.append("filename", self.option.file.name);
            data.append("guid", self.option.guid);
            $.ajax({
                url: self.option.url,
                type: 'post',
                data: data,
                processData: false,
                contentType: false,
                dataType: "json"
            }).done(function (data) {
                self.option.start++;
                self.upload();
            });
        }
    };
})(jQuery, window, document);
define(function(module, exports, require) {
    exports._csrfSafeMethod=function(method) {
        var self = this;
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };

    exports._getCookie=function(name) {
        var self = this;
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };
});

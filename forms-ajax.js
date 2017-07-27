 +function ($) {
    $.serializeObject = $.param = function (obj, parents) {
        if (typeof obj === 'string') return obj;
        var resultArray = [];
        var separator = '&';
        parents = parents || [];
        var newParents;
        function var_name(name) {
            if (parents.length > 0) {
                var _parents = '';
                for (var j = 0; j < parents.length; j++) {
                    if (j === 0) _parents += parents[j];
                    else _parents += '[' + encodeURIComponent(parents[j]) + ']';
                }
                return _parents + '[' + encodeURIComponent(name) + ']';
            }
            else {
                return encodeURIComponent(name);
            }
        }
        function var_value(value) {
            return encodeURIComponent(value);
        }
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                var toPush;
                if ($.isArray(obj[prop])) {
                    toPush = [];
                    for (var i = 0; i < obj[prop].length; i ++) {
                        if (!$.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
                            newParents = parents.slice();
                            newParents.push(prop);
                            newParents.push(i + '');
                            toPush.push($.serializeObject(obj[prop][i], newParents));
                        }
                        else {
                            toPush.push(var_name(prop) + '[]=' + var_value(obj[prop][i]));
                        }
                        
                    }
                    if (toPush.length > 0) resultArray.push(toPush.join(separator));
                }
                else if (typeof obj[prop] === 'object') {
                    // Object, convert to named array
                    newParents = parents.slice();
                    newParents.push(prop);
                    toPush = $.serializeObject(obj[prop], newParents);
                    if (toPush !== '') resultArray.push(toPush);
                }
                else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
                    // Should be string or plain value
                    resultArray.push(var_name(prop) + '=' + var_value(obj[prop]));
                }
            }
        }
        return resultArray.join(separator);
    };
    /*===============================================================================
    ************   Ajax submit for forms   ************
    ===============================================================================*/
    // Ajax submit on forms
    $(document).on('submit change', 'form.ajax-submit, form.ajax-submit-onchange', function (e) {
        var form = $(this);
        if (e.type === 'change' && !form.hasClass('ajax-submit-onchange')) return;
        if (e.type === 'submit') e.preventDefault();
        
        var method = form.attr('method') || 'GET';
        var contentType = form.prop('enctype') || form.attr('enctype');
        $.alert(method);

        var url = form.attr('action');
        if (!url) return;

        var data;
        if (method === 'POST') data = new FormData(form[0]);
        else data = $.serializeObject($.formToJSON(form[0]));

        var xhr = $.ajax({
            method: method,
            url: url,
            contentType: contentType,
            data: data,
            beforeSend: function (xhr) {
                form.trigger('beforeSubmit', {data:data, xhr: xhr});
            },
            error: function (xhr) {
                form.trigger('submitError', {data:data, xhr: xhr});  
            },
            success: function (data) {
                form.trigger('submitted', {data: data, xhr: xhr});
            }
        });
    });
}(jQuery);

define(function (require, exports, module) {
    exports.init = function (form) {
        form = $(form);
        if (form.length !== 1) return false;

        // Form data
        var formData = {};

        // Skip input types
        var skipTypes = ['submit', 'image', 'button', 'file'];
        var skipNames = [];
        form.find('input, select, textarea').each(function () {
            var input = $(this);
            var name = input.attr('name');
            var type = input.attr('type');
            var tag = this.nodeName.toLowerCase();
            if (skipTypes.indexOf(type) >= 0) return;
            if (skipNames.indexOf(name) >= 0 || !name) return;
            if (tag === 'select' && input.prop('multiple')) {
                skipNames.push(name);
                formData[name] = [];
                form.find('select[name="' + name + '"] option').each(function () {
                    if (this.selected) formData[name].push(this.value);
                });
            } else {
                switch (type) {
                    case 'checkbox':
                        skipNames.push(name);
                        formData[name] = [];
                        form.find('input[name="' + name + '"]').each(function () {
                            if (this.checked) formData[name].push(this.value);
                        });
                        break;
                    case 'radio':
                        skipNames.push(name);
                        form.find('input[name="' + name + '"]').each(function () {
                            if (this.checked) formData[name] = this.value;
                        });
                        break;
                    default:
                        formData[name] = $.trim(input.val());
                        break;
                }
            }

        });
        form.trigger('formToJSON', {formData: formData});

        return formData;
    }
});
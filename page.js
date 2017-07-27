define(function (require, exports, module) {
    require('./jquery.paging.min');
    exports.init=function (query) {
        var maxentries=query.maxentries || 100;//数据总条数
        var page=query.page;

         query.obj.paging(maxentries, {
            page:page,
            format: '[<  nnnnnnnnnn >]',
            onSelect: function (page) {
                // add code which gets executed when user selects a page
                $('#pagination').find('a[data-page='+ page +']').parents('li').addClass('am-active');
                query.cb({
                    curPage:page
                });
            },
            onFormat: function (type) {
                switch (type) {
                case 'block': // n and c
                    return '<li class="">\
                      <a href="#" class="">'+ this.value +'</a></li>';
                case 'next': // >
                    return '<li class="am-pagination-prev ">\
                        <a href="#" class="">下一页</a>\
                      </li>';
                case 'prev': // <
                    return '<li class="am-pagination-prev ">\
                        <a href="#" class="">上一页</a>\
                      </li>';
                case 'first': // [
                    return '<li class="am-pagination-first ">\
                        <a href="#" class="">第一页</a>\
                      </li>';
                case 'last': // ]
                    return '<li class="am-pagination-last ">\
                        <a href="#" class="">最末页</a>\
                      </li>';
                }
            }
        });
    }
});
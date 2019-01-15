var common = {
    Init: function () {
        common.RegisterEvent();
    },
    RegisterEvent: function () {
        $('.btn-search').on('click').off('click', function () {
            var value = $('#search_param').val();
            var selectlist = $('#selectList').val();
            $.ajax({
                url: '/Home/SearchView',
                dataType: 'json',
                data: {
                    option: selectlist,
                    search: value
                },
                type: 'post',
                success: function (res) {
                    var data = res.data;
                }

            })
        });
        $("#search_param").autocomplete({
            minLength: 0,
            source: function (request, response) {
                $.ajax({
                    url: "/Home/SearchEngine",
                    dataType: "json",
                    data: {
                        option: $('#selectList').val(),
                        search: request.term
                    },
                    success: function (res) {
                        response(res.data);
                    }
                });
            },
            focus: function (event, ui) {
                $("#search_param").val(ui.item.label);
                return false;
            },
            select: function (event, ui) {
                $("#search_param").val(ui.item.label);
                return false;
            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<a>" + item.label + "</a>")
                .appendTo(ul);
        };
    },
 
    parseDate: function (datetime) {
        var temp_result = moment.utc(datetime, "x").toISOString();
        moment.locale('vi');
        var result = moment(temp_result).format('LL');
        return result;

    }
}
common.Init();
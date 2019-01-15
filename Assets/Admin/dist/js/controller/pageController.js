var config = {
    pageSize: 20,
    pageIndex: 1
}

var pageController = {
    init: function () {
        pageController.loadData();
        pageController.registerEvent();
        //pageController.getType();
    },
    registerEvent: function () {

        $('#searchStr').off('click').on('click', function () {
            pageController.loadData(true);
        });
        $('#txtSearch').change(function () {
            pageController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            $('#txtSelectlist').val('');
            pageController.loadData(true);
        });
        $('#txtName').change(function () {
            var input = $('#txtName').val();
            var seoTitle = commonController.getSeoTitle(input);
            $('#txtSeoTitle').val(seoTitle);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có muốn xóa tin này không?", function (result) {
                if (result) {
                    pageController.delete(id);
                };

            });
        });
        $('#txtSelectlist').change(function () {
            pageController.loadData(true);
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            pageController.deleteMul();
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });
        $('.btn-active').off('click').on('click', function (e) {
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/Page/ChangeStatus',
                data: { id: id },
                type: 'get',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        target.removeClass('label-danger');
                        target.addClass('label-success');
                        toastr.remove();
                        toastr.info("Đã kích hoạt");
                        target.html("<i class='fa fa-check'><\/i><\/a>");
                    } else {
                        target.removeClass('label-success');
                        target.addClass('label-danger');
                        toastr.remove();
                        toastr.info("Đã hủy kích hoạt");
                        target.html("<i class='fa fa-ban'><\/i><\/a>");
                    }
                }
            });
        });
        $('.browser').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            pageController.loadDetail(id);
        });
        $('.btnBrowser').off('click').on('click', function () {
            var id = $(this).data('id');
            window.open('/Admin/Page/Put/' + id);
        })
    },
    loadDetail: function (id) {

        $.ajax({
            url: '/Admin/Page/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $('.btnBrowser').attr('data-id', data.ID);
                    $('#modal-title').html(data.Name);
                    $('#contentBrowser').html(data.Content);
                    $('#modalBrowser').modal('show');
                } else {
                    toastr.error("Có lỗi tải nội dung!");
                }
            }
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/Page/delete',
            data: {
                id: id
            },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    toastr.success(res.message);
                    pageController.loadData(true);
                }
                else {
                    toastr.error(res.message);
                }
            }
        });

    },
    deleteMul: function () {
        var listSelected = [];

        $("td input:checked").each(function () {
            listSelected.push($(this).data('id'));

        });
        if (listSelected.length == 0) {
            toastr.info("Không có phần tử nào được chọn!");
        } else {
            $.ajax({
                url: '/Admin/Page/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message)
                        pageController.loadData(true);
                }
            });
        }
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        var option = $('#txtSelectlist').val();
        $.ajax({
            url: '/Admin/Page/GetAll',
            type: 'GET',
            data: {
                option: option,
                searchstr: search,
                page: config.pageIndex,
                pageSize: config.pageSize
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Image: item.Alias,
                            Content: item.Content,
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'> <\/i><\/a><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'> <\/i><\/a><\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    //hien thi số trang và trang hiện tại
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    pageController.paging(response.total, function () {
                        pageController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);

                    }, changePageSize);
                    pageController.registerEvent();
                }
            }
        });
    }
    , paging: function (totalRow, callback, changePageSize) {

        var totalPage = Math.ceil(totalRow / config.pageSize);
        if ($('#pagination a').length === 0 || changePageSize === true) {
            $('#pagination').empty();
            $('#pagination').removeData("twbs-pagination");
            $('#pagination').unbind("page");
        }

        $('#pagination').twbsPagination({
            totalPages: totalPage,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp ',
            last: 'Cuối',
            visiblePages: 10,
            onPageClick: function (event, page) {
                config.pageIndex = page;
                setTimeout(callback, 100)
            }
        })
    }
}
pageController.init();
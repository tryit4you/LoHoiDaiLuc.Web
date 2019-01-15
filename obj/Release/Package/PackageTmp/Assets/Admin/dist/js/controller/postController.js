var postconfig = {
    pageSize: 20,
    pageIndex: 1
}

var postController = {
    init: function () {
        postController.loadData();
        postController.registerEvent();
        //postController.getType();
    },
    registerEvent: function () {

        $('#searchStr').off('click').on('click', function () {
            postController.loadData(true);
        });
        $('#txtSearch').change(function () {
            postController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            $('#txtSelectlist').val('');
            postController.loadData(true);
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
                    postController.delete(id);
                };

            });
        });
        $('#txtSelectlist').change(function () {
            postController.loadData(true);
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            postController.deleteMul();
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });
        $('.btn-active').off('click').on('click', function (e) {
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/post/ChangeStatus',
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
                        toastr.info("Đã kích hoạt");
                        target.html("<i class='fa fa-ban'><\/i><\/a>");
                    }
                }
            });
        });
        $('.browser').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            postController.loadDetail(id);
        });
        $('.btnBrowser').off('click').on('click', function () {
            var id = $(this).data('id');
            window.open('/Admin/post/Put/' + id);
        })
    },
    loadDetail: function (id) {

        $.ajax({
            url: '/Admin/Post/GetDetail',
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
                    toastr.warning("Có lỗi tải nội dung!");
                }
            }
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/post/delete',
            data: {
                id: id
            },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    toastr.success(res.message);
                    postController.loadData(true);
                }
                else {
                    toastr.warning(res.message);
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
            toastr.warning("Không có phần tử nào được chọn!");
        } else {
            $.ajax({
                url: '/Admin/post/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    postController.loadData(true);
                }
            });
        }
    },
    getType: function () {

        //khoi tao bien truyen gia tri cho list option
        var listOption = $('#txtSelectlist');
        $.ajax({
            url: '/Admin/post/getTypeName',
            type: 'get',
            dataType: 'JSON',
            success: function (response) {
                var data = response.data;
                $(data).each(function (i, item) {
                    listOption.append($('<option/>', { value: item.ID, text: item.SubName }));
                });
            }
        });
    },
    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        var option = $('#txtSelectlist').val();
        $.ajax({
            url: '/Admin/Post/GetAll',
            type: 'GET',
            data: {
                option: option,
                searchstr: search,
                page: postconfig.pageIndex,
                pageSize: postconfig.pageSize
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
                            Image: item.Image,
                            CreatedDate: commonController.parseDate(item.CreatedDate),
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'> <\/i><\/a><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'> <\/i><\/a><\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    //hien thi số trang và trang hiện tại
                    var totalPage = Math.ceil(response.total / postconfig.pageSize);
                    postController.paging(response.total, function () {
                        postController.loadData();
                        $('#currentpage').html(postconfig.pageIndex);
                        $('#totalpage').html(totalPage);

                    }, changePageSize);
                    postController.registerEvent();
                }
            }
        });
    }
    , paging: function (totalRow, callback, changePageSize) {

        var totalPage = Math.ceil(totalRow / postconfig.pageSize);
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
                postconfig.pageIndex = page;
                setTimeout(callback, 100)
            }
        })
    }
}
postController.init();
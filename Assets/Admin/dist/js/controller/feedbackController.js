var config = {
    pageSize: 20,
    pageIndex: 1
}
var feedbackController = {
    init: function () {
        feedbackController.loadData();
        feedbackController.registerEvent();
    },
    registerEvent: function () {

 $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    feedbackController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    feedbackController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            feedbackController.loadData(true);
        });
        $('#btn-Search').off('click').on('click', function () {
            feedbackController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            feedbackController.loadData(true);
        });
        $('.btn-active').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/contact/ChangeStatus',
                data: { id: id },
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        target.removeClass('label-danger');
                        target.addClass('label-success');
                        target.text('Kích hoạt');
                    } else {
                        target.removeClass('label-success');
                        target.addClass('label-danger');
                        target.text('Khóa');
                    }
                }
            });
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });
        $('.btn-reply').off('click').on('click', function () {
            var id = $(this).data('id');
            $.ajax({
                url: '/Admin/Feedback/SendAsync',
                data: {
                    id:id
                },
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        bootbox.alert(res.message);
                    } else {
                        bootbox.alert(res.message);
                    }
                }
            })
        });

    },

    delete: function (id) {
        $.ajax({
            url: '/Admin/Feedback/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                bootbox.alert(res.message, function () {
                    feedbackController.loadData(true);
                });
            }
        });
    },
    deleteMul: function () {
        var listSelected = [];

        $("td input:checked").each(function () {
            listSelected.push($(this).data('id'));

        });
        if (listSelected.length == 0) {
            bootbox.alert("Không có phần tử nào được chọn!");
        } else {
            $.ajax({
                url: '/Admin/Feedback/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    bootbox.alert(response.message, function () {
                        feedbackController.loadData(true);
                    });
                }
            });
        }
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Admin/Feedback/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    var item = res.data;
                    $('#txtId').val(item.ID);
                    $('#txtName').val(item.Name);
                    $('#txtPhone').val(item.Phone);
                    $('#txtMessage').val(item.Message);
                    $('#txtEmail').val(item.Email);
                    
                    $('#ckStatus').prop('checked', item.Status);
                }
                else {
                    bootbox.alert("Lỗi!", function () {
                        feedbackController.loadData(true);
                    });
                }
            }

        });
    },
   
    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Admin/Feedback/GetAll',
            type: 'GET',
            data: {
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
                            Message: item.Message,
                            Phone: item.Phone,
                            Email: item.Email,
                            CreatedDate: commonController.parseDate(item.CreatedDate),
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'>Kích hoạt<\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'>Khóa<\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    feedbackController.paging(response.total, function () {

                        feedbackController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    feedbackController.registerEvent();
                }
            }
        });
    },
    paging: function (totalRow, callback, changePageSize) {
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
                setTimeout(callback, 200)
            }
        })
    }
}
feedbackController.init();
var config = {
    pageSize: 20,
    pageIndex: 1
}
var slideController = {
    init: function () {
        slideController.loadData();
        slideController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Name: "required",
                Image: "required",
                Link: "required"
            },
            messages: {
                Name: "Tên danh mục là bắt buộc",
                Image: "Yêu cầu phải có hình ảnh",
                Link: "Yêu cầu đường dẫn"
            }
        });

     $('.displayOrderInput').on('change', function () {
            var id = $(this).data('id');
            var order = $(this).val();
            if (parseInt(order) < 0) {
                toastr.warning("Gía trị không được nhỏ hơn 0");
                $(this).val('0');

            }
            else
                slideController.updateOrder(id, order);
        });

        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    slideController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    slideController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            slideController.loadData(true);
        });
        $('#btn-Search').off('click').on('click', function () {
            slideController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            slideController.loadData(true);
        });
        $('.btn-active').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/slide/ChangeStatus',
                data: { id: id },
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        target.removeClass('label-danger');
                        target.addClass('label-success');
                        toastr.remove();
                        toastr.info("Đã kích hoạt");
                        target.html("<i class='fa fa-check'><\/i>");
                    } else {
                        target.removeClass('label-success');
                        target.addClass('label-danger');
                        toastr.remove();
                        toastr.info("Đã hủy kích hoạt");
                        target.html("<i class='fa fa-ban'><\/i>");
                    }
                }
            });
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });

    },
    updateOrder: function (id, order) {
        $.ajax({
            url: '/Admin/Slide/UpdateOrder',
            data: {
                id: id,
                DisplayOrder: order
            },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.result) {
                    toastr.success(res.message);
                } else {
                    toastr.error(res.message);
                }
            }
        });
    },
    resetForm: function () {
        $('.validate').html('');
        $('#txtId').val('');
        $('#txtDescription').val('');
        $('#txtContent').val('');
        $('#txtName').val('');
        $('#txtLink').val('');
        $('#txtImages').val('');
        $('#txtImg').attr('src', '');
        $('#txtDisplayOrder').val('0');
        $('#ckStatus').prop('checked', 'true');
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/Slide/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                    slideController.loadData(true);
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
                url: '/Admin/Slide/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                        slideController.loadData(true);
                }
            });
        }
    },

    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Admin/Slide/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    slideController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Admin/slide/GetDetail',
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
                    var image = $('#txtImages').val(item.Image);
                    $('#txtImg').attr('src', image.val());
                    $('#txtDescription').val(item.Description);
                    $('#txtDescription').val(item.Content);
                    $('#txtDisplayOrder').val(item.DisplayOrder);
                    $("#txtLink").val(item.Url);
                    $('#ckStatus').prop('checked', item.Status);
                }
                else {
                    toastr.error("Lỗi!");
                        slideController.loadData(true);
                }
            }

        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Admin/slide/GetAll',
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
                            Description: item.Description,
                            Content: item.Content,
                            Image: item.Image,
                            DisplayOrder: item.DisplayOrder,
                            Link: item.Url,
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'><\/i><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'><\/i><\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    slideController.paging(response.total, function () {

                        slideController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                        $('#row_item').html(response.total);
                    }, changePageSize);
                    slideController.registerEvent();
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
slideController.init();
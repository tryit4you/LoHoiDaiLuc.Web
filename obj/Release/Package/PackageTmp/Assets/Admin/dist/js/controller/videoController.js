var config = {
    pageSize: 20,
    pageIndex: 1
}
var videoController = {
    init: function () {
        videoController.loadData();
        videoController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Name: "required",
                SEO: "required",
                Code: "required"
            },
            messages: {
                Name: "Tên là bắt buộc",
                SEO: "Yêu cầu phải có tiêu đề SEO",
                Code: "Mã video không được trống"
            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    videoController.Put();
                } else {
                    videoController.checkExist(Name);
                }
            }
        });
        $('#txtName').change(function () {
            var input = $('#txtName').val();
            var seoTitle = commonController.getSeoTitle(input);
            $('#txtSeoTitle').val(seoTitle);
        });
        $('#btnAddNew').off('click').on('click', function () {
            videoController.resetForm();
            $('#modal-title').html("Thêm mới danh mục");
            $('#btnSave').html("Thêm mới");
            $('#modalVideo').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalVideo').modal('show');
            videoController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    videoController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    videoController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            videoController.loadData(true);
        });
        $('#btn-Search').off('click').on('click', function () {
            videoController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            videoController.loadData(true);
        });
        $('.btn-active').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/video/ChangeStatus',
                data: { id: id },
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        target.removeClass('label-danger');
                        target.addClass('label-success');
                        toastr.info("Đổi trạng thái thành công");
                        target.html("<i class='fa fa-check'></i>");
                    } else {
                        target.removeClass('label-success');
                        target.addClass('label-danger');
                        toastr.info("Đổi trạng thái thành công");
                        target.html("<i class='fa fa-ban'></i>");
                    }
                }
            });
        });
        $('.btn-HomeFlag').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/video/HomeFlagStatus',
                data: { id: id },
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        target.removeClass('label-danger');
                        target.addClass('label-success');
                        toastr.success("Đổi trạng thái thành công");
                        target.html("<i class='fa fa-check'></i>");
                    } else {
                        target.removeClass('label-success');
                        target.addClass('label-danger');
                        toastr.success("Đổi trạng thái thành công");
                        target.html("<i class='fa fa-ban'></i>");
                    }
                }
            });
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });
        $('#viewDemo').on('click', function () {

        });
    },
    resetForm: function () {
        $('.validate').html('');
        $('#txtId').val('');
        $('#txtSeoTitle').val('');
        $('#txtName').val('');
        $('#txtCode').val('');
        $('#ckHomeFlag').prop('checked', 'true');
        $('#ckStatus').prop('checked', 'true');
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/Video/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                videoController.loadData(true);
            }
        });
    },
    deleteMul: function () {
        var listSelected = [];

        $("td input:checked").each(function () {
            listSelected.push($(this).data('id'));

        });
        if (listSelected.length == 0) {
            toastr.error("Không có phần tử nào được chọn!")
        } else {
            $.ajax({
                url: '/Admin/Video/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    videoController.loadData(true);
                }
            });
        }
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Admin/Video/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    videoController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Admin/Video/GetDetail',
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
                    $('#txtSeoTitle').val(item.Alias);
                    $('#txtCode').val(item.Code);
                    $('#ckHomeFlag').prop('checked', item.HomeFlag);
                    $('#ckStatus').prop('checked', item.Status);
                }
                else {
                    toastr.error(res.message);
                    videoController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Name = $('#txtName').val();
        var Code = $('#txtCode').val();
        var Status = $('#ckStatus').prop('checked');
        var Alias = $('#txtSeoTitle').val();
        var HomeFlag = $('#ckHomeFlag').prop('checked');

        var e = {
            Name: Name,
            Alias: Alias,
            Code: Code,
            HomeFlag: HomeFlag,
            Status: Status
        };
        $.ajax({
            url: '/Admin/video/Post',
            data: {
                video: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalVideo').modal('hide');
                    toastr.success(response.message);
                    videoController.loadData(true);
                } else {
                    $('#modalVideo').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var Name = $('#txtName').val();
        var Code = $('#txtCode').val();
        var Alias = $('#txtSeoTitle').val();
        var HomeFlag = $('#ckHomeFlag').prop('checked');
        var Status = $('#ckStatus').prop('checked');
        var e = {
            ID: id,
            Name: Name,
            Alias: Alias,
            Code: Code,
            Status: Status,
            HomeFlag: HomeFlag
        };
        $.ajax({
            url: '/Admin/Video/Put',
            data: {
                video: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalVideo').modal('hide');
                    toastr.success(response.message);
                    videoController.loadData(true);
                } else {
                    $('#modalVideo').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Admin/Video/GetAll',
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
                            Code: item.Code,
                            HomeFlag: item.HomeFlag ? "<a href='#' class='btn-HomeFlag label-success' data-id='" + item.ID + "'><i class='fa fa-check'><\/i><\/a>" : "<a href='#' class='btn-HomeFlag label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'><\/i><\/a>",
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'><\/i><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'><\/i><\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    videoController.paging(response.total, function () {

                        videoController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    videoController.registerEvent();
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
videoController.init();
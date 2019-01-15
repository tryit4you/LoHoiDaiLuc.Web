﻿var config = {
    pageSize: 20,
    pageIndex: 1
}
var systemConfigController = {
    init: function () {
        systemConfigController.loadData();
        systemConfigController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Code: "required",
              },
            messages: {
                Code: "Code không được trống"
            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    systemConfigController.Put();
                } else {
                    systemConfigController.checkExist(Name);
                }
            }
        });
        $('#txtName').change(function () {
            var input = $('#txtName').val();
            var seoTitle = commonController.getSeoTitle(input);
            $('#txtSeoTitle').val(seoTitle);
        });
        $('#btnAddNew').off('click').on('click', function () {
            systemConfigController.resetForm();
            $('#modal-title').html("Thêm mới danh mục");
            $('#btnSave').html("Thêm mới");
            $('#modalVideo').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalVideo').modal('show');
            systemConfigController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    systemConfigController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    systemConfigController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            systemConfigController.loadData(true);
        });
        $('#btn-Search').off('click').on('click', function () {
            systemConfigController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            systemConfigController.loadData(true);
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
    
    },
    resetForm: function () {
        $('.validate').html('');
        $('#txtId').val('');
        $('#txtCode').val('');
        $('#txtValuesInt').val('');
        $('#txtValuesString').val('');
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/SystemConfig/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                systemConfigController.loadData(true);
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
                url: '/Admin/SystemConfig/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    systemConfigController.loadData(true);
                }
            });
        }
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Admin/SystemConfig/CheckExist',
            data: {
                code: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    systemConfigController.Post();
                } else {
                    $('.validate').html('Mã ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Admin/SystemConfig/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    var item = res.data;
                    $('#txtCode').val(item.Code);
                    $('#txtValuesInt').val(item.ValueInt);
                    $('#txtValuesString').val(item.ValueString);
                }
                else {
                    toastr.error(res.message);
                    systemConfigController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Code = $('#txtCode').val();
        var ValueInt = $('#txtValuesInt').val();
        var ValueString = $('#txtValuesString').val();
        var e = {
            Code: Code,
            ValueInt: ValueInt,
            ValueString: ValueString
        };
            $.ajax({
            url: '/Admin/SystemConfig/Post',
            data: {
                config: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalVideo').modal('hide');
                    toastr.success(response.message);
                    systemConfigController.loadData(true);
                } else {
                    $('#modalVideo').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
      
        var Code = $('#txtCode').val();
        var ValueInt = $('#txtValuesInt').val();
        var ValueString = $('#txtValuesString').val();
        var e = {
            ID: id,
            Code: Code,
            ValueInt: ValueInt,
            ValueString: ValueString
        };
        $.ajax({
            url: '/Admin/SystemConfig/Put',
            data: {
                config: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalVideo').modal('hide');
                    toastr.success(response.message);
                    systemConfigController.loadData(true);
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
            url: '/Admin/SystemConfig/GetAll',
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
                            Code: item.Code,
                            ValueInt: item.ValueInt,
                            ValueString: item.ValueString
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    systemConfigController.paging(response.total, function () {

                        systemConfigController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    systemConfigController.registerEvent();
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
systemConfigController.init();
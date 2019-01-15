var config = {
    pageSize: 20,
    pageIndex: 1
}
var contactController = {
    init: function () {
        contactController.loadData();
        contactController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Name: "required",
                SeoTitle: "required"
            },
            messages: {
                Name: "Yêu cầu nhập tên liên hệ",
                SeoTitle: "Yêu cầu phải có tiêu đề SEO"
            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    contactController.Put();
                } else {
                    contactController.checkExist(Name);
                }
            }
        });
        $('#txtName').change(function () {
            var input = $('#txtName').val();
            var seoTitle = getSeoTitle(input);
            $('#txtSeoTitle').val(seoTitle);
            var link = '/' + seoTitle + ".html";
            $('#txtLink').val(link);
        });
        $('#btnAddNew').off('click').on('click', function () {
            contactController.resetForm();
            $('#modal-title').html("Thêm mới danh mục");
            $('#btnSave').html("Thêm mới");
            $('#modalContact').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalContact').modal('show');
            contactController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    contactController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    contactController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            contactController.loadData(true);
        });
        $('#btn-Search').off('click').on('click', function () {
            contactController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            contactController.loadData(true);
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
                        toastr.remove();
                        toastr.info("Đã kích hoạt");
                        target.html("<i class='fa fa-check'></i>");
                    } else {
                        target.removeClass('label-success');
                        target.addClass('label-danger');
                        toastr.remove();
                        toastr.info("Đã hủy kích hoạt");
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
        $('#txtPhone').val('');
        $('#txtName').val('');
        $('#txtEmail').val('');
        $('#txtWebsite').val('');

        $('#txtAddress').val('');
        $('#ckStatus').prop('checked', 'true');
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/contact/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                    contactController.loadData(true);

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
                url: '/Admin/contact/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                        contactController.loadData(true);
                }
            });
        }
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Admin/contact/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    contactController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Admin/contact/GetDetail',
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
                    $('#txtWebsite').val(item.Website);
                    $('#txtEmail').val(item.Email);
                    $('#txtAddress').val(item.Address);
                    $('#ckStatus').prop('checked', item.Status);
                }
                else {
                    toastr.error("Lỗi!");
                        contactController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Name = $('#txtName').val();
        var Phone = $('#txtPhone').val();
        var Email = $("#txtEmail").val();
        var Website = $("#txtWebsite").val();
        var Address = $("#txtAddress").val();
        var Status = $('#ckStatus').prop('checked');
        var e = {
            Name: Name,
            Phone: Phone,
            Email: Email,
            Website: Website,
            Address: Address,
            Status: Status
        };
         $.ajax({
            url: '/Admin/contact/Post',
            data: {
                contact: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalContact').modal('hide');
                    toastr.success(response.message);
                        contactController.loadData(true);

                } else {
                    $('#modalContact').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var Name = $('#txtName').val();
        var Phone = $('#txtPhone').val();
        var Email = $("#txtEmail").val();
        var Website = $("#txtWebsite").val();
        var Address = $("#txtAddress").val();
        var Status = $('#ckStatus').prop('checked');
        var e = {
            ID: id,
            Name: Name,
            Phone: Phone,
            Email: Email,
            Website: Website,
            Address: Address,
            Status: Status
        };
        $.ajax({
            url: '/Admin/contact/Put',
            data: {
                contact: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalContact').modal('hide');
                    toastr.success(response.message)
                        contactController.loadData(true);

                } else {
                    $('#modalContact').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Admin/Contact/GetAll',
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
                            Image: item.Image,
                            Phone: item.Phone,
                            Email: item.Email,
                            Website: item.Website,
                            Address: item.Address,
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'></i><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'>< i class= 'fa fa-ban' ></i><\/a><\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    contactController.paging(response.total, function () {

                        contactController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    contactController.registerEvent();
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
contactController.init();
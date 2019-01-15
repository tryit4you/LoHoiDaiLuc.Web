var config = {
    pageSize: 20,
    pageIndex: 1
}
var postCategoryController = {
    init: function () {
        postCategoryController.loadData();
        postCategoryController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                postCategoryName: "required",
                SeoTitle: "required"
            },
            messages: {
                postCategoryName: "Tên danh mục là bắt buộc",
                SeoTitle: "Yêu cầu phải có tiêu đề SEO"
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
                postCategoryController.updateOrder(id, order);
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    postCategoryController.Put();
                } else {
                    postCategoryController.checkExist(Name);
                }
            }
        });
        $('#txtName').change(function () {
            var input = $('#txtName').val();
            var seoTitle = commonController.getSeoTitle(input);
            $('#txtSeoTitle').val(seoTitle);
        });
        $('#btnAddNew').off('click').on('click', function () {
            postCategoryController.resetForm();
            $('#modal-title').html("Thêm mới danh mục");
            $('#btnSave').html("Thêm mới");
            $('#modalPostCategory').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalPostCategory').modal('show');
            postCategoryController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    postCategoryController.delete(id);
                };

            });
        });
        $('#txtSelectlist').change(function () {
            postCategoryController.loadData(true);
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            postCategoryController.deleteMul();
        });
        $('#txtSearch').change(function () {
            postCategoryController.loadData(true);
        });
        $('#btn-Search').off('click').on('click', function () {
            postCategoryController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            postCategoryController.loadData(true);
        });
        $('.btn-active').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/PostCategory/ChangeStatus',
                data: { id: id },
                type: 'post',
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
                        target.html("<i class='fa fa-ban'> <\/i><\/a>");
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
            url: '/Admin/PostCategory/UpdateOrder',
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
        $('#txtSeoTitle').val('');
        $('#txtName').val('');
        $('#txtDisplayOrder').val('0');
        $('#txtMetadescription').val('');
        $('#txtMetakeyword').val('');
        $('#txtMetadescription').val('');
        $('#ckStatus').prop('checked', 'true');
        $('#ckHomeFlag').prop('checked', 'true');
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/PostCategory/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                postCategoryController.loadData(true);
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
                url: '/Admin/PostCategory/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    postCategoryController.loadData(true);
                }
            });
        }
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Admin/PostCategory/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    postCategoryController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        postCategoryController.resetForm();
        $.ajax({
            url: '/Admin/PostCategory/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    var item = res.data;
                    $('#txtId').val(item.ID);
                    $('#txtName').val(item.cateName);
                    $('#txtSeoTitle').val(item.cateAlias);
                    $('#txtDisplayOrder').val(item.DisplayOrder);
                    $('#txtDescription').val(item.Description);
                    $('#txtMetakeyword').val(item.MetaKeyword);
                    $('#txtMetadescription').val(item.MetaDescription);
                    $('#ckStatus').prop('checked', item.Status);
                    $('#ckHomeFlag').prop('checked', item.HomeFlag);
                }
                else {
                    toastr.error("Lỗi!");
                    postCategoryController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Name = $('#txtName').val();
        var seoTitle = $('#txtSeoTitle').val();
        var DisplayOrder = $('#txtDisplayOrder').val();
        var Description = $('#txtDescription').val();
        var Metakeyword = $('#txtMetakeyword').val();
        var Metadescription = $('#txtMetadescription').val();
        var Status = $('#ckStatus').prop('checked');
        var HomeFlag = $('#ckHomeFlag').prop('checked');
        var e = {
            cateName: Name,
            SeoTitle: seoTitle,
            cateAlias: seoTitle,
            Description: Description,
            DisplayOrder: DisplayOrder,
            MetaKeyword: Metakeyword,
            MetaDescription: Metadescription,
            Status: Status,
            HomeFlag: HomeFlag
        };
        $.ajax({
            url: '/Admin/PostCategory/Post',
            data: {
                postCategory: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalPostCategory').modal('hide');
                    toastr.success(response.message);
                    postCategoryController.loadData(true);
                } else {
                    $('#modalPostCategory').modal('hide');
                    toastr.warning(response.message);
                }
            }
        });
    },
    Put: function () {
        
        var Id = $('#txtId').val();
        var Name = $('#txtName').val();
        var seoTitle = $('#txtSeoTitle').val();
        var DisplayOrder = $('#txtDisplayOrder').val();
        var Description = $('#txtDescription').val();
        var Metakeyword = $('#txtMetakeyword').val();
        var Metadescription = $('#txtMetadescription').val();
        var Status = $('#ckStatus').prop('checked');
        var HomeFlag = $('#ckHomeFlag').prop('checked');
        var e = {
            ID: Id,
            cateName: Name,
            cateAlias: seoTitle,
            DisplayOrder: DisplayOrder,
            Description: Description,
            MetaKeyword: Metakeyword,
            MetaDescription: Metadescription,
            Status: Status,
            HomeFlag: HomeFlag
        };
        $.ajax({
            url: '/Admin/PostCategory/Put',
            data: {
                postCategoryVm: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalPostCategory').modal('hide');
                    toastr.success(response.message);
                    postCategoryController.loadData(true);
                } else {
                    $('#modalPostCategory').modal('hide');
                    toastr.warning(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var option = $('#txtSelectlist').val();
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Admin/PostCategory/GetAll',
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
                            Name: item.cateName,
                            DisplayOrder: item.DisplayOrder,
                            CreatedDate: commonController.parseDate(item.CreatedDate),
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'> <\/i><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'><\/i><\/a><\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    postCategoryController.paging(response.total, function () {

                        postCategoryController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    postCategoryController.registerEvent();
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
postCategoryController.init();
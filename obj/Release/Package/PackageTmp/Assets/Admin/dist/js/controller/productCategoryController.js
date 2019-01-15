var config = {
    pageSize: 20,
    pageIndex: 1
}
var productCategoryController = {
    init: function () {
        productCategoryController.loadData();
        productCategoryController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                productCategoryName: "required",
                SeoTitle: "required"
            },
            messages: {
                productCategoryName: "Tên danh mục là bắt buộc",
                SeoTitle: "Yêu cầu phải có tiêu đề SEO"
            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    productCategoryController.Put();
                } else {
                    productCategoryController.checkExist(Name);
                }
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
                productCategoryController.updateOrder(id, order);
        });

        $('#txtName').change(function () {
            var input = $('#txtName').val();
            var seoTitle = commonController.getSeoTitle(input);
            $('#txtSeoTitle').val(seoTitle);
        });
        $('#btnAddNew').off('click').on('click', function () {
            productCategoryController.resetForm();
            $('#modal-title').html("Thêm mới danh mục");
            $('#btnSave').html("Thêm mới");
            productCategoryController.LoadParentList();
            $('#modalProductCategory').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalProductCategory').modal('show');
            productCategoryController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    productCategoryController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            productCategoryController.deleteMul();
        });
        $('#txtSearch').change(function () {
            productCategoryController.loadData(true);
        });
        $('#btn-Search').off('click').on('click', function () {
            productCategoryController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            productCategoryController.loadData(true);
        });
        $('.btn-active').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/ProductCategory/ChangeStatus',
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
                        target.html("<i class='fa fa-ban'><\/i><\/a>");
                    }
                }
            });
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });
        $('#txtSelectlist').change(function () {
            productCategoryController.loadData(true);
        });

    },
    resetForm: function () {
        $('.validate').html('');
        $('#txtId').val('');
        $('#txtSeoTitle').val('');
        $('#txtName').val('');
        $('#txtParentID').val('');
        $('#txtMetakeyword').val('');
        $('#txtMetadescription').val('');
        $('#txtDisplayOrder').val('0');
        $('#ckStatus').prop('checked', 'true');
        $('#ckHomeFlag').prop('checked', 'true');
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/ProductCategory/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                productCategoryController.loadData(true);
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
                url: '/Admin/ProductCategory/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    productCategoryController.loadData(true);
                }
            });
        }
    },
    updateOrder: function (id, order) {
        $.ajax({
            url: '/Admin/ProductCategory/UpdateOrder',
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
    LoadParentList: function () {
        $('#txtParentID').val('0');
        $('#txtParentID').html('Danh mục cha');
        var listOption = $('#txtParentID');
        $.ajax({
            url: '/Admin/ProductCategory/LoadParentList',
            type: 'get',
            dataType: 'json',
            success: function (res) {
                var data = res.data;
                listOption.html("<option selected value=''>-Danh mục gốc -</option>");
                $(data).each(function (i, item) {
                    listOption.append($('<option/>', { value: item.ID, text: item.cateName }));
                });

            }
        });
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Admin/ProductCategory/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    productCategoryController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        productCategoryController.resetForm();
        $.ajax({
            url: '/Admin/ProductCategory/GetDetail',
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
                    productCategoryController.LoadParentList();
                    $('#txtMetakeyword').val(item.MetaKeyword);
                    $('#txtMetadescription').val(item.MetaDescription);
                    $('#txtDisplayOrder').val(item.DisplayOrder);
                    $('#ckStatus').prop('checked', item.Status);
                    $('#ckHomeFlag').prop('checked', item.Status);
                }
                else {
                    toastr.error("Lỗi!");
                    productCategoryController.loadData(true);
                }
            }

        });
    },
Post: function () {
    var cateName = $('#txtName').val();
    var seoTitle = $('#txtSeoTitle').val();
    var ParentID = $('#txtParentID').val();
    var DisplayOrder = $('#txtDisplayOrder').val();
    var MetaKeyword = $('#txtSeoTitle').val();
    var MetaDescription = $('#txtSeoTitle').val();
    var Status = $('#ckStatus').prop('checked');
    var HomeFlag = $('#ckHomeFlag').prop('checked');
    var Metakeyword = $('#txtMetakeyword').val();
    var Metadescription= $('#txtMetadescription').val();
    var e = {
        cateName: cateName,
        cateAlias: seoTitle,
        ParentID: ParentID,
        MetaKeyWord: MetaKeyword,
        MetaDescription: MetaDescription,
        DisplayOrder: DisplayOrder,
        Status: Status,
        HomeFlag: HomeFlag,
        MetaKeyword: Metakeyword,
        MetaDescription: Metadescription
    };
    $.ajax({
        url: '/Admin/ProductCategory/Post',
        data: {
            productCategory: JSON.stringify(e)
        },
        type: 'post',
        dataType: 'json',
        success: function (response) {
            if (response.status) {
                $('#modalProductCategory').modal('hide');
                toastr.success(response.message);
                productCategoryController.loadData(true);
            } else {
                $('#modalProductCategory').modal('hide');
                toastr.error(response.message);
            }
        }
    });
},
Put: function () {
    var Id = $('#txtId').val();
    var cateName = $('#txtName').val();
    var seoTitle = $('#txtSeoTitle').val();
    var ParentID = $('#txtParentID').val();
    var DisplayOrder = $('#txtDisplayOrder').val();
    var MetaKeyword = $('#txtSeoTitle').val();
    var MetaDescription = $('#txtSeoTitle').val();
    var Status = $('#ckStatus').prop('checked');
    var HomeFlag = $('#ckHomeFlag').prop('checked');
    var Metakeyword = $('#txtMetakeyword').val();
    var Metadescription = $('#txtMetadescription').val();
    var e = {
        ID: Id,
        cateName: cateName,
        CreatedDate: Date.now,
        cateAlias: seoTitle,
        ParentID: ParentID,
        DisplayOrder: DisplayOrder,
        Status: Status,
        HomeFlag: HomeFlag,
        MetaKeyword: Metakeyword,
        MetaDescription: Metadescription
    };
    $.ajax({
        url: '/Admin/ProductCategory/Put',
        data: {
            productCategory: JSON.stringify(e)
        },
        type: 'post',
        dataType: 'json',
        success: function (response) {
            if (response.status) {
                $('#modalProductCategory').modal('hide');
                toastr.success(response.message);
                    productCategoryController.loadData(true);
            } else {
                $('#modalProductCategory').modal('hide');
                toastr.warning(response.message);
            }
        }
    });
},

loadData: function (changePageSize) {
    var search = $('#txtSearch').val();
    var option = $('#txtSelectlist').val();
    $.ajax({
        url: '/Admin/ProductCategory/GetAll',
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
                        ParentID: item.ParentID,
                        DisplayOrder: item.DisplayOrder,
                        CreatedDate: commonController.parseDate(item.CreatedDate),
                        HomeFlag: item.HomeFlag ? "<a href='#' class='btn-homeflag label-success' data-id='" + item.ID + "'><i class='fa fa-check'><\/i><\/a>" : "<a href='#' class='btn-homflag label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'><\/i><\/a><\/a>",
                        Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'><\/i><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'><\/i><\/a><\/a>"
                    });
                });
                $('#tbData').html(html);
                var totalPage = Math.ceil(response.total / config.pageSize);
                productCategoryController.paging(response.total, function () {

                    productCategoryController.loadData();
                    $('#currentpage').html(config.pageIndex);
                    $('#totalpage').html(totalPage);
                }, changePageSize);
                productCategoryController.registerEvent();
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
productCategoryController.init();
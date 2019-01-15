var config = {
    pageSize: 20,
    pageIndex: 1
}
var menuGroupController = {
    init: function () {
        menuGroupController.loadData();
        menuGroupController.registerEvent();
    },

    registerEvent: function () {

        $('#frmSaveDataGroup').validate({
            rules: {
                GroupName: "required",
                SeoTitleGroup: "required",
                Link: "required"
            },
            messages: {
                GroupName: "Tên nhóm là bắt buộc",
                SeoTitleGroup: "Yêu cầu phải có tiêu đề SEO",
                Link: "Yêu cầu đường dẫn"
            }
        });

        $('#btnSaveGroup').off('click').on('click', function () {
            var Name = $('#txtGroupName').val();
            var id = $('#txtIdGroup').val();
            if ($('#frmSaveDataGroup').valid()) {
                if (id !== '') {
                    menuGroupController.Put();
                } else {
                    menuGroupController.checkExist(Name);
                }
            }
        });
        $('#txtGroupName').change(function () {
            var input = $('#txtGroupName').val();
            var seoTitle = commonController.getSeoTitle(input);
            $('#txtSeoTitleGroup').val(seoTitle);
            var link = '/' + seoTitle + ".html";
            $('#txtLinkGroup').val(link);
        });
        $('#btnAddNewGroup').off('click').on('click', function () {
            menuGroupController.resetForm();
            $('#modal-title').html("Thêm mới danh mục");
            $('#btnSaveGroup').html("Thêm mới");
            $('#modalGroupMenu').modal('show');
        });
        $('.displayOrderInput').on('change', function () {
            var id = $(this).data('id');
            var order = $(this).val();
            if (parseInt(order) < 0) {
                toastr.warning("Gía trị không được nhỏ hơn 0");
                $(this).val('0');

            }
            else
                menuGroupController.updateOrder(id, order);
        });

        $('.btn-editGroup').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSaveGroup').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalGroupMenu').modal('show');
            menuGroupController.loadDetail(id);
        });
        $('.btn-deleteGroup').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    menuGroupController.delete(id);
                };

            });
        });
        $('#btn-DeletemultiGroup').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    menuGroupController.deleteMul();
            });

        });
        $('#txtSearchGroup').change(function () {
            menuGroupController.loadData(true);
        });
        $('#btn-SearchGroup').off('click').on('click', function () {
            menuGroupController.loadData(true);
        });
        $('#btn-refreshGroup').off('click').on('click', function () {
            $('#txtSearchGroup').val('');
            menuGroupController.loadData(true);
        });
        $('.btn-activeGroup').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/menuGroup/ChangeStatus',
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
        $('#selectAllGroup').change(function () {
            $('.selectedItemGroup').prop('checked', $(this).prop('checked'));
        });




    },
    updateOrder: function (id, order) {
        $.ajax({
            url: '/Admin/MenuGroup/UpdateOrder',
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
        $('#txtIdGroup').val('');
        $('#txtSeoTitleGroup').val('');
        $('#txtGroupName').val('');
        $('#txtLinkGroup').val('');
        $('#txtDisplayOrderGroup').val('0');
        $('#ckStatusGroup').prop('checked', 'true');
    },
    resetMenuForm: function () {
        $('.validate').html('');
        $('#txtSeoTitle').val('');
        $('#txtName').val('');
        $('#txtLink').val('');
        $('#txtDisplayOrder').val('0');
        $('#ckStatus').prop('checked', 'true');
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/MenuGroup/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                menuGroupController.loadData(true);
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
                url: '/Admin/MenuGroup/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    menuGroupController.loadData(true);
                }
            });
        }
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Admin/MenuGroup/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    menuGroupController.Post();
                } else {
                    $('.validate').html('Tên ' + '<mark>' + Name + '</mark>' + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Admin/menuGroup/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    var item = res.data;
                    $('#txtIdGroup').val(item.ID);
                    $('#txtGroupName').val(item.GroupName);
                    $('#txtSeoTitleGroup').val(item.Alias);
                    $('#txtDisplayOrderGroup').val(item.DisplayOrder);
                    $("#txtLinkGroup").val(item.Link);
                    $('#ckStatusGroup').prop('checked', item.Status);
                }
                else {
                    toastr.error("lỗi");
                    menuGroupController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var seoVal = $('#txtSeoTitleGroup').val();
        var Name = $('#txtGroupName').val();
        var seoTitle = seoVal;
        var DisplayOrder = $('#txtDisplayOrderGroup').val();
        var Link = $('#txtLinkGroup').val();
        var Status = $('#ckStatusGroup').prop('checked');
        var e = {
            GroupName: Name,
            Alias: seoTitle,
            DisplayOrder: DisplayOrder,
            Link: Link,
            Status: Status
        };
        $.ajax({
            url: '/Admin/MenuGroup/Post',
            data: {
                menuGroup: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalGroupMenu').modal('hide');
                    toastr.success(response.message);
                    menuGroupController.loadData(true);
                } else {
                    $('#modalGroupMenu').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var seoVal = $('#txtSeoTitleGroup').val();
        var id = $("#txtIdGroup").val();
        var Name = $('#txtGroupName').val();
        var seoTitle = seoVal;
        var DisplayOrder = $('#txtDisplayOrderGroup').val();
        var Link = "/" + seoVal + ".html";
        var Status = $('#ckStatusGroup').prop('checked');
        var e = {
            ID: id,
            GroupName: Name,
            Alias: seoTitle,
            DisplayOrder: DisplayOrder,
            Link: Link,
            Status: Status
        };
        $.ajax({
            url: '/Admin/MenuGroup/Put',
            data: {
                menuGroup: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalGroupMenu').modal('hide');
                    toastr.success(response.message);
                    menuGroupController.loadData(true);
                } else {
                    $('#modalGroupMenu').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    loadData: function (changePageSize) {
        var search = $('#txtSearchGroup').val();
        $.ajax({
            url: '/Admin/MenuGroup/GetAll',
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
                    var template = $('#data-templateGroup').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            GroupName: item.GroupName,
                            DisplayOrder: item.DisplayOrder,
                            Link: item.Link,
                            Status: item.Status ? "<a href='#' class='btn-activeGroup label-success' data-id='" + item.ID + "'><i class='fa fa-check'></i><\/a>" : "<a href='#' class='btn-activeGroup label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'></i><\/a>"
                        });
                    });
                    $('#tbDataGroup').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    menuGroupController.paging(response.total, function () {

                        menuGroupController.loadData();
                        $('#currentpageGroup').html(config.pageIndex);
                        $('#totalpageGroup').html(totalPage);
                    }, changePageSize);
                    menuGroupController.registerEvent();
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
    },

}
menuGroupController.init();

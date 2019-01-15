var productconfig = {
    pageSize: 20,
    pageIndex: 1
}

var productController = {
    init: function () {
        productController.loadData();
        productController.registerEvent();
        //productController.getType();
    },
    registerEvent: function () {
        //////////////////////
   
        //////////////////////
        $('#searchStr').off('click').on('click', function () {
            productController.loadData(true);
        });
        $('#txtSearch').change(function () {
            productController.loadData(true);
        });
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            $('#txtSelectlist').val('');
            productController.loadData(true);
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
                    productController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            productController.deleteMul();
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });
        $('.btn-active').off('click').on('click', function (e) {
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/Product/ChangeStatus',
                data: { id: id },
                type: 'get',
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
        $('.btn-homeflag').off('click').on('click', function (e) {
            var id = $(this).data('id');
            var target = $(this);
            $.ajax({
                url: '/Admin/Product/ChangeHomeFlag',
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
        $('.browser').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            productController.loadDetail(id);
        });
        $('.btnBrowser').off('click').on('click', function () {
            var id = $(this).data('id');
            window.open('/Admin/Product/Put/' + id);
        });
        $('#txtSelectlist').change(function () {
            productController.loadData(true);
        });
    },
    loadDetail: function (id) {

        $.ajax({
            url: '/Admin/Product/Detail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                var data = response.data;
                $('.btnBrowser').attr('data-id', data.ID);
                $('#modal-title').html(data.Name);
                $('#contentBrowser').html(data.Content);
                $('#modalBrowser').modal('show');
            }
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/Admin/Product/delete',
            data: {
                id: id
            },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    toastr.success(res.message, function () {
                        productController.loadData(true);
                    });
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
        if (listSelected.length === 0) {
            toastr.warning("Không có phần tử nào được chọn!");
        } else {
            $.ajax({
                url: '/Admin/Product/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                        productController.loadData(true);
                }
            });
        }
    },
    getType: function () {

        //khoi tao bien truyen gia tri cho list option
        var listOption = $('#txtSelectlist');
        $.ajax({
            url: '/Admin/Product/getTypeName',
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
        var option = $('#txtSelectlist').val();
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Admin/Product/GetAll',
            type: 'GET',
            data: {
                option:option,
                searchstr: search,
                page: productconfig.pageIndex,
                pageSize: productconfig.pageSize
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
                            CategoryID: item.CategoryID,
                            Name: item.Name,
                            Avatar: item.Image,
                            Price: item.Price,
                            CreatedDate: commonController.parseDate(item.CreatedDate),
                            HomeFlag: item.HomeFlag ? "<a href='#' class='btn-homeflag label-success' data-id='" + item.ID + "'><i class='fa fa-check'></i><\/a>" : "<a href='#' class='btn-homeflag label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'></i><\/a>",
                            Status: item.Status ? "<a href='#' class='btn-active label-success' data-id='" + item.ID + "'><i class='fa fa-check'></i><\/a>" : "<a href='#' class='btn-active label-danger' data-id='" + item.ID + "'><i class='fa fa-ban'></i><\/a>"
                        });
                    });
                    $('#tbData').html(html);
                    //hien thi số trang và trang hiện tại
                    var totalPage = Math.ceil(response.total / productconfig.pageSize);
                    productController.paging(response.total, function () {
                        productController.loadData();
                        $('#currentpage').html(productconfig.pageIndex);
                        $('#totalpage').html(totalPage);

                    }, changePageSize);
                    productController.registerEvent();
                }
            }
        });
    }
    , paging: function (totalRow, callback, changePageSize) {

        var totalPage = Math.ceil(totalRow / productconfig.pageSize);
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
                productconfig.pageIndex = page;
                setTimeout(callback, 100)
            }
        })
    }
}
productController.init();
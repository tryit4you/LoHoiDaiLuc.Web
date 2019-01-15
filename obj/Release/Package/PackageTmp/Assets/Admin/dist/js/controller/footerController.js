var footerController = {
    init: function () {
        footerController.loadData();
        footerController.registerEvent();
    },
    registerEvent: function () {
        $('.btn-edit').off('click').on('click', function () {
            $('#aboutEdit').modal('show');
            var id = $(this).data('id');
            aboutController.loadDetail(id);
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Admin/Home/LoadAboutDetail',
            data: {
                id: id
            },
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.status) {
                    var data = res.data;
                    $('#txtTitles').val(data.Name);
                    $('#txt-Content').val(data.Content);
                    $('#txtEmail').val(data.Email);
                    $('#txtPhone').val(data.Phone);
                    $('#txtAddress').val(data.Address);
                    $('#txtLink').val(data.Link);
                    $('#ckStatus').prop('checked', data.Status);
                }

            }
        });
    }
    ,
    loadData: function () {
        $.ajax({
            url: '/Admin/Home/_footer',
            type: 'GET',
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
                            Content: item.Content,
                            Email: item.Email,
                            Phone: item.Phone,
                            Address: item.Address,
                            Status: item.Status ? "<a href=''><span class='label label-success'>Kích hoạt<\/span></a>" : "<a href=''><span class='label label-danger'> Khóa <\/span><\/a>"
                        });
                    });
                    $('#tbData').html(html);
         
                }
            }

        });
    }
}
footerController.init();
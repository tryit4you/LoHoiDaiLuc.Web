var config = {
    pageSize: 20,
    pageIndex: 1

}
var profileController = {

    init: function () {
        profileController.registerEvent();
        profileController.loadData(true);
    },
    registerEvent: function () {
        $('.frmSaveData').validate({
            rules: {
                fullName: "required",
                userName: "required",
                phoneNumber: { number: true },
                Email: "required",
            },
            messages: {
                fullName: "Bạn phải nhập tên đầy đủ",
                userName: "Tên tài khoản là bắt buộc",
                Email: "Vui lòng nhập Email",
                phoneNumber: "Số điện thoại không hợp lệ",
            }

        });
        $('.frmSavePass').validate({
            rules: {
                NewPassword: {
                    required:true,
                    minlength: 8,
                    },
                ConfirmPassword: {
                    equalTo: '[name="NewPassword"]'
                }
            },
            messages: {
                NewPassword: 'Mật khẩu mới được bắt buộc',
                ConfirmPassword: 'Mật khẩu không trùng khớp'
            }

        });
        $('#btnUpdate').off('click').on('click', function () {
            profileController.updateProfile();
        });
        $('#btnBack').off('click').on('click', function () {
            window.open('/Admin/Home/Index', '_parent')
        });
      
        $('#btnEdit').off('click').on('click', function () {
            $('#modalEdit').modal('show');
            var id = $(this).data('id');
            profileController.loadDetail(id)
        });
        $('#btnSave').off('click').on('click', function () {
            var id = $('#txtID').val();
            if ($('.frmSaveData').valid()) { 
                profileController.saveData(id);
            }
        });
        $('#btnSavePass').off('click').on('click', function () {
            var id = $('#changePassword').data('id');
            profileController.checkPassword(id);
            
        });
        $('#changePassword').on('click', function () {
            $('#modalChangePassword').modal('show');
        });
        $('#btnUpload').on('click', function () {
            var avatar = $('#Avatar').attr('src');
            var id = $('#txtID').val();
            if (avatar != null) {
                $.ajax({
                    url: '/Admin/Account/UpdateAvatar',
                    data: {
                        avatar: avatar,
                        id: id
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (res) {
                        if (res.status == true) {
                            toastr.success("Đã cập nhật avatar!");
                            var avatar = $('#Avatar').attr('src', avatar);
                        } else {
                            toastr.err("Lỗi cập nhật");
                        }
                    }
                });
            }
        });
        $('#btnChangeImage').on('click', function (e) {

            e.preventDefault();
            var finder = new CKFinder();
            finder.selectActionFunction = function (url) {
                $("#Avatar").attr('src', url);
            };

            finder.popup();
            $('#btnUpload').attr('disabled',false);
        });
    },
    updateProfile: function () {
        var avatar = $('#Avartar').attr('src');
        $.ajax({
            url: '/Admin/Partial/UpdateProfile',
            data: {
                avatar: avatar
            },
            type: 'Product',
            dataType: 'json',
            success: function (res) {
                if (res.data) {

                    bootbox.alert("Đã cập nhật", function () {
                        location.reload();
                    });
                } else {
                    bootbox.alert("Lỗi cập nhật", function () {
                        location.reload();
                    });
                }
            }
        });
    },
    checkPassword: function (id) {
        var pass = $('#txtCurrentPassword').val();
        $.ajax({
            url: '/Admin/User/CheckPassword',
            data: {
                id: id,
                Password: pass
            },
            dataType: 'json',
            type: 'Product',
            success: function (res) {
                if (res.status==false) {
                    $('.validate').html('Sai mật khẩu');
                } else {
                    $('.validate').html('');
                    if ($('.frmSavePass').valid()) {
                        profileController.savePassword(id);
                        $('#modalChangePassword').modal('hide');
                    }
                }
            }
        })
    },
    savePassword:function(id){
        var pass = $('#txtNewPassword').val();
        $.ajax({
            url: '/Admin/User/SavePassword',
            data:{Password:pass,id:id},
            type: 'Product',
            dataType: 'json',
            success: function (res) {
                if(res.status)
                {
                    bootbox.alert("Đã cập nhật mật khẩu", function () {
                        window.open('/Admin/Login/Index');
                    });
                } else {
                    bootbox.alert("Lỗi cập nhật");
                }
            }
        })
    },
    saveData: function (id) {

        if (id != null) {
            var fullName = $('#txtEFullName').val();
            var userName = $('#txtEUserName').val();
            var birthDay = $('#txtEBirthday').val();
            var email = $('#txtEEmail').val();
            var phone = $('#txtEPhone').val();
            var address = $('#txtEAddress').val();
            var status = $('#ckEStatus').prop('checked');
        }
        var user = {
            ID: id,
            FullName: fullName,
            UserName: userName,
            Birthday: birthDay,
            Email: email,
            PhoneNumber: phone,
            Address: address,
            Status: status
        }
        $.ajax({
            url: '/Admin/Partial/SaveData',
            data: {
                strUser: JSON.stringify(user)
            },
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    $('#modalAdd').modal('hide');
                    $('#modalEdit').modal('hide');
                    bootbox.alert(response.message, function () {
                        location.reload();
                    });

                } else {
                    $('#modalEdit').modal('hide');

                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                alert(err);
            }
        });
    },
    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Admin/Account/GetAll',
            type: 'GET',
            data: {
                search: search,
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

                            UserName: item.UserName,
                            Email: item.Email,
                            Avatar: item.Avatar
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    userController.paging(response.total, function () {

                        userController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    userController.registerEvent();
                }
            }
        });
    },
}
profileController.init();
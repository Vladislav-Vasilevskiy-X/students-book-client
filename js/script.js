function switchState(state) {
    document.getElementById('student-profile-form').style.display = state;
    document.getElementById('wrap').style.display = state;
}

var ids = [];
var profiles = [];
var serviceUrl = "http://localhost:8080/AIPOS_LAB_4/rest/StudentsBook";
var lastSelectedRow;
var mode;

function refreshTable() {
    $.get({
        url: serviceUrl,
        dataType: "json",
        success: function (xhr, status) {
            ids = [];
            profiles = xhr;
            var out = "<thead>" +
                            '<tr class="w3-green">' +
                                '<th>Name</th>' +
                                '<th>Age</th>' +
                                '<th>Speciality</th>' +
                                '<th>Course</th>' +
                                '<th>Faculty</th>' +
                                '<th>University</th>' +
                                '<th>Average mark</th>' +
                                '<th>Description</th></tr></thead>';
            for (i = 0; i < xhr.length; i++) {
                out += "<tr>" +
                          "<td>" + xhr[i].name + "</td>" +
                          "<td>" + xhr[i].age + "</td>" +
                          "<td>" + xhr[i].speciality + "</td>" +
                          "<td>" + xhr[i].course + "</td>" +
                          "<td>" + xhr[i].faculty + "</td>" +
                          "<td>" + xhr[i].university + "</td>" +
                          "<td>" + xhr[i].averageValue + "</td>" +
                          "<td>" + xhr[i].description + "</td>" +
                          "</tr>";
                ids[i] = xhr[i].id;
            }
            document.getElementById("profiles-table").innerHTML = out;
        }
    });
}

(function ($) {
    $.fn.serializeFormJSON = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

$(function () {
    $('#form-content').submit(function (e) {
        e.preventDefault();
        var formObject = $(this).serializeFormJSON();
        formObject.id = ids[lastSelectedRow - 1];

        switch (mode) {
            case 'add':
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: serviceUrl,
                    data: JSON.stringify(formObject),
                    success: function (data, textStatus, jqXHR) {
                        refreshTable();
                        document.getElementById("form-content").reset();
                        switchState('none');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
                break;
            case 'edit':
                $.ajax({
                    type: 'PUT',
                    contentType: 'application/json',
                    url: serviceUrl,
                    data: JSON.stringify(formObject),
                    success: function (data, textStatus, jqXHR) {
                        refreshTable();
                        document.getElementById("form-content").reset();
                        switchState('none');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
                break;
        };
        e.stopImmediatePropagation();
        return false;
    })
});

$(function () {
    $('#add-btn').click(function (e) {
        document.getElementById("form-content").reset();
        switchState('block');
        mode = 'add';
    });
});

$(function () {
    $('#edit-btn').click(function (e) {
        if ($('.selected').length > 0) {
            switchState('block');
            mode = 'edit';
            populate('#form-content', profiles[lastSelectedRow - 1]);
        }
    });
});

$(function () {
    $('#delete-btn').click(function (e) {
        if ($('.selected').length > 0) {
            $.ajax({
                type: "DELETE",
                url: serviceUrl + "/" + ids[lastSelectedRow - 1],
                success: function (data, textStatus, jqXHR) {
                    refreshTable();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
    });
});

function populate(frm, data) {
    $.each(data, function (key, value) {
        $('[name=' + key + ']', frm).val(value);
    });
}

$(document).ready(function () {
    refreshTable();
});

$(document).ajaxComplete(function () {
    $("tr").click(function () {
        $(this).closest("tr").siblings().removeClass("selected");
        $(this).toggleClass("selected");
        lastSelectedRow = $('#profiles-table tr').index(this);
    });
});

$(function () {
    $('#vk-image').click(function (e) {
        hello('vk').login().then(function () {
            alert('Signed in vk');
            window.open('http://localhost/StudentsBook/manage-page.html', "_self");
        }, function (e) {
            alert('Signin error: ' + e.error.message);
        });
    });
});

$(function () {
    $('#facebook-image').click(function (e) {
        hello('facebook').login().then(function () {
            alert('Signed in facebook');
            window.open('http://localhost/StudentsBook/manage-page.html', "_self");
        }, function (e) {
            alert('Signin error: ' + e.error.message);
        });
    });
});

hello.init({
    facebook: 1021479304606194,
    vk: 5435745
});

var online = function (session) {
    var currentTime = (new Date()).getTime() / 1000;
    return session && session.access_token && session.expires > currentTime;
};

//hello.on('auth.login', function (auth) {
//    var fb = hello('facebook').getAuthResponse();
//    var vk = hello('vk').getAuthResponse();
//    console.log(online(fb));
//    //console.log(online(vk));
//    console.log(fb);
//    //console.log(vk);
//    if (online(fb)) {
//        window.open('http://localhost/StudentsBook/manage-page.html', "_self");
//    }
//});
$(document).ready(function () {
    // $('#search_place').select2();
    /*Get all point in home*/
    var   that,isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    console.log(isMobile.any());

    urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
    urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';
    $.ajax({
        url: baseApi + 'point/get-all-point',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            pointData = result.data.results;
            $('.point-list').html('');
            $.each(pointData, function (k, v) {
		if (v.point_type == 9)
		{
		  return;
		}
                html = '<div class="item-point" data-id="' + v.point_id + '">';
                var pointImage = JSON.parse(v.point_images);
                html += '<img src="' + pointImage[0] + '" class="img-thumbnail" alt="' + v.point_name + '">';
                html += '<h5 class="point-title">' + v.point_name + '</h5>';
                html += '</div>';
                $('.point-list').append(html);
            });

            $(".point-list").owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                dots: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    1000: {
                        items: 4
                    }
                }
            });
            pointData.sort(function(a, b){
                if(a.point_name < b.point_name) return -1;
                if(a.point_name > b.point_name) return 1;
                return 0;
            });
            var html_select='<option></option>', html_marker='';
            $.each(pointData,function (k,v) {
                var pointImage = JSON.parse(v.point_images);
                var url='';
                x = parseFloat(v.lat/ (9798 / 2032));
                y = parseFloat(v.long/ (7046 / 1462));
                console.log(x, y);
                if (isMobile.any() != null) {
                    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                    if (width>400 && width <500){
                        x+=10;
                    }else {
                        y -= 160;
                        x += 10;
                    }
                }
                if(v.point_type==3) url='/images/play_marker.jpg';
                else if(v.point_type==4) url='/images/food_marker.jpg';
                else url='/images/blank_marker.jpg';
                html_select+='<option data-top="'+v.long+'" data-left="'+v.lat+'" >'+v.point_name+'</option>';
                html_marker+='<div class="div_marker" style="margin-top:'+y+'px; margin-left: '+x+'px;    position: absolute; "><label class="label_instant">'+v.point_name+'</label>' +
                '<img src="'+pointImage[0]+'" style="width: 150px; height: 100px" class="img_instant img-fluid map" alt=""></div>'+
                    '<img src="'+url+'"  style="margin-top:'+y+'px; margin-left: '+x+'px;    position: absolute; width: 20px; height: 30px" class="point_important img-fluid map" alt="">';
            });
            $('#search_place').html(html_select);
            $('#content2 .content .row').append(html_marker);
            $('.img_instant').hide();
            $('.label_instant').hide();
            // $('#search_place').select2();
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
$('body').on('click','.point_important',function(){
    if(that) {
        $(that).show();
        $(($(that).parent()).find('.img_instant')).hide();
        $(($(that).parent()).find('.label_instant')).hide();
    }
    that=this;
    $(($(this).parent('div.div_marker')).find('img.img_instant')).show();
    $(($(this).parent('div.div_marker')).find('label.label_instant')).show();
    $(this).hide();
});
    /*Get promotion limit 2*/
    $.ajax({
        url: baseApi + 'promotion/get-all-promotion',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            limit: 2,
        }),
        success: function (result) {
            var promotionData = result.data.results;
            $('#list-promotion-home').html('');
            $.each(promotionData, function (k, v) {
                var html = '<div class="col-12 col-md-6 promotion-item" data-id="' + v.promotion_id + '">';
                    html += '<img src="' + v.promotion_image + '" title="' + v.promotion_name + '" alt="' + v.promotion_name + '">';
                    html += '</div>';

                $('#list-promotion-home').append(html);
            })
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });

    $('body').on('click', '.item-point', function () {
        var pointId = $(this).data('id');

        $.ajax({
            url: baseApi + 'point/get-point',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                point_id: pointId,
            }),
            success: function (result) {
                $('#modalForm').modal('show');

                $('#modalFormLabel').text(result.data.result.point_name);
                var pointImage = JSON.parse(result.data.result.point_images);
                html = '<div class="row img-point">';
                    html += '<div class="col-12"><img src="'+pointImage[0]+'" alt=""></div>';
                html += '</div>';
                html += '<div class="row margin30">';
                    html += '<div class="col-12">';
                        html += '<div class="row">';
                            html += '<h5 class="point-name col-12">'+result.data.result.point_name+'</h5>';
                            html += '<span class="point-note col-12">'+result.data.result.point_note+'</span>';
                        html += '</div>';
                        html += '<div class="container">';
                            html += '<div class="row margin30">';
                                html += '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">';
                                    html += '<button type="button" class="btn col-12 book-seat">Đặt chỗ</button>';
                                html += '</div>';
                                html += '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">';
                                    html += '<button type="button" class="btn col-12 point-marker">Chỉ đường</button>';
                                html += '</div>';
                            html += '</div>';
                        html += '</div><hr>';
                        html += '<div class="row margin30 point-description">'+result.data.result.point_detail+'</div>';
                    html += '</div>';
                html += '</div>';
                $('#form-body').html(html);
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
    });
    $('body').on('click', '.fixed-top', function () {
        if (document.getElementsByTagName("label")[0].offsetLeft <= 0) {
            $('main > label').show();
            $('#content2').attr('style','margin-top: -50px;border: 0px;');
            document.getElementsByClassName('img-responsive')[0].scrollIntoView();
            $('#mapdhc').hide();
            $('#download').hide();
            $('#div_search').hide();
          $('#marker').hide();
        } else{
            $('main > label').hide();
        }
    });
    $('body').on('click','#mapdhc,.zoomImg',function () {
        // $('#marker').hide();
    });
    $('body').on('click','#tab2',function () {
        $('main > label').hide();
        $('.container').attr('style','min-width: 100%');
        $('main').attr('style','min-width: 100%');
        $('#content2').attr('style','margin-top: -100px;');
        $('#mapdhc').show();
        $('#download').show();
        $('#div_search').show();
    });
    $('body').on('click', '.promotion-item', function () {
        var promotionId = $(this).data('id');

        $.ajax({
            url: baseApi + 'promotion/get-promotion',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                promotion_id: promotionId
            }),
            success: function (result) {
                $('#modalForm').modal('show');
                $('#modalFormLabel').text(result.data.result.promotion_name);

                html = '<div class="row img-point">';
                html += '<div class="col-12"><img src="'+result.data.result.promotion_image+'" alt=""></div>';
                html += '</div>';
                html += '<div class="row margin30 point-description">'+result.data.result.promotion_detail+'</div>';

                $('#form-body').html(html);
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
    });

    $('body').on('click', '.point-marker', function () {
         isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        console.log(isMobile.any());

        urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
        urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';

        if(isMobile.any() !== null) {
            if((isMobile.any()[0] == 'iPhone' || isMobile.any()[0] == 'iPad' || isMobile.any()[0] == 'iPod') && urlIOs != '')
            {
                window.location.href = urlIOs;
            } else {
                window.location.href = urlAndroid;
            }
        } else {
            window.location.href = urlAndroid;
        }

    });

    $('body').on('click', '.book-seat', function () {
        window.location.href="call://+84898181777";
    });
});


$(document).ready(function () {
    var middle_bar = $('.carousel .middle_bar');
    var controls_group = $('#myCarousel .carousel-controls-group');
    var total_controls = controls_group.find("li").length;
    var middle_control_index = parseInt(total_controls / 2);
    var controls_group_li_height = controls_group.find("li")[0].clientHeight;

    var setUpMiddleBar = function () {
        middle_bar.height(controls_group_li_height);
        middle_bar.css("top", controls_group_li_height * middle_control_index);
    }
    setUpMiddleBar();



    var clickEvent = false;
    $('#myCarousel').carousel({
        interval: 4000
    }).on('slid.bs.carousel', function (e) {
        if (!clickEvent) {
            var count = total_controls;
            var first = controls_group.find('li').first();
            first.slideUp("slow", function () {
                $(this).clone().appendTo('.list-group');
                controls_group.find('li').show();
                $(this).remove();
                controls_group.find("li").removeClass("active");
                controls_group.find("li").eq(middle_control_index).addClass("active");

                //update indexes
                // set last to 0
            });
        }
        clickEvent = false;
    });
})

$(window).load(function () {
    var boxheight = $('#myCarousel .carousel-inner').innerHeight();
    var itemlength = $('#myCarousel .item').length;
    var triggerheight = Math.round(boxheight / itemlength + 1);
    $('#myCarousel .list-group-item').outerHeight(triggerheight);
});


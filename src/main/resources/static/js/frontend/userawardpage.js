$(function () {
    var getPageInfo = "/o2o/frontend/getuserawardlistbyuser";
    var awardName = "";
    var pageIndex = 1;
    var pageSize = 3;
    var loading = false;
    addListAwards(); //预先加载3条

    function addListAwards() {
        loading = true;
        $.ajax({
            url: getPageInfo + "?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&awardName=" + awardName,
            type: "GET",
            success: function (data) {
                if (data.success) {
                    var awardHtml = "";
                    data.userAwardList.map(function (userAward, index) {
                        awardHtml += "<div class=\"card\" data-awardId='" + userAward.userAwardId + "'>\n" +
                            "            <div class=\"card-header\">" + userAward.award.awardName + "<p class='point'>消耗积分：" + userAward.point + "</p></div>\n" +
                            "            <div class=\"card-content\">\n" +
                            "                <div class=\"list-block media-list\">\n" +
                            "                    <ul>\n" +
                            "                        <li class=\"item-content\">\n" +
                            "                            <div class=\"item-media\">\n" +
                            "                                <img src='.." + userAward.award.awardImg + "' width=\"44\">\n" +
                            "                            </div>\n" +
                            "                            <div class=\"item-inner\">\n" +
                            "                                <div class=\"item-title-row\">\n" +
                            "                                    <div class=\"item-title\">" + userAward.award.awardDesc + "</div>\n" +
                            "                                </div>\n" +
                            "                            </div>\n" +
                            "                        </li>\n" +
                            "                    </ul>\n" +
                            "                </div>\n" +
                            "            </div>\n" +
                            "            <div class=\"card-footer\">\n" +
                            "                <span class=\"last-edit-time\">" + transfer(userAward.lastEditTime) + "</span>\n" +
                            "                <span><a href=\"#\" class='exchange' data-userAwardId='" + userAward.userAwardId + "'>" + checkReceive(userAward.usedStatus) + "</a></span>\n" +
                            "            </div>\n" +
                            "        </div>";
                    });
                    $(".user-award-list").append(awardHtml);
                    var total = $('.list-div .card').length;
                    if (total >= data.count) {
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').hide();
                    }
                    loading = false;
                    pageIndex += 1; //pageIndex + 1，便于下一次无限滚动知道从什么位置开始
                    $.refreshScroller();
                } else {
                    $.toast(data.errMsg);
                }
            }
        });
    }

    function checkReceive(usedStatus){
        if(usedStatus == 1){
            return "已领取";
        }else{
            return "未领取";
        }
    }

    $(".card").live("click", function () {
        var userAwardId = $(this).data("awardid");
        window.location.href = "/o2o/frontend/awardexchangestatus?userAwardId=" + userAwardId;
    });

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '.infinite-scroll-bottom', function () {
        if (loading)
            return;
        addListAwards();
    });

    // 打开侧边栏
    $("#me").click(function () {
        $.openPanel("#panel-js-demo");
    });

    $(".close-panel").click(function () {
        $.closePanel("#panel-js-demo");
    });


    $("#search").on('input', function () {
        awardName = $(this).val(); // 将全局变量shopName设置为输入值，就可以配合其他条件共同搜索
        $(".list-div").empty(); // 将list-div下面的所有card清空，因为addListShops中是append元素，而不是html()元素
        pageIndex = 1; // 将pageIndex设置为1
        addListAwards(); //请求数据
        $.init(); //再次重新初始化页面，否则因为无限加载事件可能已经注销，所以需要重新初始化
    });

    // 初始化page，并且同时class为page的元素需要添加一个class为page-current的属性，无限滚动才能运行！！！
    $.init();
});
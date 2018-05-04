let pageIndex = (function () {
    let dom = {
        $intrestPanel: $("#intrest_panel"),
        $intrest_panel_ops: $("#intrest_panel_ops"),
        $ux_icon_close: $("#ux_icon_close"),
        $header_top_right_userinfo: $("#header_top_right_userinfo"),
        $nav_left_catalog_item: $(".nav_left-catalog-item"),
        $nav_left_catalog_de: $(".nav-left-catalog-specific-item"),
        $nav_left_list: $(".nav_left_list"),
        $nav_left_catalog_close: $("#nav_left_catalog_close"),
        $search_mode: $("#search_mode"),
        $search_input: $("#search_input"),
        $search_panel: $("#search_panel"),
        $top_slider: $("#top_slider"),
        $top_slider_item: $("#top_slider_item"),
        $wzy_slider: $("#wzy_slider"),
        $wzy_slider_wrap: $("#wzy_slider_wrap"),
        $wzy_slider_arrow: $(".wzy_slider_arrow"),
        $self_recommend: $("#self_recommend"),
        $wy_recommend_wrap: $(".wy_recommend_wrap"),
        $course_set_content: $(".course_set_content"),
        $good_course: $(".good_course"),
        $aside_nav: $(".aside_nav"),
        $to_top: $(".to_top"),
    }

    class swiperFade {
        constructor(el) {
            this.wrap = el;
            this.index = 0;
            this.timer = null;
            this.timer2 = null;
        }

        play() {
            let sliders = this.wrap.find(".slider"),
                pagination = this.wrap.find(".pagination").children("li");
            sliders.stop().fadeOut();
            this.index = this.index + 1 >= sliders.length ? 0 : ++this.index;
            sliders.eq(this.index).fadeIn();
            pagination.eq(this.index).addClass("active").siblings().removeClass("active");
            this.wrap.find("#top_slider").css("background-color", sliders.eq(this.index).attr("data-color"));
        }

        interval() {
            this.timer = setInterval(this.play.bind(this), 3000)
        }

        pause() {
            this.wrap.on({
                "mouseover": () => {
                    clearTimeout(this.timer2);
                    clearInterval(this.timer);
                }, "mouseout": () => {
                    this.timer2 = setTimeout(this.interval.bind(this), 300)
                }
            })
        }

        arrow() {
            let arrow = this.wrap.children("span");
            arrow.on("click", (e) => {
// if(e.targe)
            })
        }

        circleClick() {
            let pagination = this.wrap.find(".pagination").children("li");
            let _this = this;

            $(pagination).on("click", function () {

                let index = $(this).attr("data-index") - 1;
                _this.index = index;
                _this.play();
            })
        }

        init() {
            this.interval();
            this.pause();
            this.circleClick();

        }
    }

    let getWyRecommend = data => {
        let str = "";
        data.forEach((item, index) => {
            str += `<li class="wy-recommend-item item${index + 1}">
<a href="#"><h5>${item.subTitle}</h5>
            <p>${item.productName}</p>
        </a>
        </li>`;
        })
        dom.$wy_recommend_wrap.html(str);
        str = "";
    }
    let getCourseSet = data => {
        let str = ``;
        data.forEach(item => {
            str += ` <li class="item">
            <a href="${item.targetUrl}" class="item-link">
                <img src="${item.imgUrl}" alt="" class="item-img">
                <div class="item-intro">
                    <h5 class="item-title">${item.productName}</h5>
                    <p class="item-subtitle">item.subTitle</p>
                </div>
            </a>
        </li>`;
        })
        dom.$course_set_content.html(str);
        str = "";
    }
    let getGoodCourse = data => {
        let str = ``;
        data.forEach(item => {
            str += ` <li class="item">
                <div class="item-top">
                    <a href="${item.targetUrl}" class="item-top-link">
                        <img src="${item.imgUrl}" class="item-top-img">
                    </a>
                </div>
                <div class="item-bottom">
                    <h5 class="item-bottom-title">${item.productName}</h5>
                    <p class="item-bottom-subtitle">${item.description}</p>
                    <div>
                        <div class="item-bottom-start"><span class="start all"></span><span class="start all"></span><span class="start all"></span><span class="start all"></span>`;
            if (item.score > 4.5) {
                str += `<span class="start all"></span>`;
            } else if (item.score <= 4.5) {
                str += `<span class="start half"></span>`;
            }
            str += `</div><span>${item.score}</span>
                        <span class="line">|</span>
                        <span class="learned-num">${item.learnerCount}学过</span>
                    </div>
                </div>
            </li>`;
        })
        dom.$good_course.html(str);

    }
    let getIndex = el => {
        let n = 0;
        while (el.previousSibling) {
            el = el.previousSibling;
            el.nodeType == 1 ? n++ : null;
        }
        return n;
    }
    let getIntrest = () => {
        $.ajax({
            url: "data/pointInterest.json",
            type: "get",
            dataType: "json",
            success: (data) => {
                data = data.result.interestPoints;
                let str = ``;
                let color = [];
                data.forEach((item, index) => {
                    if (index == 0) {
                        str += `<dl class="intrest-pannel-ops hot-recommend " id="intrest_panel_ops">
                           <dt class="recommend-title"><span class="cicle col-${index + 1}"></span>${item.name}</dt>`;
                    } else {
                        str += ` <dl class="intrest-pannel-ops" id="intrest_panel_ops">
                       <dt class="recommend-title"><span class="cicle col-${index + 1}"></span>${item.name}</dt>`;
                    }
                    item.children.forEach(item => {
                        str += `<dd class="recommend-item-list"><a href="javascript:;" class="recommend-item">${item.name}</a></dd>`;
                    })
                    str += `</dl>`;
                })
                dom.$intrest_panel_ops.html(str);
                str = null;
                $("#loading").hide();
                dom.$intrestPanel.show();
                const $recommend_title = $("#intrest_panel_ops .recommend-item");
                $recommend_title.on("click", function () {
                    $(this).toggleClass("selected");
                    $recommend_title.each((index, item) => {
                        let el = dom.$intrest_panel_ops.next().children(".point-intrest-bottom-btn");
                        let n = 0;
                        $recommend_title.each((index, item) => {
                            n += $(item).hasClass("selected") ? 1 : 0;
                        })
                        n > 0 ? el.addClass("active") : el.removeClass("active");

                    })
                })
            }
        });
        $.ajax({
            url: "data/topBanner.json",
            type: "get",
            dataType: "json",
            async: false,
            success: function (data) {
                data = data.result;
                let str = ``;
                let str2 = ``;
                data.forEach((item, index) => {
                    str += `<li class="top-slider-item slider" data-color="${item.picColor}"><a href="${item.urllink}" class="top-slider-item-link"><img
                src="${item.piclink}"></a>
        </li>`;
                    str2 += index == 0 ? `<li class="active" data-index="${index}"></li>` : `<li data-index="${index}"></li>`;

                })
                dom.$top_slider.html(str);
                dom.$top_slider.next().html(str2);
                dom.$top_slider.css("background-color", data[0].picColor);
                str = "";
                str2 = "";
                data = "";

            },
            error: function (e) {
                console.log(e);
            }
        });
        $.ajax({
            url: "data/personalData.json",
            type: "get",
            dataType: "json",
            success: function (data) {
                data = data.result;
                let wyRecommend = data[0].contentModuleVo,
                    courseSet = data[2].contentModuleVo,
                    goodCourse = data[3].contentModuleVo;
                getWyRecommend(wyRecommend);
                getCourseSet(courseSet);
                getGoodCourse(goodCourse);
            }
        })
    };
    let actionDom = function () {
        this.dom.$ux_icon_close.click(function () {
            $(this).parent().parent().hide();
        });
        this.dom.$header_top_right_userinfo.on({
            "mouseover": function () {
                clearTimeout(this.timer);
                $(this).children(".header-top-right-userinfo-bar").show();
            }, "mouseout": function () {
                this.timer = setTimeout(() => {
                    $(this).children(".header-top-right-userinfo-bar").hide();
                }, 300)
            }
        });
        this.dom.$nav_left_catalog_item.on({
            "mouseover": function () {
                clearTimeout(dom.$nav_left_catalog_close.timer);
                $(this).addClass("active").siblings().removeClass("active");
                dom.$nav_left_list.show().children().eq(getIndex(this)).show().siblings().hide();
                dom.$nav_left_catalog_close.show();
            }, "mouseout": function () {
                dom.$nav_left_catalog_close.timer = setTimeout(() => {
                    $(this).removeClass("active");
                    dom.$nav_left_list.hide();
                }, 200)
            }
        });
        this.dom.$nav_left_list.on({
            "mouseover": function () {
                clearTimeout(dom.$nav_left_catalog_close.timer);
            }, "mouseout": function () {
                dom.$nav_left_catalog_close.timer = setTimeout(() => {
                    $(this).hide();
                    dom.$nav_left_catalog_item.eq(getIndex(this)).removeClass("active");
                }, 200)


            }
        });
        this.dom.$nav_left_catalog_close.on("click", function () {
            dom.$nav_left_list.hide();
            dom.$nav_left_catalog_item.removeClass("active");

        });
        this.dom.$search_mode.on("click", function () {
            $(this).toggleClass("hidden")
        })
        this.dom.$search_mode.find("a").on("click", function () {
            // $(this).prepend( $(this).parent());
            $(this).parent().prepend($(this))
        });
        this.dom.$search_input.on({
                "focus": function () {
                    $(this).parent().parent().addClass("active").end();
                    if (!this.value) {
                        $(this).parent().next().show()
                    }
                }, "blur": function () {
                    $(this).parent().parent().removeClass("active").end().next().hide();
                }, "keyup": function (e) {
                    let index = parseInt(dom.$search_panel.attr("data-index")),
                        dd = dom.$search_panel.find("dd");
                    if (!this.value) {
                        if (e.keyCode == "38") {
                            index = index - 1 < 0 ? dd.length - 1 : index - 1;
                            dd.removeClass("selected").eq(index).addClass("selected");
                        } else if (e.keyCode == "40") {
                            index = index + 1 >= dd.length ? 0 : index + 1;
                            console.log("40", index);
                            dd.removeClass("selected").eq(index).addClass("selected");
                        } else if (e.keyCode == "13") {
                            if (index != -1) {
                                this.value = dd.eq(index).html();
                                dom.$search_panel.hide();
                            }
                        }
                        else if (e.keyCode = 8) {
                            if (!this.value) {
                                dom.$search_panel.show();
                            }
                        }
                        dom.$search_panel.attr("data-index", index);
                        return this
                    }
                }
            }
        );
        this.dom.$wzy_slider_wrap.on({
            "mouseover": () => {
                this.dom.$wzy_slider_arrow.show();
            }, "mouseout": () => {
                this.dom.$wzy_slider_arrow.hide();
            }
        })
        this.dom.$wzy_slider_arrow.on("click", function () {
            let el = dom.$wzy_slider;
            let length = parseFloat(el.attr("data-translate")),
                w = el.width() - 1205;
            let n = $(this).hasClass("arr-l") ? -1 : 1;
            let newL = length + (241 * n);
            newL = newL < 0 ? 0 : newL > w ? w : newL;
            console.log(newL, length, w, n);
            el.css("transform", `translateX(-${newL}px)`);
            el.attr("data-translate", newL);
        })
        this.dom.$self_recommend.on("click", () => {
            this.dom.$intrestPanel.show();
        })
        this.dom.$aside_nav.on("click", () => {
                this.dom.$aside_nav.timer = setInterval(() => {
                    let n = $(window).scrollTop() - 100;
                    if (n <= 0) {
                        n = 0;
                        clearInterval(this.dom.$aside_nav.timer)
                    }
                    $(window).scrollTop(n)
                }, 100)
            }
        )
        $(window).on({
            "scroll": function () {
                let n = $(window).scrollTop(),
                    h = $(window).height();
                n > 0 ? dom.$aside_nav.show() : dom.$aside_nav.hide();
                if (n > 130) {

                }
            }
        })

    };
    let slider = function () {
        const slider_top = new swiperFade(this.dom.$top_slider_item);
        slider_top.init();
    };
    return {
        init() {
            this.getIntrest();
            this.actionDom();
            this.slider();
        },
        dom: dom,
        getIndex: getIndex,
        actionDom: actionDom,
        getIntrest: getIntrest,
        slider: slider,
    }
})()


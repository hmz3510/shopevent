/***秒杀倒计时****/
$(()=>{
    var timer,now1 = new Date()
    target=now1.getTime() +999999999;
    setInterval(()=>{
        function countTime(){
                var now2 = new Date();
                var s = parseInt((target - now2.getTime())/1000);
                if(s>0){
                    var h = parseInt(s%(3600*24)/3600);
                    var m = parseInt(s%3600/60);
                    s = s%60;
                    if(h<10) h='0'+h;
                    if(m<10) m='0'+m;
                    if(s<10) s='0'+s;
                    var $parent=$(".skill-header>.skill-right");
                    $parent.children("strong:eq(0)").html(h);
                    $parent.children("strong:eq(1)").html(m);
                    $parent.children("strong:eq(2)").html(s);
                    timer=setTimeout(countTime,1000)
                }else{
                    clearTimeout(timer);
                    timer=null;
                    $(".sklii-header>.skill-right").children("strong:eq(2)").html("00");
                    alert('开始抢购');
                }
        }
        countTime();
    },1000)

/*商品秒杀点击事件 */
let $ul= $(".skill-footer>ul:first-child");
let lis = $(".skill-footer>ul>li");
//console.log(lis.length);
let move =0; 
let $arrow_l = $(".control-l");
let $arrow_r = $(".control-r");
    $arrow_l.on("click",function(){ 
        let $left = $(this)
        if(!$left.is(".active")){
        move--;
        let m_left=-1152*move
        $ul.css("marginLeft",m_left);
        if(lis.length-move==8){
            $left.addClass("active");
            $arrow_r.removeClass("active");
        }
    }
    })
    /*1152*/
    $arrow_r.on("click",function(){ 
        let $right = $(this)
        if(!$right.is(".active")){
        move++;
        let m_right=-1152*move
        $arrow_l.removeClass("active");
        $ul.css("marginLeft",m_right);
            if(lis.length-move<8){
                $right.addClass("active");
                $arrow_l.removeClass("active");
            }
        }
    })

    
//调用轮播配置
$(".container").show().carousel();


//楼层点击返回顶部事件
$(".fool-bar").on("click","a",function(){
    var $body=$('html,body');
     $body.animate({scrollTop:0},800);
})
//楼层点击跳转事件
let $floors = $('[data-move=floor]'), len = $floors.length, $floorbar = $(".fool-bar");
$floorbar.on("click","li",function(){
    let index = $(this).index(); //获取当前li的下标
    let height = parseInt($($floors[index]).offset().top); //获取当前li距离顶部的高度
    $floorbar.children().children(`:eq(${index})`).addClass("on").siblings().removeClass("on")
    $('html,body').stop(true).animate({scrollTop:[height-65]},500)
})

//楼层滚动事件
$(window).scroll(function(){
    var scrollTop = $(window).scrollTop()
    if(scrollTop>=500){
        $(".fool-bar").show();
    }else{
        $(".fool-bar").hide();
    } 
    currIndex=-1
    for(var i=0;i<len;i++){
        let $foolr = $($floors[i]) //获得每个楼层
        if($foolr.offset().top >= scrollTop + innerHeight/2) break;
        else currIndex =i;
        if(currIndex!==-1){
            $floorbar.find(`li:eq(${currIndex})`).addClass("on").siblings().removeClass("on") //让楼层随着屏幕改变样式
        }
    }
})




//rank排行榜事件
$(()=>{
    let WIDTH=73;
    let rank_list = $(".rank-list")
    $(".rank>ul").on("mouseenter","li",function(e){
        var i = $(e.target).index() //获取li下标
        $(".tab").css("left",15+WIDTH*i)
        rank_list.children(`:eq(${i})`).addClass("tabr_active").siblings().removeClass("tabr_active")
    })
})
//会买专辑事件
$(()=>{
    let f3_le2_ul = $(".f3-le2-content>ul")
    f3_le2_ul.on("mouseenter","li",(e)=>{
        let i = $(e.target).index();
        var $this =$(e.target);
        $this.addClass("active").siblings().removeClass("active")
        $this.parent().parent().children(`:eq(${i})`).addClass("active").siblings().removeClass("active")
    })
    
    //会买专辑定时器
    let timer =setInterval(function(){
        let $item = $(".f3-le2-content>div.active") 
        let index = $item.index()
       // console.log(index)  
        $item.next().addClass("active").prev().removeClass("active")
        $item.parent().find("ul").children(`:eq(${index+1})`).addClass("active").siblings().removeClass("active")
        if($item.next().is(":not(div.active)")){
           $item.parent().children(":first").addClass("active")
           $item.parent().find("ul").children(":first").addClass("active").siblings().removeClass("active")
        }
    },3000)
})



})
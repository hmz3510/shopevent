/*详情页事件 */
$(function(){
    if(location.search.indexOf("?lid=")!=-1){
        var lid = location.search.split("=")[1];
        //console.log(lid);
        $.ajax({
            url:"http://localhost:3000/details/getdetails",
            type:"get",
            data:{lid},
            dataType:"json",
            success: function(res) {
                console.log(res);
                var {product,pics,specs} = res;
                let $details = $(".details");
                $(".details>.title").html(product.title);
                $(".details>.subtitle").html(product.subtitle);
                $(".price>.info-money").html(product.price.toFixed(2));
                $(".price").children(":last-child").html(`服务承若：${product.promise}`);
                $(".content>.title").children().children().html(`${product.title.split("空气净化器")[0]}系列`);
               
                var html =""
                for(var sp of specs){
                    //console.log(sp);
                    html+=`<a href="product_details.html?lid=${sp.lid}" class="${sp.lid==lid?'select':''}">${sp.spec}</a>`;
                }
                $(".spec-show").html(html);
                
                var html="";
                for(var pic of pics){
                    var {sm,md,lg} = pic
                    html+=`<li><img src="${sm}" data-md="${md}" data-lg="${lg}"></li>`;
                }
                $(".content-l-b>.box>ul").html(html).children(":first-child").addClass("active");
               
                //设置中图片
                var mdImg = $(".imgbox").children(":first-child");
                mdImg.attr("src",[`${pics[0].md}`])
                //设置大图片
                var lgImg = $(".img-lg>img");
                lgImg.attr("src",[`${pics[0].lg}`])




                 //小图片箭头点击事件
                var move = 0;
                var $ulbox = $(".box").find("ul");
                if($ulbox.children().length>4){
                    $(".arrow>.arrow-l").on("click",function(e){
                        e.preventDefault();
                        $a = $(this);
                        if(!$a.is(".disabled")){
                            move--;
                            $ulbox.css("marginLeft",-70*move)
                            $a.next().removeClass("disabled");
                         
                           
                            if(move==0){
                                $a.addClass("disabled");
                            }
                        }
                    })
                    $(".arrow>.arrow-r").on("click",function(e){
                        e.preventDefault();
                        $a = $(this);
                        if(!$a.is(".disabled")){
                            move++;
                            $ulbox.css("marginLeft",-70*move)
                            $a.prev().removeClass("disabled");
                            if($ulbox.children().length==move+4){
                                $a.addClass("disabled");
                            }
                        }
                    })
                }
                
                //小图表移动事件切换中图片和大图片对应图片事件
                $ulbox.on("mousemove","li",function(){
                    var li = $(this);
                    li.addClass("active");
                    li.siblings().removeClass("active")
                    mdImg.attr("src",[li.children().attr("data-md")])
                    lgImg.attr("src",[li.children().attr("data-md")])
                    //console.log(li.children().attr("data-md"))
                })                
            }
        })
        
    }

    //购物车点击事件
    var fist_a = $(".buy").children().first();
    fist_a.on("click",function(e){
        e.preventDefault();
        $.ajax({
            url:"http://localhost:3000/users/islogin",
            type:"get",
            dataType:"json",
            success:function(res){
                if(res.ok==0){
                    $(".mask").show().animate({'opacity':.2},200)
                    $("[data-msg=notlogin]").show()
                }else{
                    let count = $(".add>input").val();
                    $.ajax({
                        url:"http://localhost:3000/cart/add",
                        type:"get",
                        data:{count,lid},
                        success:function(res){
                            location.href="cart.html"
                        }
                    })
                    
                }
                //购物车按钮关闭点击事件
                $(".head>span").on("click",function(){
                    var span = $(this)
                    $("[data-msg=notlogin]").hide();
                    $(".mask").hide()
                    
                })

                //点击购买跳转事件
                $("[data-msg=notlogin]>.msg>a").on("click",function(e){
                    e.preventDefault()
                    location.href="login.html?back="+location.href;
                })
            }
        })
   })
    
 
   




    //商品数量加减事件
    $(".details>.number>.add").on("click","button",function(){
        var $btn = $(this);
        var $input = $btn.parent().find("input");
        var n = $input.val();
        if($btn.html()=="+"){
            n++
        }else if(n>1){
            n--
        }
        $input.val(n);
    })

    

    var $mask = $(".shadow");
    var $lgDiv= $(".img-lg");
    var $lgImg=$lgDiv.children();
    var MSIZE=190;
    var MAX=380-MSIZE;
    //放大镜效果
    $(".superCover").hover(
        function(){
            $mask.toggleClass("d-none");
            $lgDiv.toggleClass("d-none");
        }
    ).mousemove(function(e){
        var left = e.offsetX-MSIZE/2;
        var top = e.offsetY-MSIZE/2;
        if(left<0) 
        left=0;
        if(left>MAX) 
        left =MAX;
        if(top<0)
        top=0;
        if(top>MAX)
        top=MAX 
        $mask.css({left,top})
        $lgImg.css({'left':-left*2,'top':-top*2})
    })
   
    
   

})
$(function(){
    $.ajax({
        url:"http://localhost:3000/users/islogin",
        type:"get",
        dataType:"json",
        success: function(res){
            if(res.ok===0){
                $(".mask").show().animate({"opacity":.2},200)
                $("[data-msg=notlogin]").show();
            }else{
                loadCart()
            }
        }
    })    

    //加载购物车函数
    function loadCart(){
        $.ajax({
            url:"http://localhost:3000/cart/lists",
            type:"get",
            dataType:"json",
            success:function(res){
                console.log(res)
                //console.log(res.length)
                var html = "",totalNum=0,totalLen,selectAll=true;
                if(res.length==0){
                    selectAll=false;
                    html=`<div class="empty">
                            <img src="images/banner/cart.jpg" alt="">
                            购物车还没有商品，赶紧选购吧！！
                        </div>`;
                }else{
                    for(var item of res){
                        //console.log(item);
                        html+=`<div class="box-content">
                                    <div class="check">
                                        <input type="checkbox">
                                    </div>
                                    <div class="product">
                                        <a href="product_details.html?lid=${item.lid}"><img src="${item.md}" alt=""></a>
                                        <span class="desc">
                                            <a href="product_details.html?lid=${item.lid}">${item.title}</a>
                                            <p>规格:${item.spec}</p>
                                        </span>
                                    </div>
                                    <div class="price">￥${item.price.toFixed(2)}</div>
                                    <div class="add">
                                        <button data-iid=${item.iid}>-</button>
                                        <input type="text" value="${item.count}">
                                        <button data-iid=${item.iid}>+</button>
                                    </div>
                                    <div class="total-price">￥${(item.price*item.count).toFixed(2)}</div>
                                    <div class="del"><a href="#">删除</a></div>
                                 </div>	`
                          
                    }
                }
                $(".box-list").html(html);   
              

                 //购物车删除事件
                $(".box-list .del").on("click","a",function(e){
                    e.preventDefault();
                    let $a = $(this)
                    let title = $a.parent().parent().children().find(".desc").children(":first").html();
                    var iid = $a.parent().parent().find(".add").children(":first").attr("data-iid");
                    $("[data-msg=delete] .msg").children(":eq(1)").html(`是否删除商品  ${title}?`)
                    $(".mask").show().animate({"opacity":.2},200)
                    $("[data-msg=delete]").show();

                    $(".msg").on("click","a",function(e){
                        e.preventDefault();
                        let $a = $(this) 
                        $.ajax({
                            url:"http://localhost:3000/cart/delete",
                            type:"get",
                            data:{iid},
                            success:function(){
                                $("[data-msg=delete]").hide();
                                $(".mask").hide()
                                loadCart();
                            }
                        })
                    })
                })

            }

        })

    }

    //购物车点击事件
    let $box_list = $(".box-list");
    $box_list.on("click","button",function(){
        let btn = $(this);
        (async function(){
           var count = btn.parent().find("input").val()
          // console.log(count)
            var iid = btn.attr("data-iid")
            if(btn.html()=="+"){
                count++;
            }else{
                count--;
                if(count==0){
                    if(!confirm("是否删除该商品?"))
                    return;
                }
            }
        btn.parent().find("input").val(count)
        await $.ajax({
            url:"http://localhost:3000/cart/update",
            type:"get",
            data:{iid,count},      
        })
        // totalLen = $box_list.children().find(".total-price");
        // var total=0;
        // for(var i of totalLen){
        //     total+=parseInt(i.innerHTML.slice(1))
           
        // }   
        // $(".footer-tol").children(":last").html(total.toFixed(2));
        loadCart();
           
        })()
    })

   //购物车删除X点击事件
   $(".head>span").on("click",function(){
    var span = $(this)
    $("[data-msg=delete]").hide();
    $(".mask").hide()
    })

   
    

    //点击购买跳转事件
    $("[data-msg=notlogin]>.msg>a").on("click",function(e){
        e.preventDefault()
        location.href="login.html?back="+location.href;
    })







})
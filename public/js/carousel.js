(function($){
    $.carousel = function(elem, options){
        this.$box = $(elem);
        this.init(options);
    }
    $.carousel.prototype={
        init:function(options){
            this.defaults={
                interval:3000,  //两次渐变之间的时间间隔
                speed:700       //一次渐变的时间ms
            };
            this.options=$.extend(true, {}, this.defaults, options);
            this.$wrapper = this.$box.find(".arrow");
            this.$Inds= this.$box.find(".list ul");
            this.$items = this.$wrapper.find("li");
            this.len = this.$items.length;
            this.currIndex =0;
            this.isAnim =false;
            this.timer = null;

            this.interval=this.options.interval;
            this.speed = this.options.speed;

            this.initStyle();
            this.addEvent();
            this.autoPlay();
        },
        //初始化样式
        initStyle:function(){
            this.setItems();
            this.$currItem.css(this.setStyles("center"));
            this.$leftItem.css(this.setStyles("left"));
            this.$rightItem.css(this.setStyles("right"));
            let _self = this;
            this.$items.filter(function(index){
                if(this!=_self.$currItem[0] && this!=_self.$leftItem[0] && this!=_self.$rightItem[0]){
                    $(this).css({width:460,height:200,left:0,top:90,opacity:0})
                }
            });
            //初始化小圆点
            let html="";
            for(let i=0;i<this.len;i++){
                html+="<li></li>";
            }
            this.$Inds.html(html).children().first().addClass('curr');
        },
        //根据当前currIndex设置新的图片
        setItems:function(){
            this.$currItem = this.$items.eq(this.currIndex)
            this.$leftItem = (this.currIndex===0) ? this.$items.eq(this.len-1) : this.$items.eq(this.currIndex-1)
            this.$leftouterItem = (this.$leftItem.index()===0) ? this.$items.eq(this.len-1) : this.$leftItem.prev();
            this.$rightItem = (this.currIndex===this.len-1) ? this.$items.eq(0) :this.$items.eq(this.currIndex+1);
            this.$rightouterItem = ( this.$rightItem.index() === this.len - 1 ) ? this.$items.eq(0) : this.$rightItem.next();
            this.picShadow();
        },
        //设置对应图片的样式
        setStyles:function(position){
            switch(position){
                case 'center': return {width:790,height:340,left:185,top:30,opacity:1};break;
                case 'left' : return {width:650, height:280,left:0,top:60,opacity:1};break;
                case 'right': return {width:650,height:280,left:1190-650,top:60,opacity:1}; break;
                case 'leftHidden': return {width:460,height:200,left:0,top:90,opacity:0}; break;
                case 'rightHidden':  return { width:460,height:200,left:1190-460,top:90,opacity:0 }; break;     
            }
        },
        //设置更新位置后图片的模糊状态
        picShadow:function(){
            this.$currItem.find(".cover").css("opacity",1).parent().siblings().find(".cover").css("opacity",0.6)
        },
        //切换图片设置动画效果
        moveItems:function(dir){
            if(!this.isAnim){
                this.isAnim=true;
                if(dir==='prev'){
                    this.$leftouterItem.css({zIndex:1,left:0}).stop(true).animate(this.setStyles('left'),this.speed);
                    this.$leftItem.css('zIndex',5).stop(true).animate(this.setStyles('center'),this.speed);
                    this.$currItem.css('zIndex',2).stop(true).animate(this.setStyles('right'),this.speed);
                    this.$rightItem.css('zIndex',1).stop(true).animate(this.setStyles('rightHidden'),this.speed,()=>this.isAnim=false);
                    this.currIndex = this.$leftItem.index();   
                }
                if(dir==='next'){
                    this.$leftItem.css('zIndex',1).stop(true).animate(this.setStyles('leftHidden'),this.speed);
                    this.$currItem.css('zIndex',2).stop(true).animate(this.setStyles('left'),this.speed);
                    this.$rightItem.css('zIndex',5).stop(true).animate(this.setStyles('center'),this.speed);
                    this.$rightouterItem.css({zIndex:1,left:1190-460}).stop(true).animate(this.setStyles('right'),this.speed,()=>this.isAnim=false);
                    this.currIndex = this.$rightItem.index();
                }
                this.$Inds.children().removeClass('curr').eq(this.currIndex).addClass('curr')
                this.setItems();
            }
        },
        //事件绑定
        addEvent:function(){
            this.$wrapper.find('.bannerBtn-prev').on("click",()=>{ //上一张事件
                clearTimeout(this.timer); //当点击时 取消当前轮播计时器
               this.timer=null;
               this.moveItems('prev');
               this.autoPlay(); //设置动画结束后重启定时器
            })
            this.$wrapper.find(".bannerBtn-next").on("click",()=>{
                clearTimeout(this.timer);
               this.timer=null;
               this.moveItems('next');
               this.autoPlay();
            })
            if(this.len>1){
                this.$Inds.on("click","li",(e)=>{
                    if(this.isAnim) return;
                    let index = $(e.target).index(); //获取圆点的下标
                    if(index===this.currIndex) return; // 点击圆点的下标与currIndex一致
                    clearInterval(this.timer);
                    timer=null;
                    let dir = 'next';
                    //当前点击圆点的下标与currIndex是相邻的 或者  是首尾两个
                    if(Math.abs(index-this.currIndex) ==1 || this.len - Math.abs(index - this.currIndex) == 1){
                        if( (index<this.currIndex && this.len-(this.currIndex-index)!=1) || (index>this.currIndex && this.len-(index-this.currIndex)==1)){
                            dir='prev'
                        }
                    }else{
                        // //当前点击圆点的下标与currIndex是不是相邻的 而且  不是是首尾两个
                        if(index>this.currIndex){
                            this.$items.css(this.setStyles("rightHidden"));
                            this.currIndex=index-1;
                            //console.log(this.currIndex)
                        }else{
                            this.$items.css(this.setStyles("leftHidden"))
                            this.currIndex=index+1;
                            //console.log(this.currIndex)
                            dir = "prev"
                        }
                        this.setItems();
                    }   
                    this.moveItems(dir);
                    this.autoPlay();
                })
            }
        },
        //设置自动轮播
        autoPlay:function(){
            this.timer = setInterval(()=>
                this.moveItems("next"),
                this.interval+this.speed
            )
        }


    }
    //向jq注册插件
    $.fn.carousel=function(options){
        this.each(function(){
            $.data(this,"carousel", new  $.carousel(this, options))
        });
        return this
    };

})(jQuery)
const express=require("express")
const router=express.Router()
const pool=require("../pool.js")

//添加商品路由
router.get("/add",(req,res)=>{
    var lid = req.query.lid;
    var count = req.query.count;
    var uid = req.session.uid;
    pool.query("select * from sc_shoppingcart_item where user_id=? and product_id=?",[uid,lid],(err,result)=>{
        if(err) console.log(err)
        if(result.length==0){
            pool.query("insert into sc_shoppingcart_item values(null,?,?,?,0)",[uid,lid,count],(err,result)=>{
                if(err) console.log(err)
                res.end();
            })
        }else{
            pool.query("update sc_shoppingcart_item set count=count+? where user_id=? and product_id=?",[count,uid,lid],(err,result)=>{
                if(err) console.log(err)
                res.end();
            })
        }
    });
})

//查看购物车路由
router.get("/lists",(req,res)=>{
    var uid = req.session.uid
    var sql = "select * ,(select md from sc_laptop_pic where laptop_id=product_id limit 1) as md from sc_shoppingcart_item inner join sc_laptop on product_id=lid where user_id=?";
    pool.query(sql,[uid],(err,result)=>{
        if(err) console.log(err)
        res.writeHead(200,{
            "Content-Type":"application/json;charset=utf-8",
        })
        res.write(JSON.stringify(result))
        res.end()
    })
})

//更新购物车路由
router.get("/update",(req,res)=>{
    var iid = req.query.iid;
    var count = req.query.count;
    if(count>0){
        var sql = "update sc_shoppingcart_item set count=? where iid=?";
        var data = [count,iid];
    }else{
        var sql = "delete from sc_shoppingcart_item where iid=?";
        var data = [iid]
    }
    pool.query(sql,data,(err,result)=>{
        if(err) console.log(err)
        res.end();
    })
})


//删除商品路由

router.get("/delete",(req,res)=>{
    var iid = req.query.iid;
    var sql = "delete from sc_shoppingcart_item where iid =? "
    pool.query(sql,[iid],(err,result)=>{
        if(err) console.log(err);
       // console.log(result);
        res.end();
    })


})




module.exports = router;

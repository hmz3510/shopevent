const express=require("express")
const router=express.Router()
const pool=require("../pool.js")




router.get("/getdetails",(req,res)=>{
    var lid = req.query.lid;
    //console.log(lid);
    var output={product:{},pics:[],specs:[]};
    var sql1 = "select * from sc_laptop where lid= ? ";
    var sql2 = "select * from sc_laptop_pic where laptop_id=?" //根据id查图片
    var sql3 = "select lid,spec from sc_laptop where family_id =(select family_id from sc_laptop where lid=?)";

    Promise.all([
        //查询商品
        new Promise(function(open){
            pool.query(sql1,[lid],(err,result)=>{
                if(err) console.log(err)
                //console.log(result);
                output.product =result[0]
                open();
            })
        }),
        new Promise(function(open){
            pool.query(sql2,[lid],(err,result)=>{
                if(err) console.log(err);
                //console.log(result);
                output.pics=result;
                open()
            })
        }),
        new Promise(function(open){
            pool.query(sql3,[lid],(err,result)=>{
                if(err) console.log(err)
                //console.log(result);
                output.specs = result;
                open();
            })
        })
    ]).then(function(){
        res.writeHead(200,{
            "Content-Type":"application/json charset=utf-8",
            "Access-Control-Allow-Origin":'*'
        })
        res.write(JSON.stringify(output));
        res.end();
    })
})




module.exports= router;

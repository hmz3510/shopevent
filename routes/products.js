const express=require("express")
const router=express.Router()
const pool=require("../pool.js")

/*商品数据 */
router.get("/",(req,res)=>{
    var kwords = req.query.kwords;
    //console.log(kwords);
    var arr= kwords.split(" "); //arr[夏普 空气净化器,三星]
    for(var i=0;i<arr.length;i++){
        arr[i] =`title like '%${arr[i]}%'`;
    }
    var where = " where " + arr.join(" and ");
     // where title like '%夏普%' and title like '% 空气净化器%' and title like '%,三星%'
    var output = {pageSize:8} //每页6个商品
    output.pno=req.query.pno;
    var sql="SELECT *,( SELECT md from sc_laptop_pic where laptop_id=lid limit 1 ) as md FROM sc_laptop ";
    
    pool.query(sql+where,[],(err,result)=>{
        if(err) console.log(err)
        output.count=result.length; //获得总记录数 
        output.pageCount = Math.ceil(output.count/output.pageSize); //计算总页数
        output.products = result.slice(output.pno*8,output.pno*8+8);
        res.writeHead(200,{
            "Content-Type":"application/json charset=utf-8",
            "Access-Control-Allow-Origin":"*"
        })
       
        res.write(JSON.stringify(output));
        res.end();
    })
   
})













module.exports = router;

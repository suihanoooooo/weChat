/**
 * 使用mongoose操作mongodb数据库
 * */
var mongooseDB = require("./mongooseDB");
var Schema = mongooseDB.mongoose.Schema;

//定义blog的schema
var BlogSchema = new Schema({
    user: String,
    blog: String,
    time: Date
});

//可以自定义方法
BlogSchema.methods.speak = function () {
    console.log("这是一个扩展的方法.");
}

//由schema发布生成Model [其中blog为数据库集合名，数据库会自动生成blogs集合]
var Blog = mongooseDB.mongoose.model("blog",BlogSchema);

module.exports = Blog;

//var Blog = mongooseDB.mongoose.model("article",BlogSchema);
//module.exports = Blog;

/**
 *  使用mongodb直接操作数据库

 //引入数据库操作模块
 var mongodb=require("./db");

 //声明Blog类
 function Blog(userName,blog,time){
    this.user=userName;
    this.blog=blog;
    if(time){
        this.time = time;
    }else{
        this.time = new Date();
    }
}

 Blog.find = function(userName,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        //"blog"为表名
        db.collection("blog",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //查找user属性为username的文档，如果为null则全部匹配
            var query ={};
            if(userName){
                query.user = userName;
            }

            //按时间排序(-1 降序),并转成数组
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();

                if(err){
                    callback(err,null);
                }

                //封装对象
                var blogs=[];
                docs.forEach(function(doc,index){
                    var blog = new Blog(doc.user,doc.blog,doc.time);
                    blogs.push(blog);
                })

                callback(null,blogs);
            })

        });
    });
}

 module.exports = Blog;

 //使用原型增加保存方法
 Blog.prototype.save=function save(callback){

    //存入mongodb文档
    var blog = {
        user:this.user,
        blog:this.blog,
        time:this.time
    }

    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("blog",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //属性增加索引
            //collection.ensureIndex("user",{unique:true});

            //写入user文档
            collection.insert(blog,{safe:true},function(err){
                mongodb.close();
                console.log("保存失败："+err);
                return callback(err);
            })

        })
    });
}

 */

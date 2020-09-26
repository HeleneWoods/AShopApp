const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://127.0.0.1:27017/';

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

let _xxObj = {
    arrs: [{
            id: 'n1',
            name: 'a_name',
            vals: 'aaa'
        },
        {
            id: 'n2',
            name: 'b_name',
            vals: 'bbb'
        },
        {
            id: 'n3',
            name: 'c_name',
            vals: 'ccc'
        }
    ]
};

// 保存过滤的结果
let _filterResult = null;

// 过滤方法
function filter(_val) {
    return _xxObj.arrs.filter(_g => {
        return _g.vals === _val;
    })
}

// 发送按钮的接口
app.get('/node_a', (req, res) => {
    let _result = filter(req.query.v_data);
    _filterResult = _result.length !== 0 ? _result : [{
        id: 'xxx',
        name: '没有结果'
    }]
    res.end();
});

// 接收按钮的接口
app.get('/node_b', (req, res) => {
    res.send(_filterResult);
});

// 用户注册信息
app.post('/register', (req, res) => {
    let _allData = '';
    req.on('data', _d => {
        _allData += _d
    });
    req.on('end', () => {
        let _registerMsg = JSON.parse(_allData);
        // 注册前查询是否有同名信息
        findSameNameFn(_registerMsg, res);
    });
});

// 查询注册同名信息
function findSameNameFn(_registerMsg, res) {
    MongoClient.connect(DB_CONN_STR, (err, db) => {
        let _dbo = db.db('proShopCart');
        let _collection = _dbo.collection('userInfo');
        _collection.findOne({ "username": _registerMsg.username }, {}, (err, result) => {
            if (err) throw err;
            if (result === null) {
                // console.log("没有同名");
                insertNewUserName(_registerMsg, res);
            } else if (result.username === _registerMsg.username) {
                // console.log("用户已存在");
                res.send({
                    regInfo: '用户已存在',
                    reg_code: 2
                });
            }
            db.close();
        })
    })
}

// 传入新用户注册的数据
function insertNewUserName(_registerMsg, res) {
    MongoClient.connect(DB_CONN_STR, (err, db) => {
        let _dbo = db.db('proShopCart');
        let _collection = _dbo.collection('userInfo');
        _collection.insertOne(_registerMsg, (err, result) => {
            if (err) throw err;
            // console.log('注册成功');
            res.send({
                regInfo: '注册成功！',
                reg_code: 1
            });
            db.close();
        })
    })
}

// 登录接口
app.post('/userLogin_port', (req, res) => {
    let _loginData = '';
    req.on('data', (_d) => {
        _loginData += _d;
    });
    req.on('end', () => {
        // console.log(JSON.parse(_loginData));
        let _tem = JSON.parse(_loginData);
        MongoClient.connect(DB_CONN_STR, (err, db) => {
            let _dbo = db.db('proShopCart');
            let _collection = _dbo.collection('userInfo');
            _collection.findOne({ 'username': _tem.u }, {}, (err, result) => {
                if (err) throw err;

                if (result === null) {
                    console.log('用户不存在');
                    return res.send({
                        regInfo: '用户不存在',
                        reg_code: 5
                    });
                } else if (_tem.p !== result.password) {
                    console.log(('密码不正确'));
                    return res.send({
                        regInfo: '密码不正确',
                        reg_code: 4
                    });
                } else if (result !== null && _tem.p === result.password) {
                    console.log('登录成功');
                    return res.send({
                        regInfo: result,
                        reg_code: 3
                    });
                }
                db.close();
            })
        })
    })
})

// 批量录入商品
app.post('/insertgoods', (req, res) => {
    let _dataObj = '';
    req.on('data', (_d) => {
        _dataObj += _d;
    })
    req.on('end', () => {
        let _insertGoodsArrsObj = JSON.parse(_dataObj);
        // console.log(_insertGoodsArrsObj);
        MongoClient.connect(DB_CONN_STR, (err, db) => {
            let _dbo = db.db('proShopCart');
            // 商品集合的名
            let _collection = _dbo.collection('goodsCategory');
            _collection.insertMany(_insertGoodsArrsObj, (err, result) => {
                if (err) throw err;

                return res.send({
                    regInfo: '商品录入成功',
                    reg_code: 6
                });

                db.close();
            })
        })
    })
})

// 获取商品列表
app.get('/getGoodsCategory', (req, res) => {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart');
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection('goodsCategory');

        _collection.aggregate([{
            $lookup: {
                localField: 'd',
                from: 'goodsList_a',
                foreignField: 'category',
                as: 'goodsList_aa'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_b',
                foreignField: 'category',
                as: 'goodsList_bb'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_c',
                foreignField: 'category',
                as: 'goodsList_cc'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_d',
                foreignField: 'category',
                as: 'goodsList_dd'
            }
        }]).toArray(function(err, result) {
            if (err) throw err;

            return res.send(result);
            db.close();
        });
    });
});

// 批量插入商品到DB，只运行一次，把商品插入到db里就ok
function insertTempGoodsList() {
    let TempGoodsListObj = [{ "name": "洗衣机", "price": 22, "category": "goodsList_b", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497575095&di=d4a59272c4cf53848d8b615f208a4d38&imgtype=0&src=http%3A%2F%2Fimg010.hc360.cn%2Fk1%2FM01%2F30%2F25%2F4LLd34735d9f8e3092065fBff467C42d385.png", "describe": " 洗衣机特好，洗的干净" },
        { "name": "燃气灶", "price": 33, "category": "goodsList_b", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497592730&di=21f41bd6f1ddf4178951c7cc1a59515f&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fhousephotolib%2F1610%2F13%2Fc1%2F28285254_1476289213390_690x460.jpg", "describe": " 燃气灶特好，火大" },
        { "name": "冰箱", "price": 44, "category": "goodsList_b", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497740253&di=2a66cd86af34128a3160f36597a7b4f8&imgtype=0&src=http%3A%2F%2Fpic15.photophoto.cn%2F20100610%2F0020033085457192_b.jpg", "describe": " 冰箱特好，凉" },
        {
            "name": "空调",
            "price": 55,
            "category": "goodsList_b",
            "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497798102&di=43fb38fe2fd46d41dab6e4e9ecd66e06&imgtype=0&src=http%3A%2F%2Fsc.jb51.net%2Fuploads%2Fallimg%2F140416%2F11-14041610514b17.jpg",
            "describe": " 空调特好，冻死个人"
        }
    ]

    MongoClient.connect(DB_CONN_STR, (err, db) => {
        let _dbo = db.db('proShopCart');
        // 商品集合的名
        let _collection = _dbo.collection('goodsList_b');

        _collection.insertMany(TempGoodsListObj, (err, result) => {
            if (err) throw err;

            db.close();
        })
    })
}
// insertTempGoodsList();

// 根据id，获取对应商品信息
app.get('/getGoodsInfo', (req, res) => {
    let _findId = req.query._id;
    let _c = req.query._c;

    const ObjectId = require('mongodb').ObjectID;
    let _findObjId = ObjectId.createFromHexString(_findId);

    MongoClient.connect(DB_CONN_STR, (err, db) => {
        let _dbo = db.db('proShopCart');
        // 商品集合的名
        let _collection = _dbo.collection(_c);
        _collection.findOne({ "_id": _findObjId }, {}, (err, result) => {
            if (err) throw err;

            return res.send(result);

            db.close();
        })
    })
});

// 竖向分类栏数据
app.get('/getCategoryGoodsList', (req, res) => {
    let _c = req.query.category;

    MongoClient.connect(DB_CONN_STR, (err, db) => {
        let _dbo = db.db('proShopCart');
        // 商品集合的名
        let _collection = _dbo.collection(_c);
        _collection.find().toArray((err, result) => {
            if (err) throw err;

            return res.send(result);

            db.close();
        })
    })
})

// 分页接口
app.get('/getPageChange', (req, res) => {
    let _s = req.query.startNum;
    let _c = req.query.c;
    MongoClient.connect(DB_CONN_STR, (err, db) => {
        let _dbo = db.db('proShopCart');
        // 商品集合的名
        let _collection = _dbo.collection(_c);
        // 限制查两条，因为一页就显示两条
        // 跳过skip()的参数需要是字符串格式
        _collection.find().limit(2).skip(Number(_s)).toArray((err, result) => {
            if (err) throw err;

            return res.send(result);

            db.close();
        })
    })
})

//轮播图
app.get('/getImgUrls', (req, res) => {
    let imgObj = {
        urls: [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663842854&di=bd40adb24bb9f7559c488dcc18c24faf&imgtype=0&src=http%3A%2F%2Fwx1.sinaimg.cn%2Flarge%2F7f6b590cgy1fh45yi4xpkj20yi0jen74.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663896385&di=0be734cc730ea2b3d869263784a519d6&imgtype=0&src=http%3A%2F%2Fp2.qhimgs4.com%2Ft01f47e00d96e5546ee.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663913605&di=a33bd590cdbe71086d835bbb3d124b14&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171008%2F11444774a5774af7a77bb8eb836c3fd3.jpeg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663942911&di=5e029b8845848bd7675f66f62c2172cd&imgtype=0&src=http%3A%2F%2Fpic39.photophoto.cn%2F20160422%2F0018031335985159_b.jpg'
        ]
    }
    return res.send(imgObj);

})


app.listen(5678, () => {
    console.log('5678中间件已经启动');
});
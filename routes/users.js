var express = require('express');
var router = express.Router();

/* GET users listing. */
/* http://ip_addr:port/users/capdata can return all data from capdata collections */
router.get('/capdata', function(req, res) {
  var db = req.db;
  db.collection('capdata').find().toArray(function (err, items){res.json(items);
  });
});

/*
 *  POST to adddevice.
 */
router.post('/adddevice', function(req, res){
    var db = req.db;
    db.collection('capdata').insert( req.body, function( err, result ){
        res.send(
            (err === null) ? { msg: ''} : { msg: err }
        );
    });
});

/*
 * DELETE to deletedevice.
 */
router.delete('/deletedevice/:id', function(req, res) {
    var db = req.db;
    var deviceToDelete = req.params.id;
    db.collection('capdata').removeById(deviceToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;

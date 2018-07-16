var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', (req,res,next)=>{
    res.send('haha')
});

module.exports = router;

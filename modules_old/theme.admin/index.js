module.exports = function(lunar) {
    lunar.route.get('/admin', function(req, res){
        res.send('Hello admin!');
    });
}
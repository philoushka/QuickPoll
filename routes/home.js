module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index',{pageTitle:""});
    }); 
    app.get('/about', function (req, res) {
        res.render('about');
    });
    app.get('/admin', function (req, res) {
        res.render('tally/admin');
    });
}
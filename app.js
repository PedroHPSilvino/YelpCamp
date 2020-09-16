var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user")
    seedDB          = require("./seeds");

require('dotenv').config();

//Requirign Routes
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes          = require("./routes/index");

mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb+srv://PedroPataro:'+ process.env.API_KEY +'@cluster0.x59fi.gcp.mongodb.net/yelp_camp?retryWrites=true&w=majority';

mongoose.connect(databaseUri, { useNewUrlParser: true })
        .then(() => console.log(`Database connected`))
        .catch(err => console.log(`Database connection error: ${err.message}`));
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("SERVER IS RUNNING");
});
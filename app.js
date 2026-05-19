const express = require("express");
const env=require("dotenv").config();
const path = require("path");
const rootpath = require("./utils/pathUtil");
const { MONGO_URL } = require("./utils/database");
const methodOverride = require("method-override");
const { dbConnect } = require("./utils/database");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);

const PORT = process.env.PORT;

const { userRouter } = require("./routes/user.route");
const { hostRouter } = require("./routes/host.route");
const authRouter = require("./routes/auth.route");
const sitemapRouter = require("./routes/sitemap.route");
const isAuth = require("./middlewares/isAuth");
const changeToHost = require("./middlewares/toHosting");

const errorController = require("./controllers/errors.controller");

const app = express();

const store = new mongodbStore({
    uri: MONGO_URL,
    collection: "sessions"
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(rootpath, 'public'), {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    }
}));

app.use((req, res, next) => {
    res.locals.url = req.path;

    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.userId = null;
    res.locals.userType = null;
    res.locals.profilePic = null;

    if (req.session.isLoggedIn) {
        res.locals.userId = req.session.userId;
        res.locals.userType = req.session.userType;
        res.locals.profilePic = req.session.profilePic || null;
    }

    // Flash toast message (read once, then clear)
    if (req.session.toast) {
        res.locals.toastMsg = req.session.toast.msg;
        res.locals.toastType = req.session.toast.type || 'success';
        delete req.session.toast;
    }

    next();
});

app.use(authRouter);
app.use("/host", isAuth, changeToHost, hostRouter);
app.use("/", userRouter);
app.use(sitemapRouter);

app.use(errorController.pageNotFound);


dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
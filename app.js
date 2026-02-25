const express = require("express");
const path = require("path");
const rootpath = require("./utils/pathUtil");
const { MONGO_URL } = require("./utils/database");
const methodOverride = require("method-override");
const { dbConnect } = require("./utils/database");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);

const PORT = 3000;

const { userRouter } = require("./routes/user.route");
const { hostRouter } = require("./routes/host.route");
const authRouter = require("./routes/auth.route");
const isAuth=require("./middlewares/isAuth");


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
    store: store
}));

app.use((req, res, next) => {
    res.locals.url = req.path;

    res.locals.isLoggedIn = req.session.isLoggedIn;

    next();
});

app.use(authRouter);
app.use("/host", isAuth,hostRouter);
app.use("/", userRouter);

app.use(errorController.pageNotFound);


dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
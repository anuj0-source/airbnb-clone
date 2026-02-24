const express = require("express");
const path = require("path");
const rootpath = require("./utils/pathUtil");
const methodOverride = require("method-override");
const {mongoConnect}=require("./utils/database");

const PORT = 3000;
const { userRouter } = require("./routes/user.route");
const { hostRouter } = require("./routes/host.route");

const errorController = require("./controllers/errors.controller");


const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(rootpath, 'public')));
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.url = req.path;
    next();
});

app.use("/host", hostRouter);
app.use("/", userRouter);

app.use(errorController.pageNotFound);

async function startServer() {
    try {
        await mongoConnect();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        return err;
    }
}

startServer();
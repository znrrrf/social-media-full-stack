const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use


app.get("/", (req, res) => {
    res.status(200).send({
        message: "this is my api"
    });
});

const { userRouters, authRouters, contentRouters } = require("./routers");
app.use("/user", userRouters);
app.use("/auth", authRouters);
app.use('/content', contentRouters);
app.use('/assets', express.static('assets'))


app.listen(process.env.PORT, () => {
    console.log(`api is running on port: ${process.env.PORT}...`);
})
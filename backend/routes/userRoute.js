const router = require("express").Router();
const { Pin, User } = require("../db/schema");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/auth");

router.get("/", (req, res) => {
    res.json({ message: "Helllo" });
});

router.post("/login", async (req, res) => {
    const { username, name, image } = req.body;
    if (!username) {
        return res.status(400).send({ error: "Bad request" });
    }
    let logUser = await User.findOne({ username });
    if (!logUser) {
        logUser = await User.create({ username, name, image });
    }
    let token = jwt.sign({ id: logUser._id, username }, process.env.JWT_SECRET_KEY, {
        expiresIn: "10d",
    });
    return res.send({ message: "Logged in", token });
});

router.get("/getPin", async (req, res) => {
    let pins;
    if (req.query.categoryId) {
        pins = await Pin.find({ category: req.query.categoryId }).populate('savePost');
    } else {
        pins = await Pin.find({}).populate('savePost');
    }
    res.send({ pins });
});

router.post("/createPin", async (req, res) => {
    const pin = await Pin.create({ ...req.body });
    res.send({ pin });
});

router.get("/me", authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    // console.log(typeof())
    return res.send({ user });
});

router.post("/savePin", authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    const pin = await Pin.findById(req.body.pid);
    pin.savePost.push(user)
    pin.save()
    res.send({messgae:"Saved"})
})
module.exports = router;

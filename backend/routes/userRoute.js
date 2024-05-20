const router = require("express").Router();
const { Pin, User } = require("../db/schema");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/auth");

const getUser = async (userId) => {
    const user = await User.findById(userId);
    return user
}

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
        pins = await Pin.find({ category: req.query.categoryId }).populate('postedBy savePost');
    } else {
        pins = await Pin.find({}).populate('postedBy savePost');
    }
    res.send({ pins });
});

router.post("/createPin", authenticate, async (req, res) => {
    const usr = await getUser(req.userId)
    const data = { ...req.body, 'postedBy': usr }
    const pin = await Pin.create(data);
    res.send({ pin });
});

router.get("/me", authenticate, async (req, res) => {
    return res.send({ 'user': await getUser(req.userId) });
});

router.post("/savePin", authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    const pin = await Pin.findById(req.body.pid);
    pin.savePost.push(user)
    pin.save()
    res.send({ messgae: "Saved" })
})

router.get("/pin/:pinId", authenticate, async (req, res) => {

    const pin = await Pin.findById(req.params.pinId).populate('postedBy comment');
    if (pin) {
        return res.send({ pin })
    }
    res.status(404).send({ error: "Not Found" })
})
router.post("/deletepin/:pinId", authenticate, async (req, res) => {
    const pin = await Pin.findByIdAndDelete(req.params.pinId)
    console.log(pin)
    res.send({ message: "Deleted" })
})
module.exports = router;

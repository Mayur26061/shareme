const router = require("express").Router();
const { Pin, User, Comment } = require("../db/schema");
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
    return res.send({ message: "Logged in", token,uid:logUser._id });
});

router.get("/getPin", async (req, res) => {
    const cat = req.query.categoryId ? { category: req.query.categoryId } : {}
    const pins = await Pin.find(cat).populate('postedBy savePost');
    res.send({ pins });
});

router.post("/createPin", authenticate, async (req, res) => {
    const usr = await getUser(req.userId)
    const data = { ...req.body, 'postedBy': usr }
    const pin = await Pin.create(data);
    res.send({ pin });
});

router.get("/getuser/:userId", authenticate, async (req, res) => {
    const user = await getUser(req.params.userId)
    return res.send({ user });
});

router.post("/savePin", authenticate, async (req, res) => {
    const user = await getUser(req.userId);
    const pin = await Pin.findById(req.body.pid);
    pin.savePost.push(user)
    await pin.save()
    res.send({ messgae: "Saved" })
})

router.get("/pin/:pinId", authenticate, async (req, res) => {

    const pin = await Pin.findById(req.params.pinId).populate([
        {
            path: 'comment',
            populate: [{ path: 'postedBy' }]
        },
        {
            path: 'postedBy',
        }
    ]);
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

router.post("/addcomment/:pinId", authenticate, async (req, res) => {
    const user = await getUser(req.userId);
    const pin = await Pin.findById(req.params.pinId);
    const { comment } = req.body
    const com = await Comment.create({ comment, postedBy: user })
    pin.comment.push(com)
    await pin.save()
    res.send({ message: "Added comment" })
})

module.exports = router;

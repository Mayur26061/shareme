const router = require("express").Router();
const { Pin, User, Comment } = require("../db/schema");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/auth");

const getUser = async (userId) => {
    const user = await User.findById(userId);
    return user
}
const getPins = async (query) => {
    const pin = await Pin.find(query).populate('postedBy savePost');
    return pin
}

router.get("/", (req, res) => {
    res.json({ message: "Helllo" });
});

router.post("/login", async (req, res) => {
    const { username, name, image } = req.body;
    if (!username) {
        return res.status(400).send({ error: "Bad request" });
    }
    try {
        let logUser = await User.findOne({ username });
        if (!logUser) {
            logUser = await User.create({ username, name, image });
        }
        let token = jwt.sign({ id: logUser._id, username }, process.env.JWT_SECRET_KEY, {
            expiresIn: "10d",
        });
        return res.send({ message: "Logged in", token, uid: logUser._id });
    } catch (err) {
        return res.status(500).send({ error: err })
    }
});

router.get("/getPin", async (req, res) => {
    const cat = req.query.categoryId ? { category: req.query.categoryId } : {}
    try {
        const pins = await getPins(cat)
        res.send({ pins });
    }
    catch (err) {
        return res.status(500).send({ error: err })
    }
});

router.post("/createPin", authenticate, async (req, res) => {
    try {
        console.log(req.body)
        const usr = await getUser(req.userId)
        const data = { ...req.body, 'postedBy': usr }
        const pin = await Pin.create(data);
        res.send({ pin });
    } catch (err) {
        return res.status(500).send({ error: err })

    }
});

router.get("/getuser/:userId", authenticate, async (req, res) => {
    try {
        const user = await getUser(req.params.userId)
        return res.send({ user });
    } catch (err) {
        return res.status(500).send({ error: err })

    }
});

router.post("/savePin", authenticate, async (req, res) => {
    try {
        const user = await getUser(req.userId);
        const pin = await Pin.findById(req.body.pid);
        pin.savePost.push(user)
        await pin.save()
        res.send({ messgae: "Saved" })
    }
    catch (err) {
        return res.status(500).send({ error: err })

    }
})

router.get("/pin/:pinId", authenticate, async (req, res) => {
    try {
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
    }
    catch (err) {
        return res.status(500).send({ error: err })

    }
    res.status(404).send({ error: "Not Found" })
})

router.post("/deletepin/:pinId", authenticate, async (req, res) => {
    try {
        await Pin.findByIdAndDelete(req.params.pinId)
        await Comment.deleteMany({ pinId: req.params.pinId })
        res.send({ message: "Deleted" })
    }
    catch (err) {
        return res.status(500).send({ error: err })
    }
})

router.post("/addcomment/:pinId", authenticate, async (req, res) => {
    try {
        const user = await getUser(req.userId);
        const pin = await Pin.findById(req.params.pinId);
        const { comment } = req.body
        const com = await Comment.create({ comment, postedBy: user, pinId: pin._id })
        pin.comment.push(com)
        await pin.save()
        res.send({ message: "Added comment" })
    }
    catch (err) {
        return res.status(500).send({ error: err })
    }
})

router.get("/getUserPin/:userId", authenticate, async (req, res) => {
    let query = {}
    query[req.query.key] = req.params.userId // postedBy or savePost
    try {
        const pins = await getPins(query)
        res.send({ pins });
    }
    catch (err) {
        return res.status(500).send({ error: err })

    }
});

router.get("/search", async (req, res) => {
    const searchReg = { $regex: '.*' + req.query.search + '.*' }
    const query = { $or: [{ title: searchReg }, { category: searchReg }, { name: searchReg }] }
    try {
        const pins = await getPins(query)
        res.send({ pins });
    }
    catch (err) {
        return res.status(500).send({ error: err })
    }
})

router.post("/editProfile/:userID", authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userID, { ...req.body }, { new: true })
        return res.send({ user })
    }
    catch (err) {
        return res.status(500).send({ error: err })
    }
})

module.exports = router;

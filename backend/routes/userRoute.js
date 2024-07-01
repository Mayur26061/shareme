const router = require("express").Router();
const { Pin, User, Comment } = require("../db/schema");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/auth");
const z = require("zod")

const userEditOject = z.object({
    name: z.string().optional(),
    image: z.string().url().optional(),
})
const userVal = useredit.extend({
    username: z.string().min(5),
})
const pinVals = z.object({
    title: z.string(),
    destination: z.string().url(),
    category: z.string(),
    name: z.string(),
    image: z.string().url(),
})

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
    const parsedInput = userVal.safeParse(req.body)
    if (!parsedInput.success) {
        const message = parsedInput.error.issues
            .map(data => data.message)
            .join('.')
        return res.status(411).json({ error: message })
    }
    const { username, name } = parsedInput.data
    if (!username) {
        return res.status(400).send({ error: "Bad request" });
    }
    try {
        let logUser = await User.findOne({ username });
        if (!logUser) {
            logUser = await User.create({ username, name });
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
    const parsedInput = pinVals.safeParse(req.body)
    if (!parsedInput.success) {
        console.log(parsedInput.error.issues)
        const message = parsedInput.error.issues
            .map(data => data.message)
            .join('.')
        return res.status(411).json({ error: message })
    }
    try {
        const usr = await getUser(req.userId)
        const data = { ...parsedInput.data, 'postedBy': usr }
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
    const parsedInput = z.string().safeParse(req.body.pid)
    if (!parsedInput.success) {
        return res.status(411).json({ error: parsedInput.error.message })
    }
    try {
        const user = await getUser(req.userId);
        const pin = await Pin.findById(parsedInput.data);
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
    const parsedInput = z.string().safeParse(req.body.comment)
    if (!parsedInput.success) {
        return res.status(411).json({ error: parsedInput.error.issues[0].message })
    }
    try {
        const user = await getUser(req.userId);
        const pin = await Pin.findById(req.params.pinId);
        const { comment } = parsedInput.data
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
    const parsedInput = useredit.safeParse(req.body)
    if (!parsedInput.success) {
        const message = parsedInput.error.issues
            .map(data => data.message)
            .join('.')
        return res.status(411).json({ error: message })
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.userID, { ...parsedInput.data }, { new: true })
        return res.send({ user })
    }
    catch (err) {
        return res.status(500).send({ error: err })
    }
})

module.exports = router;

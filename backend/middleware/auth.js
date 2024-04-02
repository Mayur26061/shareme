const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const { token } = req.headers;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) {
                return res.status(403).send({ error: "Forbidden" });
            }
            req.userId = data.id;
            next();
        });
    } else {
        res.status(403).send({ error: "Unauthorized" });
    }
};

module.exports = authenticate;

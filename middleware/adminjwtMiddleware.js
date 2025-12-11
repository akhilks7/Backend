const jwt = require("jsonwebtoken")

const adminjwtMiddleware = (req, res, next) => {
    console.log(`inside jwt adminjwtMiddleware`);
    const token = req.headers.authorization.split(" ")[1]
    // const token = req.headers.authorization.replace('Bearer ', '')

    console.log(token);
 
    try {
        const jwtResponse = jwt.verify(token, process.env.JWTsecretkey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        req.role=jwtResponse.role
        if (jwtResponse.role=='admin') {
            next()
        } else {
            res.status(401).json(`unauthorized user`)
        }
        

    } catch (err) {
        res.status(401).json(`invalid token`, err)
    }

}

module.exports = adminjwtMiddleware 
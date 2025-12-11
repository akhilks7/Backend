const users = require("../model/userModel");
const jwt = require("jsonwebtoken")

exports.registercontroller = async (req, res) => {
    console.log("inside register controller");
    const { username, email, password } = req.body
    console.log(username, email, password);

    //logic
    try {
        const existinguser = await users.findOne({ email: email })
        if (existinguser) {
            res.status(404).json("user already exists...please login!!!..")
        } else {
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }

    // res.status(200).send("register request resived")
}

exports.loginController = async (req, res) => {
    console.log(`inside login controller`);
    const { password, email } = req.body
    console.log(email, password);
    // console.log(req);
    try {
        const existinguser = await users.findOne({ email })
        if (existinguser) {
            if (existinguser.password != password) {
                res.status(401).json(`wrong password`)
            } else if (existinguser.password == password) {
                const tocken = jwt.sign({ userMail: existinguser.email, role: existinguser.role }, process.env.JWTsecretkey)
                res.status(200).json({ existinguser, tocken })
            }
            else {
                res.status(401).json(`invalid credentials`)
            }
        } else {
            res.status(404).json(`user not found ,,please resgister`)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.googleLoginController = async (req, res) => {
    console.log(`inside googleLoginController`);
    const { password, email, username, profile } = req.body
    console.log(password, email, username, profile);
    // console.log(req);
    try {
        const existinguser = await users.findOne({ email })
        if (existinguser) {
            const tocken = jwt.sign({ userMail: existinguser.email, role: existinguser.role }, process.env.JWTsecretkey)
            res.status(200).json({ existinguser, tocken })
        } else {
            const newUser = new users({
                password, email, username, profile
            })
            await newUser.save()
            const tocken = jwt.sign({ userMail: newUser.email, role: existinguser.role }, process.env.JWTsecretkey)
            res.status(200).json({ existinguser: newUser, tocken })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//  update user profile

exports.editProfileController = async (req, res) => {
    console.log(`inside edit controller`);
    // get data
    const { username, password, bio, role, profile } = req.body
    const email = req.payload
    console.log(username, password, bio, role);
    const uploadprofile = req.file ? req.file.filename : profile
    console.log(uploadprofile);
    try {
        const updateUser = await users.findOneAndUpdate({ email }, { username, password, bio, role, profile: uploadprofile, email }, { new: true })
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }

}

// -----------------------------admin-------------------------------------

// get all users

exports.getallAdminUsersController = async (req, res) => {
    console.log(`inside getallAdminUsers`);
    const usermail = req.payload
    console.log(usermail);

    try {
        const Adminusers = await users.find({ email: { $ne: usermail } })
        res.status(200).json(Adminusers)
    } catch (error) {
        res.status(400).json(error)
    }

}

// update admin profile

exports.UpdateAdminProfileController = async (req, res) => {
    console.log(`inside UpdateAdminProfileController`);

    const { username, password, role, profile } = req.body
    const email = req.payload
    console.log(username, password, role);
    const uploadprofile = req.file ? req.file.filename : profile
    console.log(uploadprofile);
    try {
        const updateUser = await users.findOneAndUpdate({ email }, { username, password, role, profile: uploadprofile, email }, { new: true })
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(404).json(error)

    }
}
const books = require("../model/bookModel");
const stripe = require('stripe')(process.env.StripeSecretKey);

exports.addBookController = async (req, res) => {
    console.log(`inside the addBookController`);
    const { title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category } = req.body
    console.log(title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category);

    var uploadImages = []

    req.files.map((items) => uploadImages.push(items.filename))
    console.log(uploadImages);

    const usermail = req.payload
    console.log(usermail);

    // console.log(req.files);

    try {
        const existingbook = await books.findOne({ title, usermail })
        if (existingbook) {
            res.status(401).json(`book alrready exists`)
        } else {
            const newBook = new books({
                title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, usermail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

// get home books 

exports.homeBookController = async (req, res) => {
    console.log(`inside the homeBookController`);
    try {
        const homebooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homebooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all books 

exports.getallBookController = async (req, res) => {
    console.log(`inside the getallBookController`);
    const usermail = req.payload
    const searchkey = req.query.search
    // console.log(req);

    const query = {
        title: { $regex: searchkey, $options: "i" },
        usermail: { $ne: usermail },
        status: { $ne: sold }
    }
    try {
        const allbooks = await books.find(query)
        res.status(200).json(allbooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get selected book

exports.getsSelectedBookController = async (req, res) => {
    console.log(` inside selected book the controller`);
    const { id } = req.params
    console.log(id);
    
    try {
        const book = await books.findById({ _id: id })
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get own Book

exports.getOwnBookController = async (req, res) => {
    console.log(`inside the getOwnBookController`);
    const usermail = req.payload

    // console.log(req);

    const query = {
        usermail: { $eq: usermail }
    }
    try {
        const ownbooks = await books.find(query)
        res.status(200).json(ownbooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteUserAddedBookController = async (req, res) => {
    console.log(`inside deleteUserAddedBookController`);
    const { id } = req.params
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json(`Book deleted sucesfully`)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get  Book history / brought by

exports.getBookHistoryController = async (req, res) => {
    console.log(`inside the getBookHistoryController`);
    const usermail = req.payload

    // console.log(req);

    const query = {
        boughtBy: { $eq: usermail }
    }
    try {
        const bookIhstory = await books.find(query)
        res.status(200).json(bookIhstory)
    } catch (error) {
        res.status(500).json(error)
    }
}

// ------------------admin-------------------------

exports.getallAdminBookController = async (req, res) => {
    console.log(`inside the getallAdminBookController`);
    // console.log(req);
    try {
        const allbooks = await books.find()
        res.status(200).json(allbooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updateadminBookController = async (req, res) => {
    console.log(`inside updateadminBookController`);
    const { id } = req.params
    try {
        const updatedBook = await books.findByIdAndUpdate(id, { status: "approved" }, { new: true })
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(`updated sucesfully ${updatedBook}`)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.makeBookPaymentController = async (req, res) => {
    console.log(`inside makeBookPaymentController`);
    const {_id, title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages,userMail } = req.body
    const email = req.payload
    if (!req.body || !_id) {
    return res.status(400).json({ message: "Request body or book ID missing" });
}
    
    try {
        const updatebookPayment = await books.findByIdAndUpdate({ _id }, { title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, status: "sold", boughtBy: email,userMail }, { new: true })
        console.log(updatebookPayment);

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: [imageUrl],
                    metadata: { title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, status: "sold", boughtBy: email,userMail }
                },
                unit_amount: Math.round(dprice * 100)
            },
            quantity: 1

        }]

        const session = await stripe.checkout.sessions.create({
            // success_url: 'http://localhost:5173/payment-success',
            // cancel_url: 'http://localhost:5173/payment-error',
            success_url: 'https://book-store-frontend-zeta-jade.vercel.app/payment-success',
            cancel_url: 'https://book-store-frontend-zeta-jade.vercel.app/payment-error',
            line_items: line_items,
            mode: 'payment',
            payment_method_types:["card"]
        });
        console.log(session);
        res.status(200).json({checkoutSessionurl:session.url})

    } catch (error) {
        console.log(error);

    }

}

exports.makeBookPaymentController = async (req, res) => {

    console.log(`Inside Make Payment Controller`);
const userMail = req.payload
    console.log(userMail);
    console.log(req);
    
    const { _id, title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages } = req.body

    
    
    try {
        const updateBookPayment = await books.findByIdAndUpdate({ _id }, { title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, status: "sold", boughtBy: userMail }, { new: true })
        console.log(updateBookPayment);
        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: [imageUrl],
                    metadata: {
                        title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, status: "sold", boughtBy: userMail
                    }
                },
                unit_amount: Math.round(dprice * 100)
            },
            quantity: 1
        }]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/payment-success',
            cancel_url: "http://localhost:5173/payment-error",

        });
        console.log(session);
        res.status(200).json({ checkoutSessionUrl: session.url })
        // res.status(200).json("Success response received")
    }catch (error) {
        res.status(500).json(error)
    }
}
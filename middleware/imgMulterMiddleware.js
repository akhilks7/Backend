// const multer = require("multer")

// const storage = multer.diskStorage({
//     destination: (res, file, cb) => {
//         cb(null, "./uploadImages")
//     },
//     filename:(req, file, cb) => {
//         cb(null,`Image-${Date.now()}-${file.originalname}`)
//     }
// })

// const fileFilter=(req, file, cb)=>{
//     if (file.mimetype=='image/jpg'||file.mimetype=='image/png'||file.mimetype=='image/jpeg') {
//         cb(null,true)
//     } else {
//         cb(null,false)
//         return cb(new Error("Accept only jpg, png and jpeg files"))
//     }
// }

// const multerConfig=multer({
//     storage,
//     fileFilter
// })

// module.exports =multerConfig


const multer = require('multer')

const storage = multer.diskStorage({
    destination: (res, file, cb) => {
        cb(null,"./uploadImages")
    },
    filename: (req, file, cb) => {
        cb(null,`Image - ${Date.now()}-${ file.originalname }`)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
        return cb(new Error ("Accepts only png, jpg and jpeg files"))
    }
}

const multerConfig = multer({
    storage, 
    fileFilter
})

module.exports = multerConfig
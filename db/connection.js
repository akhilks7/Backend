

const mongoose = require("mongoose")

const connectionstring = process.env.DATABASE

mongoose.connect(connectionstring).then(res=>{
    console.log(`mongo db connectedd sucessfully`);
    
}).catch(err=>{
    console.log(`error connecting due to : ${err}`);
    
})
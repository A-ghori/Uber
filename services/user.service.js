const userModel = require ('../models/user.model')

module.exports.createUser = async ({
    firstname , lastname, password , email 
})  => {
    if (!firstname || !email || !password){
        throw new Error ('ALl Fields Are Required for login Sucessfully')
    }

//This user create a new user before creating new user it checks all the info from db and compare with frontend that all the info's are correct 
const user = await userModel.create ({

fullname : {
    firstname,
    lastname,
},
email,
password
});
return user;
}


const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    let hashed = bcrypt.hash(password, salt)
    console.log(hashed)
}

exports.hashPassword = hashPassword
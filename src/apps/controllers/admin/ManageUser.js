const { func } = require("@hapi/joi")
const mongoose = require("mongoose")

const User = mongoose.model("User")
const Product = mongoose.model("Product")
const Room = mongoose.model("Room")

module.exports.manageruser = async function (req, res) {
    const page = parseInt(req.query.page)
    const limit = 5
    const skip = (page - 1) * limit

    const totalDocuments = await User.find().countDocuments()

    const totalPages = Math.ceil(totalDocuments / limit)
    const range = []
    const rangerForDot = []
    const deltal = 2

    const left = page - deltal
    const right = page + deltal
    //console.log(right)
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
            range.push(i)
        }
    }

    let temp
    range.map((i) => {
        if (temp) {
            if (i - temp === 2) {
                rangerForDot.push(i - 1)
            } else if (i - temp !== 1) {
                rangerForDot.push("...")
            }
        }
        temp = i
        //console.log("temp", temp)
        rangerForDot.push(i)

    })

    const users = await User.find().collation({ locale: "en_US", numericOrdering: true })
        .limit(limit).skip(skip)

    res.render("admin/pages/manageuser", {
        users,
        range: rangerForDot,
        page,
        totalPages,
    })
}
module.exports.deleteuser = async function (req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.redirect("/admin/user")
    }
    await User.findByIdAndDelete(id)
    await Product.deleteMany({
        user_id: id
    })
    await Room.deleteMany({
        users: {
            $all: [id]
        }
    })
    return res.redirect("/admin/user")
}




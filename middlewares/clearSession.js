module.exports = (req, res, next) => {

    req.session.err = null
    next()

}


export default  function Auth(req, res , next) {

console.log("middleware auth")

    next()
}
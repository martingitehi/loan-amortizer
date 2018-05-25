//this module checks for authorization header in incoming requests and uses the next()
//middleware depending on the presence or absence of the header

let guard = (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        if (token !== null && token !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (req.headers.authorization == null) {
        return false;
    }
    else {
        return false;
    }
    next()
}

module.exports = guard;
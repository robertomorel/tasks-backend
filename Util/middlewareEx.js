function hello(name){
    return (req, res, next) => {
        console.log(`Welcome to this page ${name}!`);
        return next();
    }
}

module.exports = hello;
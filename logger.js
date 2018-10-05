//custom middleware function

function log (req,res,next){
    console.log('Logging...');
    next(); //passing control to next middleware function
}

module.exports = log;

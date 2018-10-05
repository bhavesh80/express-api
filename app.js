const express = require('express')
const joi = require('joi');
const logger = require('./logger');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:startup');
// const dbDebugger = require('debug')('app:db');

//getting environment //dev / production 
// console.log(`${process.env.NODE_ENV}`);
// console.log(`${app.get('env')}`); //another method to get environment //production or development 

//setting template engine
app.set('view engine','pug');
app.set('views','./views'); //default path

app.use(express.json());
app.use(express.urlencoded({extended :true}));
app.use(express.static('public'));
app.use(helmet());

//configuration

console.log('Application Name:'+config.get('name'));
console.log('Mail Server:'+config.get('mail.host'));
// console.log('Mail password:'+config.get('mail.password'));


//logging http request if env === development 
if(app.get('env') === 'development'){
    app.use(morgan('tiny')); //logging of http request
    debug('Morgan enabled');
}

app.use(logger);

const courses = [
    {id :1,name:'java'},
    {id :2,name:'javascript'},
    {id :3,name:'python'}
];

app.get('/',(req,res) =>{
    res.render('index',{title :"My Express App",message :'Hello'}); //using pug engine
});

app.get('/api/courses',(req,res) =>{
    res.send(courses);
});

app.post('/api/courses',(req,res) =>{

    const schema ={
        name : joi.string().min(3).required()
    };
    const result = joi.validate(req.body, schema);
    // console.log(result);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return ;
    }

    let course = {
        id : courses.length + 1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id',(req,res)=>{
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given id was not found');
    
    const {error} = validateCourse(req.body);

    if(error){
        res.status(400).send(result.error.details[0].message);
        return ;
    }

    course.name = req.body.name;
    res.send(course);

});


app.delete('/api/courses/:id',(req,res) =>{
    //lookup the course
    //not existing ,return 404
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given id was not found');
    

    //delete
    const index  = courses.indexOf(course);
    courses.splice(index,1);

    //return the same course
    res.send(course);
});


app.get('/api/courses/:id',(req,res)=>{
    // res.send(req.params);
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given id was not found');
    res.send(course);

    // const result = validateCourse(req.body);
});

function validateCourse(course){
    const schema ={
        name : joi.string().min(3).required()
    };
    return joi.validate(course, schema);

}


const port = process.env.PORT || 3000 ;

app.listen(port,() => console.log(`Listening on port ${port}`));
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const morgan = require("morgan");
const app = express();
var path = require('path');
const multer = require('multer');
const mongoose = require("mongoose");
require('dotenv').config({path : './env'});
//requried routers
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const audioRouter = require("./routes/audio.route");
  
//datebase connection
mongoose.connect(process.env.HOST,{
  useNewUrlParser : true,
  useUnifiedTopology : true,
});
mongoose.connection
.once('open', () => console.log('DB connect'))
.on('error', () => console.log('not connect with db'))

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/",(req,res) =>{
    res.send("Welcome to Happy Hearts");
});


//routers
app.use('/user',userRouter);
app.use("/admin",adminRouter);
app.use("/audio",audioRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT, () => {
    console.log("listening");
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
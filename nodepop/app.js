import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import connectMongoose from "./lib/connectMongoose.js";
import * as homeController from './controllers/homeController.js';
import * as loginController from './controllers/loginController.js';
import * as sessionManager from './lib/sessionManager.js';
import * as productController from './controllers/productsController.js'


await connectMongoose();
console.log('Connected to MongoDB.');

var app = express();

// view engine setup
app.set('views','views');
app.set('view engine', 'html');
app.engine('html', (await import('ejs')).__express);

app.locals.appName = 'NodePop';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));


//  application routes
app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);
app.get('/', homeController.index);
app.get('/login', loginController.index);
app.post('/login', loginController.postLogin);
app.get('/logout', loginController.logout);
app.get('/products/new', productController.index);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

export default app;

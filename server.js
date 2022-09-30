const session = require("express-session");
const passport = require("passport"); 
const cookieParser = require("cookie-parser");

const express = require('express');
const router = require('./routes');

const { options } = require("./options/messagesDB");
const knexChat = require("knex")(options);

const { optionsProducts } = require("./options/productsDB");
const knexProducts = require("knex")(optionsProducts);

const messagesController = require('./controllers/messages');
const messages = new messagesController(knexChat, 'messages');

const productsController = require('./controllers/products');
const products = new productsController(knexProducts, 'products');

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const uri = "mongodb+srv://fimposti:CoderHouse27@hms.i5ds7.mongodb.net/?retryWrites=true&w=majority";

const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');

try {
    mongoose.connect(uri);
    console.log('Successful database connection');
  } catch (err) {
    throw new Error('Ocurrió un error al conectarse a la base de datos.', err);
}

const advanceOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(cookieParser());

app.use(
    session({
        store: new MongoStore({ 
            mongoUrl: uri,
            mongoOptions: advanceOptions   
        }),     
        secret: "coderhouse",
        resave: true,
        saveUninitialized: true,
        rolling: true,
        cookie: { maxAge: 60000 },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

 io.on('connection', async function(socket) {
    console.log('Un cliente se ha conectado');

    socket.emit('products', await productsController.getAllFaker());
    socket.emit('messages', await messages.getAll());

    socket.on('new-message', async (data) => {
        await messages.save(data);
        io.sockets.emit('messages', await messages.getAll());
    });

    socket.on('new-product', async (data) => {
        await products.save(data);
        io.sockets.emit('products', await products.getAll());
    });
});

httpServer.listen(8080, () => {
    console.log("server on port 8080");;
})

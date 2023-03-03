const { users, writeUsersJson } = require("../database");
const { validationResult } = require("express-validator");
module.exports = {
    login: (req, res) => {
        res.render("login", { session: req.session })
    },
    processLogin: (req, res) => {
        /* 1) Verificamos que las validaciones esten bien */
        let errors = validationResult(req);

        /* EN EL CASO DE QUE ESTEN BIEN ME EJECUTA ESTE CODIGO */
        if (errors.isEmpty()) {

            let user = users.find(user => user.email === req.body.email);
            /* me inicia la sesion: EN LA VAR GLOBAL DE SESSION ME GUARDA LOS DATOS EL USUARIO QUE INICO SESSION */
            req.session.user = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                rol: user.rol
            }

            let tiempoDeVidaCookie = new Date(Date.now() + 60000)
            /* validacion de si el usuario quiere guardar la sesion */
            if(req.body.remember) {
                res.cookie("userArtisticaDali",
                 req.session.user, 
                 {
                    expires: tiempoDeVidaCookie, /* new Date(Date.now() + 60000), */
                    httpOnly: true
                 } )
            }

            /* Me guarda en locals tdos los datos que queden guardados en esa session por las dudas en una var despues */
            res.locals.user = req.session.user;

            res.redirect("/");
        } else {
            return res.render("login", {
                errors: errors.mapped(),
                session: req.session
            })
        }
    },
    register: (req, res) => {
        res.render("register", {session: req.session})
    },
    processRegister: (req, res) => {
        let errors = validationResult(req);

        if(errors.isEmpty()) {
            let lastId = 0;

            users.forEach(user => {
             if(user.id > lastId) {
                 lastId = user.id;
             }
            });
     
            let newUser = {
             id: lastId + 1,
             name: req.body.name,
             last_name: req.body.last_name,
             email: req.body.email,
             pass: req.body.pass1,
             avatar: req.file ? req.file.filename : "default-image.png",
             rol: "USER",
             tel: "",
             address: "",
             postal_code: "",
             province: "",
             city: ""
            };
     
            users.push(newUser);
     
            writeUsersJson(users);
     
            res.redirect("/users/login")
        } else {
            res.render("register", {
                errors: errors.mapped(),
                old: req.body,
                session: req.session
            })
        }
      
    },
    /* tenemos que eliminar la sesion para ejecutar el metodo y si exxiste una cookie tambien eliminarla. Es decir cada vez que cerramos */
    logout:(req,res) => {
        req.session.destroy();
        if(req.cookies.userArtisticaDali) { /*  si existe esta cokkie entonces  */
            res.cookie("userArtisticaDali", "", {maxAge: -1})/* eliminala. maxage me borra los datos guardados y al ponerle el -1 me la mata*/
        }

        res.redirect("/");

    }
}
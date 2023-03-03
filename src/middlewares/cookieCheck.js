module.exports = (req, res, next) => { /* next es quien pasa su trabajo al sig middleware */
    if(req.cookies.userArtisticaDali) {/* si existe esta cockie */
        
        req.session.user = req.cookies.userArtisticaDali;/* levanta session */
        res.locals.user= req.session.user;/* y guara los datos en locals  */
    }
    next();
}

/* va apregutnar si exites esta cookie ejecuta eso, pero sino existe igual ejectua el next. Pasa al sigueinte paso */
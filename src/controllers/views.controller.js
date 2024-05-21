class ViewsController {
        // Renderiza la vista de Admin
        static renderLogin(req, res) {
            res.render("Admin");
        }

    // Renderiza la vista de login
    static renderLogin(req, res) {
        res.render("login");
    }

    // Renderiza la vista de registro
    static renderRegister(req, res) {
        res.render("register");
    }

    // Renderiza la vista de sucursales
    static renderSucursales(req, res) {
        res.render("sucursales");
    }

    // Renderiza la vista del carrito
    static renderCart(req, res) {
        res.render("cart");
    }

    static renderCart(req, res) {
        res.render("cartNoUser");
    }

    // Renderiza la vista de actualización de contraseña
    static renderUpdatePassword(req, res) {
        res.render("updatePassword");
    }

    // Renderiza la vista principal (home)
    static renderHome(req, res) {
        res.render("home", {
            products: manejadorProductos.getProducts(),
            user: req.user
        });
    }

    //Renderiza la vista del pago exitoso
    static renderRegister(req, res) {
        res.render("success");
    }

    // Renderiza la vista de error
    static renderError(req, res) {
        res.render("error");
    }

    // Renderiza la vista de productos en tiempo real
    static renderRealtimeProducts(req, res) {
        res.render("realtimeproducts");
    }

    // Renderiza la vista de chat
    static renderChat(req, res) {
        res.render("chat");
    }

    // Renderiza la vista del carrito con un ID específico
    static async renderCartById(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartDao.findCartByUserId(cid);
            if (!cart) {
                return res.render("error", { message: "Carrito no encontrado" });
            }

            const cartItems = cart.items;
            res.render("cart", { cartItems });
        } catch (error) {
            console.error(error);
            res.render("error", { message: "Error al obtener el carrito" });
        }
    }

    // Setea una cookie
    static setCookie(req, res) {
        res.cookie('CooderCookie', 'Esta es una cookie con firma!!', { maxAge: 20000, signed: true }).send('Cookie asignada con exito!')
    }

    // Obtiene una cookie
    static getCookie(req, res) {
        res.send(req.signedCookies)
    }

    // Elimina una cookie
    static deleteCookie(req, res) {
        res.clearCookie('CooderCookie').send('Cookie borrada con exito!!')
    }

    // Maneja la sesión
    static handleSession(req, res) {
        if (req.session.counter) {
            req.session.counter++;
            res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
        } else {
            req.session.counter = 1;
            res.send('Bienvenido!');
        }
    }

    // Cierra la sesión
    static logout(req, res) {
        req.session.destroy(error => {
            if (error) {
                res.json({ error: 'Error logout', msg: "Error al cerrar la session" })
            }
            res.send('Session cerrada con exito!')
        })
    }

    // Maneja el login
    /*static login(req, res) {
        const { username, password } = req.query;
        if (username != 'mati' || password !== 'mati123') {
            return res.status(401).send("Error de Login, usuario o contraseña incorrecta.");
        } else {
            req.session.user = username;
            req.session.admin = true;
            res.send('Login exitoso!!')
        }
    }*/

    // Renderiza la vista privada
    static renderPrivate(req, res) {
        res.send('Si estas viendo esto es porque estas autorizado!');
    }

    // Renderiza la vista de login con GitHub
    static renderGithubLogin(req, res) {
        res.render("github-login");
    }

    // Renderiza la vista de error de login con GitHub
    static renderGithubError(req, res) {
        res.render("error", { error: "No se pudo autenticar usando GitHub!" });
    }
}

export default ViewsController;

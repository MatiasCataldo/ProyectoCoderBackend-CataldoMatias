import passport from 'passport';
import userModel from '../dao/models/user.model.js';
import jwtStrategy from 'passport-jwt';
import passportLocal from 'passport-local';
import GitHubStrategy from 'passport-github2';
import googleStrategy from "passport-google-oauth20"
import { PRIVATE_KEY, createHash } from '../utils.js';
import { enviarCorreoBienvenida } from '../controllers/email.controller.js'
import { addLogger } from "./logger_CUSTOM.js";
import config from './config.js';
import { CartService, UserService } from '../services/service.js';
import cartModel from '../dao/models/cart.model.js';

const GoogleStrategy = googleStrategy.Strategy;
const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;
const logger = addLogger;
const cookieSecret = process.env.COOKIE_SECRET;



const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.jwtCookieToken;
    } else{
        
    }
    return token;
};

const initializePassport = () => {
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    // GITHUB
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.3809f01a7b3c6013',
            clientSecret: '680cc4c10f7b5b25b3f88d8664976302d26f49a4',
            callbackUrl: 'http://localhost:8080/api/jwt/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await userModel.findOne({ email: profile._json.email });
                if (!user) {
                    const createdCart = await CartService.createNewCart();
                    const cartId = createdCart._id;
                    
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: 'Usuario GitHub',
                        age: 28,
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub",
                        cartId: cartId
                    }
                    const result = await UserService.create(newUser);
                    await cartModel.findByIdAndUpdate(cartId, { userId: result._id });
                    return done(null, user)
                } else {
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }
        ))
        
        // GOOGLE
        passport.use('google', new GoogleStrategy(
            {
            clientID: 'GOOGLE_CLIENT_ID',
            clientSecret: 'GOOGLE_SECRET',
            callbackURL: "GOOGLE_CALLBACK"
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await userModel.findOne({ email: profile._json.email });
                    if (!user) {
                        const cartItem = {};
                        const createdCart = await cartDao.createCartItem(user, cartItem);
                        
                        let newUser = {
                            first_name: profile._json.name,
                            last_name: 'Usuario Google',
                            age: 28,
                            email: profile._json.email,
                            password: '',
                            loggedBy: "Google",
                            cartId: createdCart._id
                        }
                        const result = await userModel.create(newUser);
                        return done(null, result)
                    } else {
                        return done(null, user)
                    }
                } catch (error) {
                    return done(error)
                }
            }
        ))
        
        // REGISTER
        passport.use('register', new localStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    const exist = await userModel.findOne({ email });
                    if (exist) {
                        done(null, false)
                    }

                    const createdCart = await CartService.createNewCart();
                    const cartId = createdCart._id;
                    const user = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        loggedBy: 'form',
                        cartId: cartId
                    }
                    const result = await UserService.create(user);
                    await cartModel.findByIdAndUpdate(createdCart._id, { userId: result._id });
                    await enviarCorreoBienvenida(user);
                    return done(null, result)
                } catch (error) {
                    return done(error)
                }
            }
    ));

    //SERIALIZACION Y DESERIALIZACION
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

export default initializePassport;

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { faker } from '@faker-js/faker';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CRYPTO FUNCTIONS
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

//JSON WEB Tokens FUNCTIONS
export const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '3600000' });
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: "User not authenticated or missing token." });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
        req.user = credentials.user;
        next();
    });
};

// ERRORS
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err){
                return next(err);
            } 
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};

 // AUTH
export const authorization = (allowedRoles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("No Autorizado: Usuario no encontrado en JWT")
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next();
    };
};


// GENERATE CODE
export function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;
    let code = '';
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

// FAKER
export const generateProduct = () => {
    const categorys = ['Helado', 'Bombones/Tortas'];
    const status = ['true', 'false'];
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.description,
        price: faker.commerce.price(),
        image: faker.image.url,
        stock: faker.string.numeric(),
        category: categorys[Math.floor(Math.random() * categorys.length)],
        status: status[Math.floor(Math.random() * status.length)]
    }
};

// CONFIGURACION MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadFolder = "img"; 
        if (file.fieldname === 'imgProfile') {
            uploadFolder = 'profiles';
        } else if (file.fieldname === 'imgProduct') {
            uploadFolder = 'products';
        } else if (file.fieldname === 'documents'){
            uploadFolder = 'documents';
        }
        cb(null, `${__dirname}/public/${uploadFolder}`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

export const upload = multer({
    storage,
    onError: function (err, next) {
        console.log(err);
        next();
    }
});

export default __dirname;

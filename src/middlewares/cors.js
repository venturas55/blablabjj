import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'https://localhost:8080',
    'http://localhost:4000',
    'https://localhost:4000',
    'http://localhost:7001',
    'https://localhost:7001',
    'http://adriandeharo.es',
    'https://adriandeharo.es',
    'http://adriandeharo.es:7001',
    'https//adriandeharo.es:7001',
];


export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} ={}) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin)) {
            return callback(null, true);
        }
        if(!origin){
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    }
});
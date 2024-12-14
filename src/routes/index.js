import { Router } from 'express';

export const indexRouter = Router();

indexRouter.get('/',(req,res)=>{
    res.render('index');
} );

indexRouter.get('/pagina_aux1',(req,res)=>{
    res.render('pagina_aux1');
} );
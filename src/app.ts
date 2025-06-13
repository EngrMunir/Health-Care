import express, { Application, Request, Response } from "express";
import cors from 'cors';
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app:Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req:Request, res:Response) =>{
    res.send({
        Message:"Health Care Server is running..."
    })
});

app.use('/api/v1', router);

app.use(globalErrorHandler)

export default app;
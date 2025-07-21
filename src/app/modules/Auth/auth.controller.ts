import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus, { status } from 'http-status';
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async(req:Request, res:Response)=>{
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken } = result;
    res.cookie('refreshToken',refreshToken, {
        secure:false,
        httpOnly:true
    });

    sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message:"Logged in successfully!",
        data:{
            accessToken:result.accessToken,
            needPasswordChange:result.needPasswordChange
        }
    })
});
const refreshToken = catchAsync(async(req:Request, res:Response)=>{
    const {refreshToken} = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message:"Access token created successfully!",
        data: result
        // data:{
        //     accessToken:result.accessToken,
        //     needPasswordChange:result.needPasswordChange
        // }
    })
});

const changePassword = catchAsync(async(req:Request & {user?:any}, res:Response)=>{
    
    // console.log(req.user, req.body);
    const user = req.user;

    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message:"Password changed successfully!",
        data: result
    })
});

const forgotPassword = catchAsync(async (req:Request, res:Response) =>{
    const result = await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
        statusCode:status.OK,
        success:true,
        message:'',
        data:result
    })
})

export const AuthController ={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword
}
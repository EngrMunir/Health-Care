import { UserStatus } from "../../../../generated/prisma";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma"
import * as bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status';

const loginUser = async(payload:{
    email:string,
    password:string
})=>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if(!isCorrectPassword){
        throw new Error('Password incorrect!');
    }

    const accessToken = jwtHelpers.generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
);

    const refreshToken = jwtHelpers.generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
);


    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
}

const refreshToken = async(token:string)=>{
    let decodedData;
    try {
         decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    } catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:decodedData.email,
            status:UserStatus.ACTIVE
        }
    });

      const accessToken = jwtHelpers.generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
);

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

}

const changePassword =async(user:any, payload:any)=>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:user.email,
            status:UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if(!isCorrectPassword){
        throw new Error('Password incorrect!');
    }
    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where:{
            email:userData.email
        },
        data:{
            password:hashedPassword,
            needPasswordChange:false
        }
    })
    return {
        message:"Password Changed Successfully!"
    }
}

const forgotPassword = async(payload:{email:string}) =>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    });
    const resetPasswordToken = jwtHelpers.generateToken(
        {email:userData.email, role:userData.role},
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_expires_in as string
    )
    console.log(resetPasswordToken);

    const resetPassLink = config.reset_pass_link + `?email=${userData.id}&token=${resetPasswordToken}`

    await emailSender(userData.email, 
        `
        <div>
            <p>Dear User</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a> </p>
        </div>
        `
    )

    // http://localhost:3000/reset-pass?email=abc@gmail.com&token=kjertsjfd
}

const resetPassword = async (token:string, payload:{id:string, password:string}) =>{
    console.log({ token, payload })
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            id:payload.id,
            status:UserStatus.ACTIVE
        }
    });
    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret)

    if(!isValidToken){
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden")
    }
    // hash password

    // update into database
}

export const AuthServices ={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}
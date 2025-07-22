import { UserRole } from "../../../../generated/prisma";
import * as bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploaders";
import { IFile } from "../../interfaces/file";

const createAdmin = async(req:any)=>{

    const file:IFile = req.file;
    console.log(req.body)
    if(file){
        
        const uploadToCloudinary = await fileUploader.uploadCloudinary(file);

        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url

    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)
    const userData ={
        email:req.body.admin.email,
        password:hashedPassword,
        role: UserRole.ADMIN,
    }
   
    const result = await prisma.$transaction(async(transactionClient) =>{
         await transactionClient.user.create({
            data:userData
        });
        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });
        return createdAdminData;
    })
    return result;
}
const createDoctor = async(req:any)=>{

    const file:IFile = req.file;
    console.log(req.body)
    if(file){
        
        const uploadToCloudinary = await fileUploader.uploadCloudinary(file);

        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url

    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)
    const userData ={
        email:req.body.admin.email,
        password:hashedPassword,
        role: UserRole.DOCTOR,
    }
   
    const result = await prisma.$transaction(async(transactionClient) =>{
         await transactionClient.user.create({
            data:userData
        });
        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });
        return createdDoctorData;
    })
    return result;
}

export const userService ={
    createAdmin,
    createDoctor
}
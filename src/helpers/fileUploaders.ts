import multer from "multer";
import path from "path";
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

  // Configuration
    cloudinary.config({ 
        cloud_name: 'dpleqgehd', 
        api_key: '824732844415418', 
        api_secret: 'urerxateVyVZXrQ_FA1RUVM_bNM' // Click 'View API Keys' above to copy your API secret
    });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

const uploadCloudinary =(file:IFile):Promise<ICloudinaryResponse | undefined>=>{
    return new Promise((resolve, reject)=>{
        cloudinary.uploader
       .upload(file.path, {
              //  public_id: file.originalname,
           },
           (error:Error, result:ICloudinaryResponse)=>{
            fs.unlinkSync(file.path)
            if(error){
                reject(error)
            }
            else{
                resolve(result)
            }
           });
    })
   
}

export const fileUploader ={
    upload,
    uploadCloudinary
};
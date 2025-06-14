import { RequestHandler } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constants';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';

const getAllFromDB:RequestHandler = catchAsync(async(req, res)=>{
      
        const filters = pick(req.query, adminFilterableFields);
        const options = pick(req.query, ['limit','page','sortBy','sortOrder']);

        const result = await AdminService.getAllFromDB(filters,options);

        sendResponse(res, {
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin data fetched!',
            meta:result.meta,
            data:result.data
        }) 
})

const getByIdFromDB = catchAsync(async(req, res) =>{
    // console.log(req.params.id);
    const {id} = req.params;
        const result = await AdminService.getByIdFromDB(id);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Admin data fetched!",
        data:result
    }) 
}
)
const updateIntoDB = catchAsync(async(req, res)=>{

    const {id} = req.params;
    // console.log("id:",id);
    // console.log("data:",req.body);
        const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
         message:"Admin data updated!",
         data:result
    })
})
const deleteFromDB = catchAsync(async(req, res )=>{
    const {id} = req.params;
    // console.log("id:",id);
    // console.log("data:",req.body);
    const result = await AdminService.deleteFromDB(id);
        sendResponse(res, {
            statusCode:httpStatus.OK,
            success:true,
            message:"Admin data Deleted",
            data:result
        })
})
const softDeleteFromDB = catchAsync(async(req, res)=>{
    const {id} = req.params;
    // console.log("id:",id);
    // console.log("data:",req.body);
        const result = await AdminService.softDeleteFromDB(id);
        sendResponse(res, {
            statusCode:httpStatus.OK,
            success:true,
            message:"Admin data Deleted",
            data:result
            })
}
)
export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}
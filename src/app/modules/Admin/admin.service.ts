import { Prisma, PrismaClient } from "../../../../generated/prisma";
import { adminSearchableFields } from "./admin.constants";

const prisma = new PrismaClient();

const calculatePagination = (options:{
    page?:number,
    limit?:number,
    sortOrder?:string,
    sortBy?:string
})=>{
    const page:number = Number(options.page) || 1;
    const limit:number = Number(options.limit) || 10;
    const skip :number = (Number(page)-1)*limit;
    const sortBy:string = options.sortBy || 'createdAt';
    const sortOrder:string = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

const getAllFromDB = async(params:any, options:any) =>{
    const { limit, page, skip } = calculatePagination(options);
    const {searchTerm, ...filterData } =params;
    
    const andConditions: Prisma.AdminWhereInput[] = [];

    if(params.searchTerm){
        andConditions.push(
            {
            OR:adminSearchableFields.map(field =>({
                 [field]:{
                contains:params.searchTerm,
                mode:'insensitive'
            }
            }))
        }
        )
    }

    // specific field like name, email

    if(Object.keys(filterData).length>0){
        andConditions.push({
            AND: Object.keys(filterData).map(key =>({
                [key]:{
                    equals:filterData[key]
                }
            }))
        })
    }

    const whereConditions:Prisma.AdminWhereInput = {AND:andConditions}
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip: skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{
            createdAt:'desc'
        }
    });

    return result;
}

export const AdminService = {
    getAllFromDB
}
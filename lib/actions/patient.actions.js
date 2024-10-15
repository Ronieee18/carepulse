import { ID, Query } from "node-appwrite"
import { databases, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";
import dotenv from 'dotenv'
dotenv.config()
export const createUser=async(user)=>{
    try {
        const newUser=await users.create(ID.unique(),user.email,user.phone,undefined,user.name)
        return newUser;
    } catch (error) {
        if(error && error?.code === 409){
            const documents=await users.list([
                Query.equal('email',[user.email])
            ])
            return documents?.users[0];
        }
        throw error;
    }
}

export const getUser=async(userId)=>{
    try {
        const user=await users.get(userId)
        return parseStringify(user)
    } catch (error) {
        console.log(error);
    }
}

export const registerPatient=async({identificationDocument,...patient})=>{
    try {
        console.log("in register patient func");
        let file;
        if (identificationDocument) {
            const inputFile = identificationDocument.get('blobFile'); // Assuming this is a buffer
            console.log(inputFile);
            const fileName = identificationDocument.get('fileName');
            console.log(fileName);
            file = await storage.createFile('66968a350006bfb73e60', ID.unique(), inputFile);
        }
        console.log(file);
        const newPatient= await databases.createDocument(
            '6696895f0021524bed87',
            '66968986001b851f77fa',
            ID.unique(),
            {
                ...patient,
                identificationDocument:file?.$id,
                identificationDocumentUrl:`https://cloud.appwrite.io/v1/storage/buckets/66968a350006bfb73e60/files/${file?.$id}/view??project=669688ae000c190a67de`
            }
        )
        return parseStringify(newPatient);
    } catch (error) {
        console.log(error);
    }
}

export const getPatient=async(userId)=>{
    try {
        const patients=await databases.listDocuments(process.env.DATABASE_ID,process.env.PATIENT_COLLECTION_ID,[Query.equal('userId',userId)])
        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log(error);
    }
}
import { ID, Query } from "node-appwrite";
import { databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const CreateAppointment=async(appointmentData)=>{
    try {
        const newAppointment= await databases.createDocument(
            '6696895f0021524bed87',
            '669689fd0027e55bf36e',
            ID.unique(),
            appointmentData
        )
        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
}

export const GetAppointment=async(appointmentId)=>{
    try {
        const appointment= await databases.getDocument(
            '6696895f0021524bed87',
            process.env.APPOINTMENT_COLLECTION_ID,
            appointmentId
        )
        return parseStringify(appointment);
    } catch (error) {
        console.log(error);
    }
}

export const getRecentAppointments=async()=>{
    try {
        const appointments=await databases.listDocuments(
            process.env.DATABASE_ID,
            process.env.APPOINTMENT_COLLECTION_ID,
            [Query.orderDesc('$createdAt')]
        )
        const initalCounts={
            scheduledCount:0,
            pendingCount:0,
            cancelledCount:0
        }
        const counts=appointments.documents.reduce((acc,appointment)=>{
            if(appointment.status==='scheduled'){
                acc.scheduledCount+=1;
            }
            if(appointment.status==='pending'){
                acc.pendingCount+=1;
            }
            if(appointment.status==='cancelled'){
                acc.cancelledCount+=1;
            }
            return acc;
        },initalCounts)
        const data={
            totalCount:appointments.total,
            ...counts,
            documents:appointments.documents
        }
        return parseStringify(data);
    } catch (error) {
        console.log(error);
        
    }
}

export const UpdateAppointment=async(appointmentData)=>{
    try {
        const updatedAppointment=await databases.updateDocument(
            process.env.DATABASE_ID,
            process.env.APPOINTMENT_COLLECTION_ID,
            appointmentData.appointmentId,
            appointmentData.appointment
        )
        if(!updatedAppointment){
            throw new Error('appointment not found')
        }

        // TODO:SMS NOTIFICATION

        revalidatePath('/admin')
        return parseStringify(updatedAppointment);
    } catch (error) {
        console.log(error);
        
    }
}
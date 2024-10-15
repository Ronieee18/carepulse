"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState, useEffect } from "react"
import { CreateAppointmentSchema, getAppointmentSchema, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { CreateAppointment, UpdateAppointment } from "@/lib/actions/appointment.actions";

const AppointmentForm = ({
    type,
    userId,
    patientId,
    setOpen,
    appointment
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const AppointmentFormValidation=getAppointmentSchema(type);
   

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values) {
        console.log("in submit func")
        setIsLoading(true);
        let status;
        switch (type) {
            case 'schedule':
                status='scheduled';
                break;
            case 'cancel':
                status='cancelled';
                break;

            default:
                status='pending';
                break;
        }
        try {
            if(type==='create' && patientId){
                const appointmentData={
                    primaryPhysician:values.primaryPhysician,
                    userId,
                    patient:patientId,
                    schedule:new Date(values.schedule),
                    reason:values.reason,
                    note:values.note,
                    status
                    
                }

                const appointment=await CreateAppointment(appointmentData);
                if(appointment){
                    form.reset();
                    router.push(`/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }else{
                const appointmentData={
                    userId,
                    appointmentId:appointment?.$id,
                    appointment:{
                        primaryPhysician:values?.primaryPhysician,
                        schedule:new Date(values.schedule),
                        status:status,
                        cancellationReason:values?.cancellationReason,
                    },
                    type
                }
                const updatedAppointment=await UpdateAppointment(appointmentData);
                if(updatedAppointment){
                    form.reset();
                    setOpen(false);
                }
            }
        } catch (error) {
            console.error("Error creating user:", error)
        } 
    }

    let buttonLabel;
    switch (type) {
        case 'cancel':
            buttonLabel='Cancel Appointment'
            break;
        case 'create':
            buttonLabel='Create Appointment'
            break;
        case 'schedule':
            buttonLabel='Schedule Appointment'
        default:
            break;
    }   
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type==='create' &&
                <section className="mb-12 space-y-4">
                    <h1 className="header">New Appointment</h1>
                    <p className="text-dark-700">Request a new appointment in 10 seconds</p>
                </section>}

                {type!=='cancel' &&(
                    <>
                        <CustomFormField
                    name="primaryPhysician"
                    label="Doctor"
                    placeholder="Select a doctor"
                    fieldType='select'
                    control={form.control}
                >
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                    src={doctor.image}
                                    width={32}
                                    height={32}
                                    alt={doctor.name}
                                    className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>
                <CustomFormField
                        name="schedule"
                        label="Expected appointment date"
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        fieldType='datePicker'
                        control={form.control}
                    />
                    <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name="reason"
                        label="Reason for appointment"
                        placeholder="Enter Reason for appointment"
                        fieldType='textarea'
                        control={form.control}
                    />
                    <CustomFormField
                        name="note"
                        label="Notes"
                        placeholder="Enter any notes"
                        fieldType='textarea'
                        control={form.control}
                    />
                    </div>
                    </>
                )}

                {type==='cancel' && (
                    <CustomFormField
                    name="cancellationReason"
                    label="Reason for cancellation"
                    placeholder="Enter Reason for cancellation"
                    fieldType='textarea'
                    control={form.control}
                />
                )}


            
                <SubmitButton isLoading={isLoading} className={`${type==='cancel'?'shad-danger-btn':'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm

'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import AppointmentForm from './forms/AppointmentForm'

const AppointmentModal = ({type,patientId,userId,appointmentId,title,description}) => {
    const [open,setOpen]=useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant='ghost' className={`capitalize ${type==='Schedule'?'text-green-500':'text-red-500'}`}>
                {type}
            </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog sm:max-w-md">
            <DialogHeader className='mb-4 space-y-3'>
                <DialogTitle className='capitalize'>{type} Appointment</DialogTitle>
                <DialogDescription>
                    Please fill in following details to {type} an appointment
                </DialogDescription>
            </DialogHeader>
            <AppointmentForm
            userId={userId}
            patientId={patientId}
            type={type}
            setOpen={setOpen}
            appointment={appointmentId}
            />
        </DialogContent>
    </Dialog>
)
}

export default AppointmentModal
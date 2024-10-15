"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
    {
        header:'ID',
        cell:({row})=><p className="text-14-medium">{row.index+1}</p>
    },
    {
        accessorKey: "patient",
        header: "Patient",
        cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell:({row})=>(
            <div className="min-w-[115px]">
                <StatusBadge status={row.original.status}/>
            </div>
        )
    },
    {
        accessorKey: "schedule",
        header: "Appointment",
        cell:({row})=>(
            <p className="text-14-regular min-w-[100px]">
                {formatDateTime(row.original.schedule).dateTime}
            </p>
        )
    },
    {
        accessorKey: "primaryPhysician",
        header: () => 'Doctor',
        cell: ({ row }) => {
            const physician = Doctors.find((doc)=>doc.name===row.original.primaryPhysician)
            return (
                <div className="flex items-center gap-3">
                    <Image
                        src={physician.image}
                        alt={physician.name}
                        width={100}
                        height={100}
                        className="size-8"
                    />
                    <p className="text-14-medium whitespace-nowrap">Dr. {physician.name}</p>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: ()=> <div className="pl-4">Actions</div>,
        cell:({row:{original:data}})=>{
            return(
                <div className="flex gap-1">
                    <AppointmentModal
                    type='Schedule'
                    patientId={data.patient.$id}
                    userId={data.userId}
                    appointmentId={data}
                    title="Schedule Appointment"
                    description="please confirm following details to schedule"
                    />
                    <AppointmentModal 
                    type='Cancel'
                    patientId={data.patient.$id}
                    userId={data.userId}
                    appointmentId={data}
                    title="Cancel Appointment"
                    description="Are you sure want to cancel this appointment?"
                    />
                </div>
            )
        }
    }
]

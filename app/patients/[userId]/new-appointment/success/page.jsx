import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { GetAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SuccessPage = async({params:{userId},searchParams}) => {
    const appointmentId=(searchParams?.appointmentId);
    const appointment=await GetAppointment(appointmentId);
    const doctor=Doctors.find((doc)=>doc.name===appointment.primaryPhysician);
  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
        <div className='success-img'>
            <Link href='/'>
                <Image
                src='/assets/icons/logo-full.svg'
                alt='logo'
                width={1000}
                height={1000}
                className='h-10 w-fit'
                />
            </Link>
            <section className='flex flex-col items-center'>
                <Image
                src='/assets/gifs/success.gif'
                alt='success'
                width={280}
                height={300}
                
                />
            <h2 className='header mb-5 max-w-[600px] text-center'>
                Your <span className='text-green-500'>Appointment</span> has been Booked Successfully
            </h2>
            <p className='text-center'>
                You will receive a confirmation email shortly
            </p>
            </section>
            <section className='request-details'>
                <p>Requested appointment details:</p>
                <div className='flex items-center gap-3'>
                    <Image
                    src={doctor?.image}
                    alt='doctor'
                    width={100}
                    height={100}
                    className='size-6'
                    />
                    <p className='whitespace-nowrap'>Dr. {doctor.name}</p>
                </div>
                <div className='flex gap-2'>
                    <Image
                    src='/assets/icons/calendar.svg'
                    alt='calendar'
                    width={24}
                    height={24}
                    />
                    <p>{formatDateTime(appointment.schedule).dateTime}</p>
                </div>
            </section>
            <Button variant="outline" className="shad-primary-btn" asChild>
                <Link href={`/patients/${userId}/new-appointment`}>
                    New Appointment
                </Link>
            </Button>
            <p className="copyright py-10">© 2024 Carepulse</p>
        </div>
    </div>
  )
}

export default SuccessPage
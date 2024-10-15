
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
export default async function NewAppointement({params:{userId}}) {
    console.log(userId);
    const patient=await getPatient(userId);
  return (
   <div className="flex h-screen max-h-screen">
    <section className="remove-scrollbar container my-auto">
      <div className="sub-container max-w-[860px] flex-1 justify-between">
        <Image
        src='/assets/icons/logo-full.svg'
        width={1000}
        height={1000}
        alt="patient"
        className="mb-12 h-10 w-fit"
        />
        <AppointmentForm
            type='create'
            userId={userId}
            patientId={patient.$id}
        />
        
          <p className="text-dark-600 justify-items-end xl:text-left">© 2024 Carepulse</p>
          
      </div>
    </section>
    <Image
    src='/assets/images/appointment-img.png'
    height={1000}
    width={1000}
    alt="paatient"
    className="side-img max-w-[390px] bg-bottom"
    />
   </div>
  );
}

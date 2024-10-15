'use client'
import React, { useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { decryptKey, encryptKey } from '@/lib/utils'
  

const PassKeyModal = () => {
    const router=useRouter();
    const path=usePathname();
    const [isOpen, setIsOpen] = React.useState(true)
    const [otp, setOtp] = React.useState('')
    const [otpError, setOtpError] = React.useState('')
    const encryptedKey=typeof window !=='undefined'?window.localStorage.getItem('accessKey'):null;
    useEffect(()=>{
        const accessKey=encryptedKey && decryptKey(encryptedKey);
        if(path){
            if(accessKey    ===process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
                router.push('/admin');
                setIsOpen(false)
            }else{
                setIsOpen(true);
            }
        }
    },[encryptedKey])

    const closeModal=()=>{
        setIsOpen(false);
        router.push('/');
    }
    const validatPasskey=(e)=>{
        e.preventDefault();
        if(otp===process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            const encryptedKey=encryptKey(otp);
            localStorage.setItem('accessKey',encryptedKey)
            closeModal();
        }else{
            setOtpError('Invalid passkey. Please try again.')
        }
    }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-start justify-between">
                    Admin Access Verification
                    <Image
                        src='/assets/icons/close.svg'
                        width={20}
                        height={20}
                        alt="close"
                        onClick={()=>closeModal()}
                        className='cursor-pointer'
                />
                </AlertDialogTitle>
                
                <AlertDialogDescription>
                    To enter the admin page, please enter the passkey.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div>
            <InputOTP maxLength={6} value={otp} onChange={(val)=>setOtp(val)}>
                <InputOTPGroup className="shad-otp">
                    <InputOTPSlot className="shad-otp-slot" index={0} />
                    <InputOTPSlot className="shad-otp-slot" index={1} />
                    <InputOTPSlot className="shad-otp-slot" index={2} />
                    <InputOTPSlot className="shad-otp-slot" index={3} />
                    <InputOTPSlot className="shad-otp-slot" index={4} />
                    <InputOTPSlot className="shad-otp-slot" index={5} />
                </InputOTPGroup>
            </InputOTP>
            {otpError && <p className='shad-error text-14-regular mt-4 flex justify-center'>
                {otpError}
                </p>}
            </div>
            <AlertDialogFooter>
                <AlertDialogAction onClick={(e)=>validatPasskey(e)} className="shad-primary-btn w-full">Enter Admin Passkey</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    )
}

export default PassKeyModal
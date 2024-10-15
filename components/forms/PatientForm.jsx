"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState, useEffect } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions";

const PatientForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

   

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit({name,email,phone}) {
        console.log("in submit func")
        setIsLoading(true);
        try {
            const userData = {
                name,
                email,
                phone
            }
            console.log(userData)
            const user = await createUser(userData)
            console.log("User created successfully:", user)
            if (user) {
                router.push(`/patients/${user.$id}/register`)
            }
        } catch (error) {
            console.error("Error creating user:", error)
        } 
    }

    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">Schedule your first appointment</p>
                </section>
                <CustomFormField
                    name="name"
                    label="Name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt='user'
                    fieldType='input'
                    control={form.control}
                />
                <CustomFormField
                    name="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt='email'
                    fieldType='input'
                    control={form.control}
                />
                <CustomFormField
                    name="phone"
                    label="Phone Number"
                    placeholder="+91XXXXXXXXXX"
                    fieldType='phoneInput'
                    control={form.control}
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm

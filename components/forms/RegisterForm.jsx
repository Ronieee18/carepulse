"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState, useEffect } from "react";
import { formSchema, PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, getUser, registerPatient } from "@/lib/actions/patient.actions";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, genderOption, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { Select, SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

const RegisterForm = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values) {
        console.log("Form values:", values);
        setIsLoading(true);
        try {
            let formData;
            if (values.identificationDocument && values.identificationDocument.length > 0) {
                const blobFile = new Blob([values.identificationDocument[0]], {
                    type: values.identificationDocument[0].type,
                });
                formData = new FormData();
                formData.append('blobFile', blobFile);
                formData.append('fileName', values.identificationDocument[0].name);
            }
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
            };
            console.log("Patient data to register:", patientData);
            const patient = await registerPatient(patientData);
            if (patient) {
                router.push(`/patients/${user.$id}/new-appointment`);
            } else {
                console.log("Patient registration failed");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>
                <CustomFormField
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt='user'
                    fieldType='input'
                    control={form.control}
                />

                <div className="flex flex-col gap-6 xl:flex-row">
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
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name="birthDate"
                        label="Date of Birth"
                        fieldType='datePicker'
                        control={form.control}
                    />
                    <CustomFormField
                        name="gender"
                        label="Gender"
                        fieldType='skeleton'
                        control={form.control}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option) => (
                                        <div key={option} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name="address"
                        label="Address"
                        placeholder="Street Building"
                        fieldType='input'
                        control={form.control}
                    />
                    <CustomFormField
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                        fieldType='input'
                        control={form.control}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Guardian Name"
                        fieldType='input'
                        control={form.control}
                    />
                    <CustomFormField
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                        placeholder="+91XXXXXXXXXX"
                        fieldType='phoneInput'
                        control={form.control}
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>
                <CustomFormField
                    name="primaryPhysician"
                    label="Primary Physician"
                    placeholder="Select a Physician"
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
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="Insurance Company"
                        fieldType='input'
                        control={form.control}
                    />
                    <CustomFormField
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="ABC123456"
                        fieldType='input'
                        control={form.control}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="eczema, hives, food allergy"
                        fieldType='textarea'
                        control={form.control}
                    />
                    <CustomFormField
                        name="currentMedication"
                        label="Current Medication (if any)"
                        placeholder="paracetamol (200mg)"
                        fieldType='textarea'
                        control={form.control}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="Mother or father had some disease"
                        fieldType='textarea'
                        control={form.control}
                    />
                    <CustomFormField
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendix, Tonsillectomy"
                        fieldType='textarea'
                        control={form.control}
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>
                <CustomFormField
                    name="identificationType"
                    label="Identification Type"
                    placeholder="Select an Identification Type"
                    fieldType='select'
                    control={form.control}
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="123456789"
                    fieldType='input'
                    control={form.control}
                />
                <CustomFormField
                    name="identificationDocument"
                    label="Scanned Copy Of Identification document"
                    fieldType='skeleton'
                    control={form.control}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>
                <CustomFormField
                    name="treatmentConsent"
                    label="I consent to Treatment"
                    fieldType='checkbox'
                    control={form.control}
                />
                <CustomFormField
                    name="disclosureConsent"
                    label="I consent to disclosure of Information"
                    fieldType='checkbox'
                    control={form.control}
                />
                <CustomFormField
                    name="privacyConsent"
                    label="I consent to Privacy Policy"
                    fieldType='checkbox'
                    control={form.control}
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    );
};

export default RegisterForm;

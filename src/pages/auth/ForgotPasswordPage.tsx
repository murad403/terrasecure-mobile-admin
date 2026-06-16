"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    console.log('Forgot password request submitted for:', data)
    // Simulate API call and redirect to verify-otp
    setTimeout(() => {
      setIsLoading(false)
      // Go to verify OTP page
      router.push('/auth/verify-otp')
    }, 1500)
  }

  return (
    <div className='w-full'>
      {/* Title & Subtitle */}
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl font-bold text-title tracking-tight mb-2'>
          Forgot Password
        </h1>
        <p className='text-sm text-subtitle font-light'>
          Enter your registered email to receive an OTP code
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 grow'>
        {/* Email Address */}
        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            type='email'
            placeholder='admin@landsecure.com'
            {...register('email')}
          />
          {errors.email && (
            <p className='text-xs text-destructive mt-1 font-medium'>{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? (
            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
          ) : (
            'Send OTP'
          )}
        </Button>

        {/* Back to Sign In Link */}
        <div className='text-center pt-2'>
          <Link
            href='/auth/sign-in'
            className='inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>

      {/* Footer Info */}
      <div className='mt-12 text-center space-y-4'>
        <div className='flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium'>
          <Lock className='w-3.5 h-3.5' />
          <span>Secured access — unauthorized login is strictly prohibited</span>
        </div>
        <p className='text-slate-400 text-[11px] font-light'>
          LandSecure &copy; 2025 &middot; Cameroon Land Administration
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
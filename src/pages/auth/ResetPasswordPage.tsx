"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: ResetPasswordFormValues) => {
    setIsLoading(true)
    console.log('Reset password request submitted:', data)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('Password has been reset successfully!')
      // Redirect to sign in page
      router.push('/auth/sign-in')
    }, 1500)
  }

  return (
    <div className='w-full'>
      {/* Title & Subtitle */}
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl font-bold text-title tracking-tight mb-2'>
          Reset Password
        </h1>
        <p className='text-sm text-subtitle font-light'>
          Create a strong new password for your account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 grow'>
        {/* New Password */}
        <div className='space-y-2'>
          <Label htmlFor='password'>New Password</Label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('password')}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none'
            >
              {showPassword ? (
                <EyeOff className='w-4.5 h-4.5' />
              ) : (
                <Eye className='w-4.5 h-4.5' />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='text-xs text-destructive mt-1 font-medium'>{errors.password.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirm New Password</Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('confirmPassword')}
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none'
            >
              {showConfirmPassword ? (
                <EyeOff className='w-4.5 h-4.5' />
              ) : (
                <Eye className='w-4.5 h-4.5' />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className='text-xs text-destructive mt-1 font-medium'>{errors.confirmPassword.message}</p>
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
            'Reset Password'
          )}
        </Button>

        {/* Back to Sign In Link */}
        <div className='text-center pt-2'>
          <Link
            href='/auth/sign-in'
            className='inline-flex items-center gap-1.5 text-sm text-subtitle hover:text-title transition-colors font-medium'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>

      {/* Footer Info */}
      <div className='mt-12 text-center space-y-4'>
        <div className='flex items-center justify-center gap-1.5 text-subtitle text-xs font-medium'>
          <Lock className='w-3.5 h-3.5' />
          <span>Secured access — unauthorized login is strictly prohibited</span>
        </div>
        <p className='text-subtitle text-xs font-light'>
          LandSecure &copy; 2025 &middot; Cameroon Land Administration
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage
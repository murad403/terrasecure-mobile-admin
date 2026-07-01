"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInFormValues } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'



const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })
  const rememberMeValue = watch('rememberMe');



  const onSubmit = (data: SignInFormValues) => {
    setIsLoading(true)
    console.log('Sign in submitted:', data)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 1500)
  }

  return (
    <div className='w-full'>
      {/* Title & Subtitle */}
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl font-bold text-title tracking-tight mb-2'>
          Sign in to Admin Panel
        </h1>
        <p className='text-sm text-subtitle font-light'>
          Enter your credentials to continue
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

        {/* Password */}
        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <Label htmlFor='password'>Password</Label>
          </div>
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
              className='absolute right-3 top-1/2 -translate-y-1/2 text-subtitle hover:text-slate-600 focus:outline-none'
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

        {/* Remember me & Forgot Password */}
        <div className='flex items-center justify-between text-xs md:text-sm pt-1'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='rememberMe'
              checked={rememberMeValue}
              onCheckedChange={(checked) => setValue('rememberMe', checked)}
            />
            <label
              htmlFor='rememberMe'
              className='text-subtitle font-normal cursor-pointer select-none text-sm'
            >
              Remember me on this device
            </label>
          </div>
          <Link
            href='/auth/forgot-password'
            className='text-button-color hover:underline font-medium text-sm'
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? (
            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
          ) : (
            'Sign In'
          )}
        </Button>
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

export default SignInPage
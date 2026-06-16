"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifyOtpSchema, type VerifyOtpFormValues } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

const VerifyOtpPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter();

  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  })

  // Register the hidden field for OTP
  useEffect(() => {
    register('otp')
  }, [register])

  const handleChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Store only the last character entered
    setOtp(newOtp)

    const otpStr = newOtp.join('')
    setValue('otp', otpStr)
    trigger('otp') // Trigger validation on change

    // Automatically focus next input field if digit is entered
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current box is empty, delete the value of previous box and focus it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        setValue('otp', newOtp.join(''))
        trigger('otp')
        inputsRef.current[index - 1]?.focus()
      } else {
        // Just clear the current box
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        setValue('otp', newOtp.join(''))
        trigger('otp')
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = Array(6).fill('')
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    setValue('otp', newOtp.join(''))
    trigger('otp')

    // Focus the last pasted box or the first empty box
    const focusIndex = Math.min(pastedData.length, 5)
    inputsRef.current[focusIndex]?.focus()
  }

  const onSubmit = (data: VerifyOtpFormValues) => {
    setIsLoading(true)
    console.log('OTP submitted:', data)
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      // Go to reset password page
      router.push('/auth/reset-password')
    }, 1500)
  }

  const handleResend = () => {
    setResending(true)
    console.log('Resending OTP code...')
    setTimeout(() => {
      setResending(false)
      alert('A new 6-digit OTP has been sent to your email!')
    }, 1200)
  }

  return (
    <div className='w-full max-w-md px-6 md:px-0 flex flex-col justify-between min-h-[500px] py-10 font-sans'>
      {/* Title & Subtitle */}
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl font-bold text-title tracking-tight mb-2'>
          Verify OTP
        </h1>
        <p className='text-sm text-subtitle font-light'>
          Enter the 6-digit verification code sent to your email
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 grow'>
        {/* 6-box OTP Input Fields */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            {otp.map((digit, index) => (
              <input
                key={index}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                className={`w-12 h-12 text-center text-xl font-bold border rounded-lg bg-slate-50/40 focus:bg-white focus:outline-none transition-all ${errors.otp
                    ? 'border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive'
                    : 'border-slate-200 focus:ring-2 focus:ring-button-color/20 focus:border-button-color'
                  }`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className='text-xs text-destructive font-medium text-center md:text-left'>{errors.otp.message}</p>
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
            'Verify & Proceed'
          )}
        </Button>

        {/* Resend & Back to Login options */}
        <div className='space-y-4 pt-2 text-center'>
          <p className='text-xs text-subtitle'>
            Didn&apos;t receive the code?{' '}
            <button
              type='button'
              onClick={handleResend}
              disabled={resending}
              className='text-button-color hover:underline font-semibold focus:outline-none disabled:opacity-50'
            >
              {resending ? 'Resending...' : 'Resend Code'}
            </button>
          </p>

          <div>
            <Link
              href='/auth/sign-in'
              className='inline-flex items-center gap-1.5 text-sm text-subtitle hover:text-title transition-colors font-medium'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </form>

      {/* Footer Info */}
      <div className='mt-12 text-center space-y-4'>
        <div className='flex items-center justify-center gap-1.5 text-slate-400 text-xs font-medium'>
          <Lock className='w-3.5 h-3.5' />
          <span>Secured access — unauthorized login is strictly prohibited</span>
        </div>
        <p className='text-slate-400 text-xs font-light'>
          LandSecure &copy; 2025 &middot; Cameroon Land Administration
        </p>
      </div>
    </div>
  )
}

export default VerifyOtpPage
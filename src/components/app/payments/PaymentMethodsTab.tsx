"use client"
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const PaymentMethodsTab = () => {
  // MTN MoMo States
  const [mtnEnabled, setMtnEnabled] = useState(true)
  const [mtnMerchantId, setMtnMerchantId] = useState('MTN-MOMO-CAM-928')
  const [mtnClientKey, setMtnClientKey] = useState('momo_secret_key_91827364')

  // Orange Money States
  const [orangeEnabled, setOrangeEnabled] = useState(true)
  const [orangeMerchantToken, setOrangeMerchantToken] = useState('OM-TOK-CAM-837')
  const [orangeSecret, setOrangeSecret] = useState('om_api_secret_key_82736412')

  // Stripe States
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [stripePubPrice, setStripePubPrice] = useState('pk_test_51N28374619')
  const [stripeSecPrice, setStripeSecPrice] = useState('sk_test_283746192837')

  // Bank Transfer States
  const [bankEnabled, setBankEnabled] = useState(true)
  const [bankInstructions, setBankInstructions] = useState(
    'Please deposit payment to UBA Cameroon (Bastos Branch).\nAccount Name: TerraSecure SARL\nAccount Number: 03817-293847-19\nIBAN: CM21-03817-293847-19\nBIC: UBACCMYA'
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Payment Gateway configuration settings saved successfully!')
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none max-w-4xl text-xs md:text-sm text-slate-800">
      
      {/* 1. MTN Mobile Money */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-slate-900">MTN Mobile Money Gateway</h3>
            <p className="text-[10px] font-semibold text-slate-400">Process local payments via MTN MoMo merchant wallets</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={mtnEnabled}
              onChange={(e) => setMtnEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-650"></div>
          </label>
        </div>

        {mtnEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">MTN Merchant ID</Label>
              <Input
                value={mtnMerchantId}
                onChange={(e) => setMtnMerchantId(e.target.value)}
                className="font-semibold text-xs md:text-sm text-title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">API Client Key</Label>
              <Input
                type="password"
                value={mtnClientKey}
                onChange={(e) => setMtnClientKey(e.target.value)}
                className="font-semibold text-xs md:text-sm text-title"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Orange Money */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-slate-900">Orange Money Gateway</h3>
            <p className="text-[10px] font-semibold text-slate-400">Process local payments via Orange Money merchant API</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={orangeEnabled}
              onChange={(e) => setOrangeEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-650"></div>
          </label>
        </div>

        {orangeEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Orange Merchant Token ID</Label>
              <Input
                value={orangeMerchantToken}
                onChange={(e) => setOrangeMerchantToken(e.target.value)}
                className="font-semibold text-xs md:text-sm text-title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Orange API Secret Key</Label>
              <Input
                type="password"
                value={orangeSecret}
                onChange={(e) => setOrangeSecret(e.target.value)}
                className="font-semibold text-xs md:text-sm text-title"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Credit Cards via Stripe */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-slate-900">Credit Card Gateway (Stripe)</h3>
            <p className="text-[10px] font-semibold text-slate-400">Process international card transactions via Stripe merchant API</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={stripeEnabled}
              onChange={(e) => setStripeEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-650"></div>
          </label>
        </div>

        {stripeEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Stripe Publishable Key</Label>
              <Input
                value={stripePubPrice}
                onChange={(e) => setStripePubPrice(e.target.value)}
                className="font-semibold text-xs md:text-sm text-title"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Stripe Secret Key</Label>
              <Input
                type="password"
                value={stripeSecPrice}
                onChange={(e) => setStripeSecPrice(e.target.value)}
                className="font-semibold text-xs md:text-sm text-title"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Bank Wire instructions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-slate-900">Direct Bank Wire</h3>
            <p className="text-[10px] font-semibold text-slate-400">Display offline wire details for bank receipts checks</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bankEnabled}
              onChange={(e) => setBankEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-650"></div>
          </label>
        </div>

        {bankEnabled && (
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-bold text-slate-700">Direct Bank Transfer Instructions</Label>
            <textarea
              value={bankInstructions}
              onChange={(e) => setBankInstructions(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl p-4 text-xs md:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-all font-semibold min-h-[110px] leading-relaxed resize-none block font-mono"
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-2 select-none">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm rounded-lg cursor-pointer flex items-center border-none"
        >
          Save Gateway Settings
        </button>
      </div>

    </form>
  )
}

export default PaymentMethodsTab
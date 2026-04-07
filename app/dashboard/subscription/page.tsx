'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Subscription } from '@/types';
import MovingBorderCard from '@/components/MovingBorderCard';

const PLANS = [
  {
    id: 'MONTHLY',
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    features: ['Access all premium movies', 'Write & rate reviews', 'Build personal watchlist', '1080p streaming', 'Priority support'],
    color: 'border-red-600',
    btnColor: 'bg-red-600 hover:bg-red-700',
    popular: true,
  },
  {
    id: 'YEARLY',
    name: 'Yearly',
    price: '$79.99',
    period: 'per year',
    features: ['Everything in Monthly', '4K Ultra HD streaming', 'Download for offline viewing', 'Early access to new titles', 'Save 33% vs monthly'],
    color: 'border-red-500',
    btnColor: 'bg-red-600 hover:bg-red-700',
  },
];

function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchSubscription();
  }, [user]);

  // Handle payment callback
  useEffect(() => {
    const payment = searchParams.get('payment');
    if (!payment) return;
    if (payment === 'success') {
      toast.success('Payment successful! Subscription activated.');
      fetchSubscription();
    } else if (payment === 'failed') {
      toast.error('Payment failed. Please try again.');
    } else if (payment === 'cancelled') {
      toast.error('Payment cancelled.');
    } else if (payment === 'invalid') {
      toast.error('Payment validation failed.');
    }
    // Clean up URL
    router.replace('/dashboard/subscription');
  }, [searchParams]);

  const fetchSubscription = async () => {
    try {
      const res = await api.get('/subscription');
      setSubscription(res.data.data);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (plan: string) => {
    setPaying(plan);
    try {
      const res = await api.post('/payment/initiate', { plan });
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error('Failed to initiate payment.');
        setPaying('');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Payment initiation failed');
      setPaying('');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription?')) return;
    try {
      await api.delete('/subscription');
      toast.success('Subscription cancelled');
      fetchSubscription();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Choose Your Plan</h1>
        <p className="text-gray-500 dark:text-gray-400">Unlock premium content and enjoy ad-free streaming</p>
      </div>

      {/* Current subscription */}
      {!loading && subscription && subscription.status === 'ACTIVE' && (
        <div className="bg-green-900/30 border border-green-600 rounded-xl p-5 mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-green-400 font-bold text-lg">Active: {subscription.plan} Plan</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Expires: {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
          <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Cancel Subscription
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {PLANS.map((plan) => {
          const isActive = subscription?.status === 'ACTIVE' && subscription?.plan === plan.id;
          const isPaying = paying === plan.id;

          return (
            <MovingBorderCard key={plan.id} className="bg-gray-50 dark:bg-zinc-950 p-7 flex flex-col" duration={plan.popular ? 2000 : 3000}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
              <div className="mt-2 mb-5">
                <span className="text-3xl font-extrabold text-red-400">{plan.price}</span>
                <span className="text-gray-500 text-sm ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>

              {isActive ? (
                <div className="w-full py-3 rounded-lg font-bold text-center text-green-400 border border-green-600 bg-green-900/20 text-sm">
                  Current Plan ✓
                </div>
              ) : (
                <button
                  onClick={() => handlePay(plan.id)}
                  disabled={!!paying}
                  className={`w-full py-3 rounded-lg font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2 ${plan.btnColor}`}
                >
                  {isPaying ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting...
                    </>
                  ) : (
                    <>Pay with SSLCommerz</>
                  )}
                </button>
              )}
            </MovingBorderCard>
          );
        })}
      </div>

      {/* Payment info */}
      <div className="mt-10 text-center">
        <p className="text-gray-600 text-xs">Secured by SSLCommerz · Visa · Mastercard · bKash · Nagad · Rocket</p>
        <p className="text-gray-700 text-xs mt-1">100% secure payment gateway</p>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}

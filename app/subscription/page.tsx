'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Subscription } from '@/types';

const PLANS = [
  {
    id: 'BASIC',
    name: 'Basic',
    price: '$4.99/mo',
    features: ['Access to all free movies', 'Write reviews', 'Build watchlist', '720p streaming'],
    color: 'border-gray-500',
    btnColor: 'bg-gray-600 hover:bg-gray-700',
  },
  {
    id: 'STANDARD',
    name: 'Standard',
    price: '$9.99/mo',
    features: ['Everything in Basic', 'Access to premium movies', '1080p streaming', 'Priority support'],
    color: 'border-yellow-500',
    btnColor: 'bg-yellow-500 hover:bg-yellow-600',
    popular: true,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '$14.99/mo',
    features: ['Everything in Standard', '4K Ultra HD streaming', 'Download for offline', 'Early access to new titles'],
    color: 'border-purple-500',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const res = await api.get('/subscriptions/me');
      setSubscription(res.data.data);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: string) => {
    setSubscribing(plan);
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      await api.post('/subscriptions', { plan, endDate: endDate.toISOString() });
      toast.success(`Subscribed to ${plan} plan!`);
      fetchSubscription();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing('');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription?')) return;
    try {
      await api.put('/subscriptions/cancel');
      toast.success('Subscription cancelled');
      fetchSubscription();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Choose Your Plan</h1>
        <p className="text-gray-400">Unlock premium content and enjoy ad-free streaming</p>
      </div>

      {/* Current subscription */}
      {!loading && subscription && subscription.status === 'ACTIVE' && (
        <div className="bg-green-900/30 border border-green-600 rounded-xl p-5 mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-green-400 font-bold text-lg">Active: {subscription.plan} Plan</p>
            <p className="text-gray-400 text-sm mt-1">
              Expires: {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
          <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Cancel Subscription
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`bg-gray-900 border-2 ${plan.color} rounded-xl p-7 flex flex-col relative`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
            <p className="text-3xl font-extrabold text-yellow-400 mt-2 mb-5">{plan.price}</p>
            <ul className="space-y-3 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-green-400 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={!!subscribing || subscription?.plan === plan.id}
              className={`w-full py-3 rounded-lg font-bold text-black transition disabled:opacity-50 ${plan.btnColor} ${plan.id !== 'BASIC' ? 'text-white' : ''}`}
            >
              {subscribing === plan.id ? 'Processing...' : subscription?.plan === plan.id ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

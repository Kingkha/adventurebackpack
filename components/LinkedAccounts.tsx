'use client';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LinkedAccounts() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const providers = session?.user?.providers || [];

  const handleUnlink = async (provider: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/unlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      // Refresh the session to update the providers list
      await update();
    } catch (error) {
      console.error('Error unlinking account:', error);
      alert('Failed to unlink account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Linked Accounts</h2>
      
      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider} className="flex items-center justify-between p-4 border rounded">
            <span className="capitalize">{provider}</span>
            <button
              onClick={() => handleUnlink(provider)}
              disabled={isLoading || providers.length <= 1}
              className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50"
            >
              Unlink
            </button>
          </div>
        ))}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Add More Accounts</h3>
          {['google', 'github', 'twitter'].map((provider) => {
            if (providers.includes(provider)) return null;
            
            return (
              <button
                key={provider}
                onClick={() => signIn(provider)}
                className="w-full mb-2 px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Connect {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
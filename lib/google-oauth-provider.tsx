"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured. Google login will not work.');
    console.error('Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file');
    // Provide a dummy client ID to prevent hook errors
    return (
      <GoogleOAuthProvider clientId="dummy-client-id">
        {children}
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}


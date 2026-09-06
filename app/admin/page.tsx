import { redirect } from 'next/navigation';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import AdminSignInClient from './AdminSignInClient';

// Server-rendered so an already-authenticated admin (valid access/refresh
// token cookie) never sees the sign-in form flash before bouncing to the
// dashboard — `serverFetch` already knows how to validate + silently
// refresh the access token via the httpOnly cookies.
export default async function AdminSignInPage() {
  let authenticated = false;
  try {
    const { status } = await serverFetch('/admin/me');
    authenticated = status >= 200 && status < 300;
  } catch {
    // Network hiccup reaching the API, or no cookies at all — either way
    // fall through to the sign-in form so the user can re-authenticate.
    authenticated = false;
  }

  // `redirect()` must run outside the try/catch above: it works by throwing
  // a special NEXT_REDIRECT error internally, which a surrounding catch
  // would otherwise swallow and silently prevent the navigation.
  if (authenticated) {
    redirect('/admin/home');
  }

  return <AdminSignInClient />;
}

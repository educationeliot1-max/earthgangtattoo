import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createMiddleware({
  locales: ['th', 'en', 'zh'],
  defaultLocale: 'th',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ---------- Auth guard for protected routes ----------
  const protectedPatterns = [
    /^\/(th|en|zh)\/account/,
    /^\/(th|en|zh)\/checkout/,
  ];
  const adminPatterns = [/^\/admin/];

  const isProtected = protectedPatterns.some(p => p.test(pathname));
  const isAdmin     = adminPatterns.some(p => p.test(pathname));

  if (isProtected || isAdmin) {
    const supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const locale = pathname.split('/')[1] || 'th';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ---------- Apply i18n middleware ----------
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/admin/:path*',
    '/api/webhooks/:path*',
  ],
};

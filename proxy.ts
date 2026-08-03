import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { hasLocale, resolvePreferredLocale } from '@/lib/locales';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathLocale = pathname.split('/')[1] ?? '';

  if (!hasLocale(pathLocale)) {
    const locale = resolvePreferredLocale({
      cookieLocale: request.cookies.get('codeissue-locale')?.value,
      acceptLanguage: request.headers.get('accept-language'),
    });
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

    return NextResponse.redirect(redirectUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-codeissue-locale', pathLocale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

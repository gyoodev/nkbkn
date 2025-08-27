
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createServerClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
     return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (!user && request.nextUrl.pathname.startsWith('/profile')) {
     return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin' && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
  }


  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

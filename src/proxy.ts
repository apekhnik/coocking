import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/share/(.*)', '/home'])

export const proxy = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export default proxy

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}

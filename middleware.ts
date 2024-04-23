';import { authMiddleware } from ';
import {
  authMiddleware,
  clerkClient,
  redirectToSignIn,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const adminEmails = process.env.ADMIN_EMAILS!;

export default authMiddleware({
  debug: false,

  publicRoutes: ['/sign-in', '/sign-up', '/api/webhooks/clerk'],

  afterAuth: async (auth, req, evt) => {
    // ? handle unauthenticated users
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // ? handle users that arent allowed
    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);

      if (
        !user?.emailAddresses.some((email) =>
          adminEmails.includes(email.emailAddress)
        ) &&
        new URL(req.url).pathname !== '/not-allowed'
      ) {
        const currentUrl = new URL(req.url);
        currentUrl.pathname = '/not-allowed';
        return NextResponse.redirect(currentUrl.href);
      } else if (
        user?.emailAddresses.some((email) =>
          adminEmails.includes(email.emailAddress)
        ) &&
        new URL(req.url).pathname == '/not-allowed'
      ) {
        const currentUrl = new URL(req.url);
        currentUrl.pathname = '/';
        return NextResponse.redirect(currentUrl.href);
      }
    }

    // ? block access to public routes for signed-in users
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }

    // ? default behaviour (lets the operation happen)
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

import { NextResponse } from 'next/server';
// import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|assets/|favicon.ico).*)',
  ]
};

const isUserAuthed = async (request) => {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });
  return Boolean(token);
};
const redirectTo = (destinationPath, request) => {
  const url = request.nextUrl.clone();
  url.pathname = destinationPath;
  return NextResponse.redirect(url);
};

export const middleware = async (request) => {

  // get request data
  const { pathname } = request.nextUrl;
  console.log({ pathname: request.nextUrl.pathname });

  // check if user is authentocated
  const isAuthed = await isUserAuthed(request);

  if (
    // user is not authed
    !isAuthed
    // and is not performing the auth flow
    && !pathname.includes('/api/auth')
    // and is not login page
    && pathname !== '/login'
  ) {
    console.log("MIDDLEWARE - REDIRECTING TO LOGIN PAGE....");
    return redirectTo('/login', request);
  }

  if (
    // user is authed
    isAuthed
    // and is login page
    && pathname === '/login'
  ) {
    console.log(`MIDDLEWARE - REDIRECTING TO HOME PAGE...`);
    return redirectTo('/', request);
  }

  console.log(`MIDDLEWARE - DO NOTHING, ALLOWED REQUEST...`);

};
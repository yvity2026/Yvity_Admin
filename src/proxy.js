import { NextResponse } from 'next/server';

export function proxy(req) {
  // const role = req.cookies.get('role'); // or from JWT

  // const url = req.nextUrl.clone();

  // if (url.pathname.startsWith('/vendor') && role !== 'vendor') {
  //   url.pathname = '/unauthorized';
  //   return NextResponse.redirect(url);
  // }

  // if (url.pathname.startsWith('/dashboard') && role !== 'user') {
  //   url.pathname = '/unauthorized';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}
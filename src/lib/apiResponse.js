import { NextResponse } from "next/server";

export function apiResponse(message, success = false, statusCode, data = "", error = "" ) {
  return NextResponse.json({
    message: message,
    success: success,
    statusCode,
    data: data,
    error: error?.message || "Unknown error",
  });
}
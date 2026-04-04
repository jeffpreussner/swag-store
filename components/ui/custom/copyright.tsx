"use client";

export function Copyright() {
  return (
     <div className="container mx-auto p-4 text-center">
        &copy; {new Date().getFullYear()} Acme, Inc.
      </div>
  );
}

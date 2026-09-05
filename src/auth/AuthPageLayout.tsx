// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/AuthPageLayout.tsx — A "CHILDREN" COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
// The first time you'll use the `children` prop! This component renders a
// centered white card, and whatever page uses it puts ITS content inside:
//
//   <AuthPageLayout>
//     <LoginForm />   ← this JSX becomes `children` and lands in the middle
//   </AuthPageLayout>
//
// So AuthPageLayout = the frame; Login/Signup = the picture in the frame.
// Tailwind note: `dark:bg-white` — this template forces auth forms to stay
// WHITE even in dark mode (a deliberate OpenSaaS choice you can change).
// ═══════════════════════════════════════════════════════════════════════════
import { ReactNode } from "react";

export function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col justify-center pt-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-xl ring-1 ring-gray-900/10 sm:rounded-lg sm:px-10 dark:bg-white dark:text-gray-900">
          <div className="-mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
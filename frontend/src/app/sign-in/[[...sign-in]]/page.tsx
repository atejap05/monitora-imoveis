import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-16">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "border-border/50 bg-card/80 shadow-xl backdrop-blur-xl",
          },
        }}
      />
    </div>
  );
}

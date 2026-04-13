import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-16">
      <SignUp
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

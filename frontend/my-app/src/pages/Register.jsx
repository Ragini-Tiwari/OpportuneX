import { SignUp } from "@clerk/clerk-react";

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative z-10">
            <SignUp
                routing="path"
                path="/register"
                signInUrl="/login"
                afterSignUpUrl="/jobs" // Or an onboarding flow to collect role
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-black-900 border border-white/10 shadow-xl",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-white text-black hover:bg-gray-200",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-black-950 border-gray-700 text-white",
                        footerActionText: "text-gray-400",
                        footerActionLink: "text-[#10b981] hover:text-[#34d399]"
                    }
                }}
            />
        </div>
    );
};

export default Register;

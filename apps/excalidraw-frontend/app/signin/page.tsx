
import AuthContainer from "@/components/AuthContainer";
import { useAuth } from "@/hooks/useAuth";

const SignInPage = () => {


  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Welcome to <span className="bg-clip-text text-transparent bg-[#006239]">WhiteBoard</span>
        </h1>
        <AuthContainer />
      </div>
    </div>
  );
};

export default SignInPage;

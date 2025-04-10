
import AuthContainer from "@/components/AuthContainer";
import { useAuth } from "@/hooks/useAuth";

const SignInPage = () => {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-50 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">WhiteBoard</span>
        </h1>
        <AuthContainer />
      </div>
    </div>
  );
};

export default SignInPage;

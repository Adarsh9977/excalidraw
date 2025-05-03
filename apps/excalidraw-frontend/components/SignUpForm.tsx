
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { CreateUserSchema } from "@repo/common/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type FormData = z.infer<typeof CreateUserSchema>;

interface SignUpFormProps {
  onToggleForm: () => void;
}

const SignUpForm = ({ onToggleForm }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router =useRouter();
  const { login, isAuthenticated, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema) as any,
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // This is where you would handle registration
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
          username: data.username,
          password: data.password,
          name: data.name
      });
      if(res.status !== 200){
          toast.error("Registration failed. Please try again.");
          return;
      }
      const token = res.data.token;
      const userId = res.data.user.id;
      login(token, userId, res.data.user);
      toast.success("Account created successfully!");
      setIsLoading(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-lg py-0">
      <CardHeader className="space-y-1 py-5 bg-gradient-to-r from-purple-500/30 to-indigo-500/10 pb-6">
        <CardTitle className="text-2xl font-bold text-center">
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("username")}
              className={errors.username ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col pb-3">
        <div className="text-sm text-center text-muted-foreground mt-2">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-indigo-600 hover:text-indigo-800"
            onClick={onToggleForm}
          >
            Sign in
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
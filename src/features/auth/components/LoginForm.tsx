import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from "../hooks/useAuth"
import authImage from "@/assets/images/4380747.jpg"
import logo from "@/assets/images/gitlylonglogo.png"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { t } = useTranslation()
  const loginMutation = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.email,
      password: data.password,
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section - Left on desktop, Bottom on mobile */}
      <div className="order-2 md:order-1 w-full md:w-1/2 h-64 md:h-screen relative">
        <img 
          src={authImage} 
          alt="Authentication" 
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay for better partition visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 md:to-white/10"></div>
      </div>

      {/* Form Section - Right on desktop, Top on mobile */}
      <div className="order-1 md:order-2 w-full md:w-1/2 flex justify-center items-center p-6 md:p-12 bg-gradient-to-br from-slate-50 to-slate-100 relative">
        {/* Partition line */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
        
        <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Gitly" className="w-[9rem] h-[5rem] object-contain" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">{t('auth.login')}</CardTitle>
            <CardDescription className="text-slate-600">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {loginMutation.isError && (
                <div className="p-3 text-sm text-git-danger bg-red-50 border border-red-200 rounded-md">
                  {loginMutation.error?.response?.data?.detail || 'Login failed. Please check your credentials.'}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">{t('auth.email')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  className="h-11 border-slate-300 focus:border-git-primary focus:ring-git-primary bg-white text-slate-900"
                  disabled={loginMutation.isPending}
                  {...form.register("email")} 
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-git-danger font-medium">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">{t('auth.password')}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="h-11 border-slate-300 focus:border-git-primary focus:ring-git-primary bg-white text-slate-900"
                  disabled={loginMutation.isPending}
                  {...form.register("password")} 
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-git-danger font-medium">{form.formState.errors.password.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold mt-6"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Logging in...' : t('auth.submit')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              {t('auth.noAccount')} <Link to="/register" className="text-git-primary hover:text-git-primary/80 font-semibold hover:underline">{t('auth.register')}</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

import { useAuthStore } from "@/store/useAuthStore"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { authApi } from "@/features/auth/api/authApi"
import logo from "@/assets/images/gitlylonglogo.png"

export function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      logout()
      navigate({ to: "/login" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Gitly" className="w-[7rem] h-[4rem] object-contain" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <span className="text-sm font-medium text-slate-700 pr-1 hidden sm:inline">{user?.email || user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

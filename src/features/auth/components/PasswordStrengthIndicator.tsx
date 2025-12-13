import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const requirements = useMemo(() => [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least one number", met: /[0-9]/.test(password) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const strength = useMemo(() => {
    return requirements.filter((req) => req.met).length;
  }, [requirements]);

  const strengthColor = useMemo(() => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength === 4) return "bg-blue-500";
    return "bg-green-500";
  }, [strength]);

  const strengthText = useMemo(() => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  }, [strength]);

  return (
    <div className="space-y-3 mt-2">
      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      
      {strengthText && (
        <p className={`text-xs font-medium text-right ${strengthColor.replace('bg-', 'text-')}`}>
          {strengthText}
        </p>
      )}

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-xs">
            {req.met ? (
              <Check className="w-3 h-3 text-green-500 mr-2" />
            ) : (
              <X className="w-3 h-3 text-slate-300 mr-2" />
            )}
            <span className={req.met ? "text-slate-700" : "text-slate-400"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

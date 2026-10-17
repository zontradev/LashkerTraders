import React from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { evaluatePasswordStrength } from '@/lib/context/auth-context';

interface PasswordStrengthMeterProps {
  password: string;
  showRules?: boolean;
}

export function PasswordStrengthMeter({ password, showRules = true }: PasswordStrengthMeterProps) {
  const strength = evaluatePasswordStrength(password);

  if (!password) {
    return null;
  }

  // 4 bar segments
  const segments = [1, 2, 3, 4];

  return (
    <div className="space-y-2 mt-2 pt-1 animate-in fade-in duration-200">
      {/* Visual meter bar & score label */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            {strength.score >= 4 ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#00b050]" />
            ) : strength.score >= 2 ? (
              <Shield className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span>Security Strength:</span>
          </span>
          <span
            className="font-bold text-xs px-2 py-0.5 rounded-md"
            style={{ color: strength.color, backgroundColor: `${strength.color}15` }}
          >
            {strength.label} {strength.score >= 4 ? '✓' : ''}
          </span>
        </div>

        {/* 4-segment progress bar */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          {segments.map((level) => {
            const isActive = strength.score >= level;
            return (
              <div
                key={level}
                className="rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? strength.color : '#e2e8f0',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Security Rules Checklist */}
      {showRules && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] space-y-1.5 text-slate-600">
          <p className="font-bold text-slate-800 text-[11px] mb-1">Password Requirements:</p>
          
          <div className="flex items-center gap-2">
            {strength.hasMinLength ? (
              <Check className="w-3.5 h-3.5 text-[#00b050] shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={strength.hasMinLength ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
              At least 8 characters long
            </span>
          </div>

          <div className="flex items-center gap-2">
            {strength.hasLowercase && strength.hasUppercase ? (
              <Check className="w-3.5 h-3.5 text-[#00b050] shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={strength.hasLowercase && strength.hasUppercase ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
              Uppercase (A–Z) & Lowercase (a–z) letters
            </span>
          </div>

          <div className="flex items-center gap-2">
            {strength.hasNumber ? (
              <Check className="w-3.5 h-3.5 text-[#00b050] shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={strength.hasNumber ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
              Contains at least one number (0–9)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {strength.hasSpecialChar ? (
              <Check className="w-3.5 h-3.5 text-[#00b050] shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={strength.hasSpecialChar ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
              Contains special character (!@#$%...)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

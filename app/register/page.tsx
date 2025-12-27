'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
      setIsLoading(false);
      return;
    }

    try {
        const result = await register(formData.username, formData.email, formData.password);
      
        if (result.success) {
          showToast('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión', 'success');
          router.push('/login');
        } else {
          showToast(result.error || 'Error al registrar usuario', 'error');
        }
    } catch (error) {
        showToast('Error al registrar usuario. Intenta de nuevo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Validación de contraseña en tiempo real
  const passwordStrength = {
    hasMinLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(formData.password),
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-secondary-50 to-pink-50 dark:from-gray-900 dark:via-primary-900/20 dark:to-secondary-900/20">
      <div className="w-full max-w-md">
        <div className="glass-effect rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Crear Cuenta</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Únete a la comunidad de Alya & Marin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="usuario123"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Password strength indicators */}
              {formData.password && (
                <div className="mt-2 space-y-1 text-xs">
                  <PasswordCheck met={passwordStrength.hasMinLength} text="Al menos 8 caracteres" />
                  <PasswordCheck met={passwordStrength.hasUpperCase} text="Una mayúscula" />
                  <PasswordCheck met={passwordStrength.hasLowerCase} text="Una minúscula" />
                  <PasswordCheck met={passwordStrength.hasNumber} text="Un número" />
                  <PasswordCheck met={passwordStrength.hasSpecialChar} text="Un carácter especial" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <span>Crear Cuenta</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para mostrar requisitos de contraseña
function PasswordCheck({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center space-x-2 ${met ? 'text-green-600' : 'text-gray-400'}`}>
      <CheckCircle size={14} className={met ? 'fill-current' : ''} />
      <span>{text}</span>
    </div>
  );
}

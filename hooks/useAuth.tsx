import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    requireAuth,
  };
}

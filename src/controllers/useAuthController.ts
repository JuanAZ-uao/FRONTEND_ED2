import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';

export type AuthMode = 'login' | 'register';

interface AuthForm {
  fullName: string;
  email: string;
  password: string;
}

const initialForm: AuthForm = {
  fullName: '',
  email: '',
  password: '',
};

const getModeFromQuery = (value: string | null): AuthMode =>
  value === 'register' ? 'register' : 'login';

export const useAuthController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(() => getModeFromQuery(searchParams.get('mode')));
  const [form, setForm] = useState<AuthForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setMode(getModeFromQuery(searchParams.get('mode')));
  }, [searchParams]);

  const onChange = (field: keyof AuthForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    const nextMode = mode === 'login' ? 'register' : 'login';
    setMode(nextMode);
    setSearchParams({ mode: nextMode });
    setFeedback('');
  };

  const submit = async () => {
    try {
      setLoading(true);
      setFeedback('');

      if (mode === 'login') {
        const result = await authService.login(form);
        authService.persistSession(result);
        setFeedback(`Bienvenido ${result.user.fullName}`);
        navigate('/profile');
      } else {
        const result = await authService.register(form);
        authService.persistSession(result);
        setFeedback(`Cuenta creada para ${result.user.fullName}`);
        navigate('/profile');
      }
    } catch (error) {
      if (error instanceof Error) {
        setFeedback(error.message);
      } else {
        setFeedback('No fue posible completar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    form,
    loading,
    feedback,
    onChange,
    toggleMode,
    submit,
  };
};

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

export type AuthMode = 'login' | 'register';

interface Step1Form {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface Step2Form {
  phone: string;
  city: string;
  birthDate: string;
  gender: string;
}

const initialStep1: Step1Form = { firstName: '', lastName: '', email: '', password: '' };
const initialStep2: Step2Form = { phone: '', city: '', birthDate: '', gender: '' };

const getModeFromQuery = (value: string | null): AuthMode =>
  value === 'register' ? 'register' : 'login';

export const useAuthController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(() => getModeFromQuery(searchParams.get('mode')));
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Step1Form>(initialStep1);
  const [step2, setStep2] = useState<Step2Form>(initialStep2);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setMode(getModeFromQuery(searchParams.get('mode')));
  }, [searchParams]);

  const onChangeStep1 = (field: keyof Step1Form, value: string) =>
    setStep1((prev) => ({ ...prev, [field]: value }));

  const onChangeStep2 = (field: keyof Step2Form, value: string) =>
    setStep2((prev) => ({ ...prev, [field]: value }));

  const toggleMode = () => {
    const next = mode === 'login' ? 'register' : 'login';
    setMode(next);
    setSearchParams({ mode: next });
    setFeedback('');
    setStep1(initialStep1);
    setStep2(initialStep2);
    setStep(1);
  };

  const advanceToStep2 = () => {
    if (!step1.firstName.trim() || !step1.lastName.trim()) {
      setFeedback('Nombre y apellido son obligatorios');
      return;
    }
    if (!step1.email.includes('@')) {
      setFeedback('Ingresa un correo válido');
      return;
    }
    if (step1.password.length < 6) {
      setFeedback('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setFeedback('');
    setStep(2);
  };

  const backToStep1 = () => {
    setFeedback('');
    setStep(1);
  };

  const submit = async () => {
    try {
      setLoading(true);
      setFeedback('');

      if (mode === 'login') {
        const result = await authService.login({ email: step1.email, password: step1.password });
        authService.persistSession(result);
        navigate('/tickets');
      } else {
        const result = await authService.register({
          firstName: step1.firstName.trim(),
          lastName: step1.lastName.trim(),
          email: step1.email,
          password: step1.password,
        });
        authService.persistSession(result);

        try {
          const updated = await userService.updateProfile({
            phone: step2.phone || null,
            city: step2.city || null,
            birthDate: step2.birthDate || null,
            gender: step2.gender || null,
          });
          authService.persistSession({ ...result, user: updated });
        } catch {
          // Non-critical — profile update failed but account was created
        }

        navigate('/tickets');
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No fue posible completar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    step,
    step1,
    step2,
    form: step1,
    loading,
    feedback,
    onChange: onChangeStep1,
    onChangeStep1,
    onChangeStep2,
    toggleMode,
    advanceToStep2,
    backToStep1,
    submit,
  };
};

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { socketQueueService } from '../services/socketQueue.service';

type QueuePhase = 'idle' | 'joining' | 'waiting' | 'redirecting' | 'error';

const clampQty = (value: number) => Math.min(Math.max(Math.floor(value), 1), 8);

export const useQueueController = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const eventId = searchParams.get('event') ?? '';
  const tierId = searchParams.get('tier') ?? '';
  const requestedQty = Number(searchParams.get('qty') || 1);
  const quantity = Number.isFinite(requestedQty) ? clampQty(requestedQty) : 1;

  const [phase, setPhase] = useState<QueuePhase>('idle');
  const [status, setStatus] = useState('Preparando sala de espera...');
  const [queuePosition, setQueuePosition] = useState(0);
  const [queueEtaSeconds, setQueueEtaSeconds] = useState(0);
  const [queueLength, setQueueLength] = useState(0);

  const grantedRef = useRef(false);

  const isPayloadValid = Boolean(eventId && tierId);

  useEffect(() => {
    if (!isPayloadValid) return;

    const activeTurn = socketQueueService.getActiveTurn();
    if (activeTurn && activeTurn.expiresAt > Date.now() && activeTurn.roomId === eventId) {
      navigate(`/checkout?event=${eventId}&tier=${tierId}&qty=${quantity}`, { replace: true });
      return;
    }

    if (activeTurn && activeTurn.roomId !== eventId) {
      socketQueueService.clearActiveTurn();
    }

    const session = authService.getSession();
    grantedRef.current = false;

    setPhase('joining');
    setStatus('Conectando con la cola de compra...');
    setQueuePosition(0);
    setQueueEtaSeconds(0);
    setQueueLength(0);

    const detachUpdate = socketQueueService.onQueueUpdate((payload) => {
      setPhase('waiting');
      setQueuePosition(payload.position);
      setQueueEtaSeconds(payload.estimatedWaitSeconds);
      setQueueLength(payload.queueLength ?? payload.position);
      setStatus('Hay usuarios comprando. Te avisaremos cuando sea tu turno.');
    });

    const detachGranted = socketQueueService.onQueueGranted(() => {
      grantedRef.current = true;
      setPhase('redirecting');
      setStatus('Tu turno fue habilitado. Redirigiendo al checkout...');
      navigate(`/checkout?event=${eventId}&tier=${tierId}&qty=${quantity}`, { replace: true });
    });

    const detachExpired = socketQueueService.onQueueExpired((payload) => {
      setPhase('error');
      setStatus(payload.message || 'Tu turno de compra termino. Debes volver a entrar a la cola.');
    });

    const detachError = socketQueueService.onQueueError((payload) => {
      setPhase('error');
      setStatus(payload.message || 'No fue posible entrar a la cola de compra.');
    });

    socketQueueService.joinQueue({
      eventSlug: eventId,
      tierId,
      quantity,
      userEmail: session?.user.email,
    });

    return () => {
      detachUpdate();
      detachGranted();
      detachExpired();
      detachError();

      if (!grantedRef.current) {
        socketQueueService.leaveQueue();
      }
    };
  }, [eventId, tierId, quantity, isPayloadValid, navigate]);

  const cancelQueue = () => {
    socketQueueService.leaveQueue();
    navigate(eventId ? `/event/${eventId}` : '/', { replace: true });
  };

  return {
    eventId,
    tierId,
    quantity,
    isPayloadValid,
    phase,
    status,
    queuePosition,
    queueEtaSeconds,
    queueLength,
    cancelQueue,
  };
};

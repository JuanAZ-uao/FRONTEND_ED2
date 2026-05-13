import { useEffect, useMemo, useState } from 'react';
import { eventService } from '../services/event.service';

export const useEventDetailController = (slug?: string) => {
  const event = useMemo(() => {
    if (!slug) return undefined;
    return eventService.getEventBySlug(slug);
  }, [slug]);

  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (event?.ticketTiers.length) {
      setSelectedTierId(event.ticketTiers[0].id);
      setQuantity(1);
    }
  }, [event]);

  const selectedTier = useMemo(
    () => event?.ticketTiers.find((tier) => tier.id === selectedTierId),
    [event, selectedTierId]
  );

  const subtotal = selectedTier ? selectedTier.price * quantity : 0;

  const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, 8));
  const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return {
    event,
    selectedTier,
    selectedTierId,
    setSelectedTierId,
    quantity,
    increaseQty,
    decreaseQty,
    subtotal,
  };
};

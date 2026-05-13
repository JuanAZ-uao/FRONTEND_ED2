import type { TicketReservation, UserProfile } from '../models/user.model';
import type { AuthSession } from '../services/auth.service';

interface DashboardStats {
	totalTickets: number;
	totalSpent: number;
	confirmed: number;
}

interface DashboardControllerState {
	session: AuthSession | null;
	profile: UserProfile | null;
	reservations: TicketReservation[];
	stats: DashboardStats;
	savePreferredGenres: (genres: string[]) => void;
}

// Redirected to /tickets — kept as typed stub while dashboard data source is migrated
export const useDashboardController = (): DashboardControllerState => ({
	session: null,
	profile: null,
	reservations: [],
	stats: { totalTickets: 0, totalSpent: 0, confirmed: 0 },
	savePreferredGenres: () => {},
});

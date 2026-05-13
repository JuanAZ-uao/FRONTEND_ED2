import type { HomeGenre } from '../../controllers/useHomeController';

interface FilterChipsProps {
  genres: HomeGenre[];
  active: HomeGenre;
  onSelect: (genre: HomeGenre) => void;
}

function FilterChips({ genres, active, onSelect }: FilterChipsProps) {
  return (
    <div className="chip-row">
      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          className={`chip ${active === genre ? 'active' : ''}`}
          onClick={() => onSelect(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default FilterChips;

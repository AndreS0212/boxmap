import { ChangeEvent, useContext, useRef, useState } from 'react';
import { PlacesContext } from '../context';
import { SearchResults } from './SearchResults';
interface Props {
  setActualPlace: (place: string) => void;
}
export const SearchBar = ({ setActualPlace }: Props) => {
  const debouncedRef = useRef<NodeJS.Timeout>();
  const { searchPlacesByTearm, setPlace } = useContext(PlacesContext)
  const [showResults, setShowResults] = useState(true);

  const onQueryChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length === 0) {
      setShowResults(false);
      return;
    } else {
      setShowResults(true);
    }

    if (debouncedRef.current)
      clearTimeout(debouncedRef.current);
    setActualPlace(value)
    debouncedRef.current = setTimeout(() => {

      searchPlacesByTearm(value)
    }, 550);
  }


  return (
    <div className='search-container'>
      <input type="text" className='w-[100%]' placeholder='Buscar lugar....' onChange={onQueryChanged} />

      <SearchResults showResults={showResults} setShowResults={setShowResults} />
    </div>
  )
}

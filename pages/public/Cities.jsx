import ContentListingPage from '../../components/pakistan/ContentListingPage';
import cityService from '../../services/cityService';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function Cities() {
  return (
    <ContentListingPage
      title="Cities"
      description="From the megacity of Karachi to the historic streets of Lahore and the planned capital, Islamabad."
      service={cityService}
      basePath="/cities"
      fallbackSeed={PLACEHOLDER_IDS.city}
    />
  );
}

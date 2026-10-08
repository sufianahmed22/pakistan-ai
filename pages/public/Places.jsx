import ContentListingPage from '../../components/pakistan/ContentListingPage';
import destinationService from '../../services/destinationService';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function Places() {
  return (
    <ContentListingPage
      title="Places to Visit"
      description="Curated destinations across Pakistan — valleys, deserts, coastlines and ancient cities."
      service={destinationService}
      basePath="/places"
      fallbackSeed={PLACEHOLDER_IDS.valley}
    />
  );
}

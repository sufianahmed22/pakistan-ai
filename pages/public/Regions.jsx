import ContentListingPage from '../../components/pakistan/ContentListingPage';
import regionService from '../../services/regionService';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function Regions() {
  return (
    <ContentListingPage
      title="Regions"
      description="Pakistan's four provinces and three territories, each with a distinct geography and culture."
      service={regionService}
      basePath="/regions"
      fallbackSeed={PLACEHOLDER_IDS.mountains}
    />
  );
}

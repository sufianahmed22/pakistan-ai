import { Phone, Clock, Navigation, Users, Globe2, Flag, Building2, Coins, Languages } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import externalService from '../../services/externalService';

// Pakistan borders only 4 countries: ISO alpha-3 codes mapped to readable names
const BORDER_NAMES = { AFG: 'Afghanistan', CHN: 'China', IND: 'India', IRN: 'Iran' };

// Authoritative default profile for Pakistan to guarantee the card is always rich & populated
const DEFAULT_COUNTRY_PROFILE = {
  flag: 'https://flagcdn.com/w160/pk.png',
  callingCode: '+92',
  timezones: ['UTC+05:00 (PKT)'],
  drivingSide: 'left',
  demonym: 'Pakistani',
  subregion: 'Southern Asia',
  independenceYear: 1947,
  borders: ['AFG', 'CHN', 'IND', 'IRN'],
  capital: 'Islamabad',
  currency: 'Pakistani Rupee (PKR)',
  officialLanguages: 'Urdu (National), English (Official)',
};

export default function CountryProfileCard() {
  const { data: rawProfile } = useFetch(() => externalService.getCountryProfile(), []);

  // Merge API profile data with defaults to ensure complete display even during network delays or partial data
  const profile = {
    flag: rawProfile?.flag || DEFAULT_COUNTRY_PROFILE.flag,
    callingCode: rawProfile?.callingCode || DEFAULT_COUNTRY_PROFILE.callingCode,
    timezones: rawProfile?.timezones?.length ? rawProfile.timezones : DEFAULT_COUNTRY_PROFILE.timezones,
    drivingSide: rawProfile?.drivingSide || DEFAULT_COUNTRY_PROFILE.drivingSide,
    demonym: rawProfile?.demonym || DEFAULT_COUNTRY_PROFILE.demonym,
    subregion: rawProfile?.subregion || DEFAULT_COUNTRY_PROFILE.subregion,
    independenceYear: rawProfile?.independenceYear || DEFAULT_COUNTRY_PROFILE.independenceYear,
    borders: rawProfile?.borders?.length ? rawProfile.borders : DEFAULT_COUNTRY_PROFILE.borders,
    capital: rawProfile?.capital || DEFAULT_COUNTRY_PROFILE.capital,
    currency: rawProfile?.currency || DEFAULT_COUNTRY_PROFILE.currency,
    officialLanguages: rawProfile?.officialLanguages || DEFAULT_COUNTRY_PROFILE.officialLanguages,
  };

  const facts = [
    { icon: Building2, label: 'Capital', value: profile.capital },
    { icon: Flag, label: 'Independence', value: profile.independenceYear ? `${profile.independenceYear} (14th August)` : '' },
    { icon: Users, label: 'Demonym', value: profile.demonym },
    { icon: Languages, label: 'Languages', value: profile.officialLanguages },
    { icon: Coins, label: 'Currency', value: profile.currency },
    { icon: Phone, label: 'Calling Code', value: profile.callingCode },
    { icon: Clock, label: 'Timezone', value: profile.timezones?.join(', ') },
    { icon: Globe2, label: 'Subregion', value: profile.subregion },
    { icon: Navigation, label: 'Driving Side', value: profile.drivingSide ? profile.drivingSide[0].toUpperCase() + profile.drivingSide.slice(1) : '' },
  ].filter((f) => f.value);

  return (
    <section className="section bg-white" aria-labelledby="country-glance-heading">
      <div className="container-narrow">
        <div className="card p-6 sm:p-8 border border-charcoal-100 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
            <div className="flex items-center gap-4">
              {profile.flag && (
                <img
                  src={profile.flag}
                  alt="Flag of Pakistan"
                  className="h-10 w-16 rounded border border-charcoal-200 object-cover shadow-sm shrink-0"
                  loading="lazy"
                />
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Quick Reference</p>
                <h2 id="country-glance-heading" className="text-h3 !text-xl text-charcoal-900">
                  Country at a Glance
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 w-fit">
              Islamic Republic of Pakistan
            </span>
          </div>

          {/* Facts Grid */}
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-sm">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3 rounded-xl bg-charcoal-50/60 border border-charcoal-100/80 transition-colors hover:bg-charcoal-50"
              >
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-charcoal-500">{label}</dt>
                  <dd className="font-semibold text-charcoal-900 mt-0.5 truncate">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {/* Bordering Countries */}
          {profile.borders?.length > 0 && (
            <div className="mt-6 pt-5 border-t border-charcoal-100 flex flex-wrap items-center gap-2 text-sm text-charcoal-600">
              <span className="font-medium text-charcoal-700 mr-1">Neighboring Borders:</span>
              {profile.borders.map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-charcoal-100/90 text-charcoal-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                >
                  {BORDER_NAMES[code] || code}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// import React, { useState, useEffect, useRef } from 'react';
// import './CountrySelector.css';

// const countries = [
//   { name: 'Afghanistan', code: 'AF', flag: '🇦🇫' },
//   { name: 'Åland Islands', code: 'AX', flag: '🇦🇽' },
//   { name: 'Albania', code: 'AL', flag: '🇦🇱' },
//   { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
//   { name: 'American Samoa', code: 'AS', flag: '🇦🇸' },
//   { name: 'Andorra', code: 'AD', flag: '🇦🇩' },
//   { name: 'Angola', code: 'AO', flag: '🇦🇴' },
//   { name: 'Anguilla', code: 'AI', flag: '🇦🇮' },
//   { name: 'Antarctica', code: 'AQ', flag: '🇦🇶' },
//   { name: 'Antigua & Barbuda', code: 'AG', flag: '🇦🇬' },
//   { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
//   { name: 'Armenia', code: 'AM', flag: '🇦🇲' },
//   { name: 'Aruba', code: 'AW', flag: '🇦🇼' },
//   { name: 'Australia', code: 'AU', flag: '🇦🇺' },
//   { name: 'Austria', code: 'AT', flag: '🇦🇹' },
//   { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿' },
//   { name: 'Bahamas', code: 'BS', flag: '🇧🇸' },
//   { name: 'Bahrain', code: 'BH', flag: '🇧🇭' },
//   { name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
//   { name: 'Barbados', code: 'BB', flag: '🇧🇧' },
//   { name: 'Belarus', code: 'BY', flag: '🇧🇾' },
//   { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
//   { name: 'Belize', code: 'BZ', flag: '🇧🇿' },
//   { name: 'Benin', code: 'BJ', flag: '🇧🇯' },
//   { name: 'Bermuda', code: 'BM', flag: '🇧🇲' },
//   { name: 'Bhutan', code: 'BT', flag: '🇧🇹' },
//   { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
//   { name: 'Bosnia & Herzegovina', code: 'BA', flag: '🇧🇦' },
//   { name: 'Botswana', code: 'BW', flag: '🇧🇼' },
//   { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
//   { name: 'British Indian Ocean Territory', code: 'IO', flag: '🇮🇴' },
//   { name: 'British Virgin Islands', code: 'VG', flag: '🇻🇬' },
//   { name: 'Brunei', code: 'BN', flag: '🇧🇳' },
//   { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
//   { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫' },
//   { name: 'Burundi', code: 'BI', flag: '🇧🇮' },
//   { name: 'Cambodia', code: 'KH', flag: '🇰🇭' },
//   { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
//   { name: 'Canada', code: 'CA', flag: '🇨🇦' },
//   { name: 'Cape Verde', code: 'CV', flag: '🇨🇻' },
//   { name: 'Caribbean Netherlands', code: 'BQ', flag: '🇧🇶' },
//   { name: 'Cayman Islands', code: 'KY', flag: '🇰🇾' },
//   { name: 'Central African Republic', code: 'CF', flag: '🇨🇫' },
//   { name: 'Chad', code: 'TD', flag: '🇹🇩' },
//   { name: 'Chile', code: 'CL', flag: '🇨🇱' },
//   { name: 'China', code: 'CN', flag: '🇨🇳' },
//   { name: 'Christmas Island', code: 'CX', flag: '🇨🇽' },
//   { name: 'Cocos (Keeling) Islands', code: 'CC', flag: '🇨🇨' },
//   { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
//   { name: 'Comoros', code: 'KM', flag: '🇰🇲' },
//   { name: 'Congo - Brazzaville', code: 'CG', flag: '🇨🇬' },
//   { name: 'Congo - Kinshasa', code: 'CD', flag: '🇨🇩' },
//   { name: 'Cook Islands', code: 'CK', flag: '🇨🇰' },
//   { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
//   { name: 'Côte d’Ivoire', code: 'CI', flag: '🇨🇮' },
//   { name: 'Croatia', code: 'HR', flag: '🇭🇷' },
//   { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
//   { name: 'Curaçao', code: 'CW', flag: '🇨🇼' },
//   { name: 'Cyprus', code: 'CY', flag: '🇨🇾' },
//   { name: 'Czechia', code: 'CZ', flag: '🇨🇿' },
//   { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
//   { name: 'Djibouti', code: 'DJ', flag: '🇩🇯' },
//   { name: 'Dominica', code: 'DM', flag: '🇩🇲' },
//   { name: 'Dominican Republic', code: 'DO', flag: '🇩🇴' },
//   { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
//   { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
//   { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
//   { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶' },
//   { name: 'Eritrea', code: 'ER', flag: '🇪🇷' },
//   { name: 'Estonia', code: 'EE', flag: '🇪🇪' },
//   { name: 'Eswatini', code: 'SZ', flag: '🇸🇿' },
//   { name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
//   { name: 'Falkland Islands', code: 'FK', flag: '🇫🇰' },
//   { name: 'Faroe Islands', code: 'FO', flag: '🇫🇴' },
//   { name: 'Fiji', code: 'FJ', flag: '🇫🇯' },
//   { name: 'Finland', code: 'FI', flag: '🇫🇮' },
//   { name: 'France', code: 'FR', flag: '🇫🇷' },
//   { name: 'French Guiana', code: 'GF', flag: '🇬🇫' },
//   { name: 'French Polynesia', code: 'PF', flag: '🇵🇫' },
//   { name: 'French Southern Territories', code: 'TF', flag: '🇹🇫' },
//   { name: 'Gabon', code: 'GA', flag: '🇬🇦' },
//   { name: 'Gambia', code: 'GM', flag: '🇬🇲' },
//   { name: 'Georgia', code: 'GE', flag: '🇬🇪' },
//   { name: 'Germany', code: 'DE', flag: '🇩🇪' },
//   { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
//   { name: 'Gibraltar', code: 'GI', flag: '🇬🇮' },
//   { name: 'Greece', code: 'GR', flag: '🇬🇷' },
//   { name: 'Greenland', code: 'GL', flag: '🇬🇱' },
//   { name: 'Grenada', code: 'GD', flag: '🇬🇩' },
//   { name: 'Guadeloupe', code: 'GP', flag: '🇬🇵' },
//   { name: 'Guam', code: 'GU', flag: '🇬🇺' },
//   { name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
//   { name: 'Guernsey', code: 'GG', flag: '🇬🇬' },
//   { name: 'Guinea', code: 'GN', flag: '🇬🇳' },
//   { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼' },
//   { name: 'Guyana', code: 'GY', flag: '🇬🇾' },
//   { name: 'Haiti', code: 'HT', flag: '🇭🇹' },
//   { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
//   { name: 'Hong Kong SAR China', code: 'HK', flag: '🇭🇰' },
//   { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
//   { name: 'Iceland', code: 'IS', flag: '🇮🇸' },
//   { name: 'India', code: 'IN', flag: '🇮🇳' },
//   { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
//   { name: 'Iran', code: 'IR', flag: '🇮🇷' },
//   { name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
//   { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
//   { name: 'Isle of Man', code: 'IM', flag: '🇮🇲' },
//   { name: 'Israel', code: 'IL', flag: '🇮🇱' },
//   { name: 'Italy', code: 'IT', flag: '🇮🇹' },
//   { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
//   { name: 'Japan', code: 'JP', flag: '🇯🇵' },
//   { name: 'Jersey', code: 'JE', flag: '🇯🇪' },
//   { name: 'Jordan', code: 'JO', flag: '🇯🇴' },
//   { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿' },
//   { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
//   { name: 'Kiribati', code: 'KI', flag: '🇰🇮' },
//   { name: 'Kosovo', code: 'XK', flag: '🇽🇰' },
//   { name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
//   { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬' },
//   { name: 'Laos', code: 'LA', flag: '🇱🇦' },
//   { name: 'Latvia', code: 'LV', flag: '🇱🇻' },
//   { name: 'Lebanon', code: 'LB', flag: '🇱🇧' },
//   { name: 'Lesotho', code: 'LS', flag: '🇱🇸' },
//   { name: 'Liberia', code: 'LR', flag: '🇱🇷' },
//   { name: 'Libya', code: 'LY', flag: '🇱🇾' },
//   { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮' },
//   { name: 'Lithuania', code: 'LT', flag: '🇱🇹' },
//   { name: 'Luxembourg', code: 'LU', flag: '🇱🇺' },
//   { name: 'Macao SAR China', code: 'MO', flag: '🇲🇴' },
//   { name: 'Madagascar', code: 'MG', flag: '🇲🇬' },
//   { name: 'Malawi', code: 'MW', flag: '🇲🇼' },
//   { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
//   { name: 'Maldives', code: 'MV', flag: '🇲🇻' },
//   { name: 'Mali', code: 'ML', flag: '🇲🇱' },
//   { name: 'Malta', code: 'MT', flag: '🇲🇹' },
//   { name: 'Marshall Islands', code: 'MH', flag: '🇲🇭' },
//   { name: 'Martinique', code: 'MQ', flag: '🇲🇶' },
//   { name: 'Mauritania', code: 'MR', flag: '🇲🇷' },
//   { name: 'Mauritius', code: 'MU', flag: '🇲🇺' },
//   { name: 'Mayotte', code: 'YT', flag: '🇾🇹' },
//   { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
//   { name: 'Micronesia', code: 'FM', flag: '🇫🇲' },
//   { name: 'Moldova', code: 'MD', flag: '🇲🇩' },
//   { name: 'Monaco', code: 'MC', flag: '🇲🇨' },
//   { name: 'Mongolia', code: 'MN', flag: '🇲🇳' },
//   { name: 'Montenegro', code: 'ME', flag: '🇲🇪' },
//   { name: 'Montserrat', code: 'MS', flag: '🇲🇸' },
//   { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
//   { name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
//   { name: 'Myanmar (Burma)', code: 'MM', flag: '🇲🇲' },
//   { name: 'Namibia', code: 'NA', flag: '🇳🇦' },
//   { name: 'Nauru', code: 'NR', flag: '🇳🇷' },
//   { name: 'Nepal', code: 'NP', flag: '🇳🇵' },
//   { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
//   { name: 'New Caledonia', code: 'NC', flag: '🇳🇨' },
//   { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
//   { name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
//   { name: 'Niger', code: 'NE', flag: '🇳🇪' },
//   { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
//   { name: 'Niue', code: 'NU', flag: '🇳🇺' },
//   { name: 'Norfolk Island', code: 'NF', flag: '🇳🇫' },
//   { name: 'North Korea', code: 'KP', flag: '🇰🇵' },
//   { name: 'North Macedonia', code: 'MK', flag: '🇲🇰' },
//   { name: 'Northern Mariana Islands', code: 'MP', flag: '🇲🇵' },
//   { name: 'Norway', code: 'NO', flag: '🇳🇴' },
//   { name: 'Oman', code: 'OM', flag: '🇴🇲' },
//   { name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
//   { name: 'Palau', code: 'PW', flag: '🇵🇼' },
//   { name: 'Palestinian Territories', code: 'PS', flag: '🇵🇸' },
//   { name: 'Panama', code: 'PA', flag: '🇵🇦' },
//   { name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬' },
//   { name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
//   { name: 'Peru', code: 'PE', flag: '🇵🇪' },
//   { name: 'Philippines', code: 'PH', flag: '🇵🇭' },
//   { name: 'Pitcairn Islands', code: 'PN', flag: '🇵🇳' },
//   { name: 'Poland', code: 'PL', flag: '🇵🇱' },
//   { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
//   { name: 'Puerto Rico', code: 'PR', flag: '🇵🇷' },
//   { name: 'Qatar', code: 'QA', flag: '🇶🇦' },
//   { name: 'Réunion', code: 'RE', flag: '🇷🇪' },
//   { name: 'Romania', code: 'RO', flag: '🇷🇴' },
//   { name: 'Russia', code: 'RU', flag: '🇷🇺' },
//   { name: 'Rwanda', code: 'RW', flag: '🇷🇼' },
//   { name: 'Samoa', code: 'WS', flag: '🇼🇸' },
//   { name: 'San Marino', code: 'SM', flag: '🇸🇲' },
//   { name: 'São Tomé & Príncipe', code: 'ST', flag: '🇸🇹' },
//   { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
//   { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
//   { name: 'Serbia', code: 'RS', flag: '🇷🇸' },
//   { name: 'Seychelles', code: 'SC', flag: '🇸🇨' },
//   { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱' },
//   { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
//   { name: 'Sint Maarten', code: 'SX', flag: '🇸🇽' },
//   { name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
//   { name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
//   { name: 'Solomon Islands', code: 'SB', flag: '🇸🇧' },
//   { name: 'Somalia', code: 'SO', flag: '🇸🇴' },
//   { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
//   { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
//   { name: 'South Sudan', code: 'SS', flag: '🇸🇸' },
//   { name: 'Spain', code: 'ES', flag: '🇪🇸' },
//   { name: 'Sri Lanka', code: 'LK', flag: '🇱🇰' },
//   { name: 'St. Barthélemy', code: 'BL', flag: '🇧🇱' },
//   { name: 'St. Helena', code: 'SH', flag: '🇸🇭' },
//   { name: 'St. Kitts & Nevis', code: 'KN', flag: '🇰🇳' },
//   { name: 'St. Lucia', code: 'LC', flag: '🇱🇨' },
//   { name: 'St. Martin', code: 'MF', flag: '🇲🇫' },
//   { name: 'St. Pierre & Miquelon', code: 'PM', flag: '🇵🇲' },
//   { name: 'St. Vincent & Grenadines', code: 'VC', flag: '🇻🇨' },
//   { name: 'Sudan', code: 'SD', flag: '🇸🇩' },
//   { name: 'Suriname', code: 'SR', flag: '🇸🇷' },
//   { name: 'Svalbard & Jan Mayen', code: 'SJ', flag: '🇸🇯' },
//   { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
//   { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
//   { name: 'Syria', code: 'SY', flag: '🇸🇾' },
//   { name: 'Taiwan', code: 'TW', flag: '🇹🇼' },
//   { name: 'Tajikistan', code: 'TJ', flag: '🇹🇯' },
//   { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
//   { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
//   { name: 'Timor-Leste', code: 'TL', flag: '🇹🇱' },
//   { name: 'Togo', code: 'TG', flag: '🇹🇬' },
//   { name: 'Tokelau', code: 'TK', flag: '🇹🇰' },
//   { name: 'Tonga', code: 'TO', flag: '🇹🇴' },
//   { name: 'Trinidad & Tobago', code: 'TT', flag: '🇹🇹' },
//   { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
//   { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
//   { name: 'Turkmenistan', code: 'TM', flag: '🇹🇲' },
//   { name: 'Turks & Caicos Islands', code: 'TC', flag: '🇹🇨' },
//   { name: 'Tuvalu', code: 'TV', flag: '🇹🇻' },
//   { name: 'U.S. Virgin Islands', code: 'VI', flag: '🇻🇮' },
//   { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
//   { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
//   { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
//   { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
//   { name: 'United States', code: 'US', flag: '🇺🇸' },
//   { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
//   { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿' },
//   { name: 'Vanuatu', code: 'VU', flag: '🇻🇺' },
//   { name: 'Vatican City', code: 'VA', flag: '🇻🇦' },
//   { name: 'Venezuela', code: 'VE', flag: '🇻🇪' },
//   { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
//   { name: 'Wallis & Futuna', code: 'WF', flag: '🇼🇫' },
//   { name: 'Western Sahara', code: 'EH', flag: '🇪🇭' },
//   { name: 'Yemen', code: 'YE', flag: '🇾🇪' },
//   { name: 'Zambia', code: 'ZM', flag: '🇿🇲' },
//   { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' },
// ];

// const CountrySelector = ({ value, onChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const selectorRef = useRef(null);

//   const handleSelect = (country) => {
//     onChange(country); // Pass the whole country object back
//     setIsOpen(false);
//     setSearchTerm('');
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (selectorRef.current && !selectorRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const filteredCountries = countries.filter(country =>
//     country.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const selectedCountry = countries.find(c => c.name === value);

//   return (
//     <div className="country-selector" ref={selectorRef}>
//       <div className="country-selector-input" onClick={() => setIsOpen(!isOpen)}>
//         {selectedCountry ? (
//           <><span className="country-selector-flag">{selectedCountry.flag}</span> {selectedCountry.name}</>
//         ) : (
//           <><span className="country-selector-flag">🌍</span> Select a country</>
//         )}
//       </div>
//       {isOpen && (
//         <div className="country-selector-dropdown">
//           <input
//             type="text"
//             className="country-selector-search"
//             placeholder="Search for a country..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <div className="country-selector-options-list">
//             {filteredCountries.map(country => (
//               <div
//                 key={country.code}
//                 className="country-selector-option"
//                 onClick={() => handleSelect(country)} // Pass the whole object
//               >
//                 <span className="country-selector-flag">{country.flag}</span> {country.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CountrySelector;













import React from 'react';
import Select, { components } from 'react-select';
import 'flag-icon-css/css/flag-icons.min.css';

// Countries list (flag code must match ISO 3166-1 alpha-2)
const countries = [
  // { name: 'Afghanistan', code: 'AF' },
  // { name: 'Albania', code: 'AL' },
  // { name: 'Algeria', code: 'DZ' },
  // { name: 'Bangladesh', code: 'BD' },
  // { name: 'India', code: 'IN' },
  // { name: 'United States', code: 'US' },
  // { name: 'United Kingdom', code: 'GB' },
  // { name: 'Germany', code: 'DE' },
  // { name: 'France', code: 'FR' },

  { name: 'Afghanistan', code: 'AF', flag: '🇦🇫' },
  { name: 'Åland Islands', code: 'AX', flag: '🇦🇽' },
  { name: 'Albania', code: 'AL', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
  { name: 'American Samoa', code: 'AS', flag: '🇦🇸' },
  { name: 'Andorra', code: 'AD', flag: '🇦🇩' },
  { name: 'Angola', code: 'AO', flag: '🇦🇴' },
  { name: 'Anguilla', code: 'AI', flag: '🇦🇮' },
  { name: 'Antarctica', code: 'AQ', flag: '🇦🇶' },
  { name: 'Antigua & Barbuda', code: 'AG', flag: '🇦🇬' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Armenia', code: 'AM', flag: '🇦🇲' },
  { name: 'Aruba', code: 'AW', flag: '🇦🇼' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', flag: '🇦🇹' },
  { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿' },
  { name: 'Bahamas', code: 'BS', flag: '🇧🇸' },
  { name: 'Bahrain', code: 'BH', flag: '🇧🇭' },
  { name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
  { name: 'Barbados', code: 'BB', flag: '🇧🇧' },
  { name: 'Belarus', code: 'BY', flag: '🇧🇾' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  { name: 'Belize', code: 'BZ', flag: '🇧🇿' },
  { name: 'Benin', code: 'BJ', flag: '🇧🇯' },
  { name: 'Bermuda', code: 'BM', flag: '🇧🇲' },
  { name: 'Bhutan', code: 'BT', flag: '🇧🇹' },
  { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
  { name: 'Bosnia & Herzegovina', code: 'BA', flag: '🇧🇦' },
  { name: 'Botswana', code: 'BW', flag: '🇧🇼' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'British Indian Ocean Territory', code: 'IO', flag: '🇮🇴' },
  { name: 'British Virgin Islands', code: 'VG', flag: '🇻🇬' },
  { name: 'Brunei', code: 'BN', flag: '🇧🇳' },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
  { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫' },
  { name: 'Burundi', code: 'BI', flag: '🇧🇮' },
  { name: 'Cambodia', code: 'KH', flag: '🇰🇭' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Cape Verde', code: 'CV', flag: '🇨🇻' },
  { name: 'Caribbean Netherlands', code: 'BQ', flag: '🇧🇶' },
  { name: 'Cayman Islands', code: 'KY', flag: '🇰🇾' },
  { name: 'Central African Republic', code: 'CF', flag: '🇨🇫' },
  { name: 'Chad', code: 'TD', flag: '🇹🇩' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Christmas Island', code: 'CX', flag: '🇨🇽' },
  { name: 'Cocos (Keeling) Islands', code: 'CC', flag: '🇨🇨' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { name: 'Comoros', code: 'KM', flag: '🇰🇲' },
  { name: 'Congo - Brazzaville', code: 'CG', flag: '🇨🇬' },
  { name: 'Congo - Kinshasa', code: 'CD', flag: '🇨🇩' },
  { name: 'Cook Islands', code: 'CK', flag: '🇨🇰' },
  { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
  { name: 'Côte d’Ivoire', code: 'CI', flag: '🇨🇮' },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷' },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
  { name: 'Curaçao', code: 'CW', flag: '🇨🇼' },
  { name: 'Cyprus', code: 'CY', flag: '🇨🇾' },
  { name: 'Czechia', code: 'CZ', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
  { name: 'Djibouti', code: 'DJ', flag: '🇩🇯' },
  { name: 'Dominica', code: 'DM', flag: '🇩🇲' },
  { name: 'Dominican Republic', code: 'DO', flag: '🇩🇴' },
  { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
  { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
  { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶' },
  { name: 'Eritrea', code: 'ER', flag: '🇪🇷' },
  { name: 'Estonia', code: 'EE', flag: '🇪🇪' },
  { name: 'Eswatini', code: 'SZ', flag: '🇸🇿' },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
  { name: 'Falkland Islands', code: 'FK', flag: '🇫🇰' },
  { name: 'Faroe Islands', code: 'FO', flag: '🇫🇴' },
  { name: 'Fiji', code: 'FJ', flag: '🇫🇯' },
  { name: 'Finland', code: 'FI', flag: '🇫🇮' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'French Guiana', code: 'GF', flag: '🇬🇫' },
  { name: 'French Polynesia', code: 'PF', flag: '🇵🇫' },
  { name: 'French Southern Territories', code: 'TF', flag: '🇹🇫' },
  { name: 'Gabon', code: 'GA', flag: '🇬🇦' },
  { name: 'Gambia', code: 'GM', flag: '🇬🇲' },
  { name: 'Georgia', code: 'GE', flag: '🇬🇪' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  { name: 'Gibraltar', code: 'GI', flag: '🇬🇮' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷' },
  { name: 'Greenland', code: 'GL', flag: '🇬🇱' },
  { name: 'Grenada', code: 'GD', flag: '🇬🇩' },
  { name: 'Guadeloupe', code: 'GP', flag: '🇬🇵' },
  { name: 'Guam', code: 'GU', flag: '🇬🇺' },
  { name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
  { name: 'Guernsey', code: 'GG', flag: '🇬🇬' },
  { name: 'Guinea', code: 'GN', flag: '🇬🇳' },
  { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼' },
  { name: 'Guyana', code: 'GY', flag: '🇬🇾' },
  { name: 'Haiti', code: 'HT', flag: '🇭🇹' },
  { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
  { name: 'Hong Kong SAR China', code: 'HK', flag: '🇭🇰' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
  { name: 'Isle of Man', code: 'IM', flag: '🇮🇲' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Jersey', code: 'JE', flag: '🇯🇪' },
  { name: 'Jordan', code: 'JO', flag: '🇯🇴' },
  { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
  { name: 'Kiribati', code: 'KI', flag: '🇰🇮' },
  { name: 'Kosovo', code: 'XK', flag: '🇽🇰' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬' },
  { name: 'Laos', code: 'LA', flag: '🇱🇦' },
  { name: 'Latvia', code: 'LV', flag: '🇱🇻' },
  { name: 'Lebanon', code: 'LB', flag: '🇱🇧' },
  { name: 'Lesotho', code: 'LS', flag: '🇱🇸' },
  { name: 'Liberia', code: 'LR', flag: '🇱🇷' },
  { name: 'Libya', code: 'LY', flag: '🇱🇾' },
  { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮' },
  { name: 'Lithuania', code: 'LT', flag: '🇱🇹' },
  { name: 'Luxembourg', code: 'LU', flag: '🇱🇺' },
  { name: 'Macao SAR China', code: 'MO', flag: '🇲🇴' },
  { name: 'Madagascar', code: 'MG', flag: '🇲🇬' },
  { name: 'Malawi', code: 'MW', flag: '🇲🇼' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { name: 'Maldives', code: 'MV', flag: '🇲🇻' },
  { name: 'Mali', code: 'ML', flag: '🇲🇱' },
  { name: 'Malta', code: 'MT', flag: '🇲🇹' },
  { name: 'Marshall Islands', code: 'MH', flag: '🇲🇭' },
  { name: 'Martinique', code: 'MQ', flag: '🇲🇶' },
  { name: 'Mauritania', code: 'MR', flag: '🇲🇷' },
  { name: 'Mauritius', code: 'MU', flag: '🇲🇺' },
  { name: 'Mayotte', code: 'YT', flag: '🇾🇹' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Micronesia', code: 'FM', flag: '🇫🇲' },
  { name: 'Moldova', code: 'MD', flag: '🇲🇩' },
  { name: 'Monaco', code: 'MC', flag: '🇲🇨' },
  { name: 'Mongolia', code: 'MN', flag: '🇲🇳' },
  { name: 'Montenegro', code: 'ME', flag: '🇲🇪' },
  { name: 'Montserrat', code: 'MS', flag: '🇲🇸' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
  { name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
  { name: 'Myanmar (Burma)', code: 'MM', flag: '🇲🇲' },
  { name: 'Namibia', code: 'NA', flag: '🇳🇦' },
  { name: 'Nauru', code: 'NR', flag: '🇳🇷' },
  { name: 'Nepal', code: 'NP', flag: '🇳🇵' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'New Caledonia', code: 'NC', flag: '🇳🇨' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
  { name: 'Niger', code: 'NE', flag: '🇳🇪' },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  { name: 'Niue', code: 'NU', flag: '🇳🇺' },
  { name: 'Norfolk Island', code: 'NF', flag: '🇳🇫' },
  { name: 'North Korea', code: 'KP', flag: '🇰🇵' },
  { name: 'North Macedonia', code: 'MK', flag: '🇲🇰' },
  { name: 'Northern Mariana Islands', code: 'MP', flag: '🇲🇵' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴' },
  { name: 'Oman', code: 'OM', flag: '🇴🇲' },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
  { name: 'Palau', code: 'PW', flag: '🇵🇼' },
  { name: 'Palestinian Territories', code: 'PS', flag: '🇵🇸' },
  { name: 'Panama', code: 'PA', flag: '🇵🇦' },
  { name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬' },
  { name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪' },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭' },
  { name: 'Pitcairn Islands', code: 'PN', flag: '🇵🇳' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
  { name: 'Puerto Rico', code: 'PR', flag: '🇵🇷' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦' },
  { name: 'Réunion', code: 'RE', flag: '🇷🇪' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺' },
  { name: 'Rwanda', code: 'RW', flag: '🇷🇼' },
  { name: 'Samoa', code: 'WS', flag: '🇼🇸' },
  { name: 'San Marino', code: 'SM', flag: '🇸🇲' },
  { name: 'São Tomé & Príncipe', code: 'ST', flag: '🇸🇹' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
  { name: 'Serbia', code: 'RS', flag: '🇷🇸' },
  { name: 'Seychelles', code: 'SC', flag: '🇸🇨' },
  { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'Sint Maarten', code: 'SX', flag: '🇸🇽' },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
  { name: 'Solomon Islands', code: 'SB', flag: '🇸🇧' },
  { name: 'Somalia', code: 'SO', flag: '🇸🇴' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'South Sudan', code: 'SS', flag: '🇸🇸' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', flag: '🇱🇰' },
  { name: 'St. Barthélemy', code: 'BL', flag: '🇧🇱' },
  { name: 'St. Helena', code: 'SH', flag: '🇸🇭' },
  { name: 'St. Kitts & Nevis', code: 'KN', flag: '🇰🇳' },
  { name: 'St. Lucia', code: 'LC', flag: '🇱🇨' },
  { name: 'St. Martin', code: 'MF', flag: '🇲🇫' },
  { name: 'St. Pierre & Miquelon', code: 'PM', flag: '🇵🇲' },
  { name: 'St. Vincent & Grenadines', code: 'VC', flag: '🇻🇨' },
  { name: 'Sudan', code: 'SD', flag: '🇸🇩' },
  { name: 'Suriname', code: 'SR', flag: '🇸🇷' },
  { name: 'Svalbard & Jan Mayen', code: 'SJ', flag: '🇸🇯' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'Syria', code: 'SY', flag: '🇸🇾' },
  { name: 'Taiwan', code: 'TW', flag: '🇹🇼' },
  { name: 'Tajikistan', code: 'TJ', flag: '🇹🇯' },
  { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { name: 'Timor-Leste', code: 'TL', flag: '🇹🇱' },
  { name: 'Togo', code: 'TG', flag: '🇹🇬' },
  { name: 'Tokelau', code: 'TK', flag: '🇹🇰' },
  { name: 'Tonga', code: 'TO', flag: '🇹🇴' },
  { name: 'Trinidad & Tobago', code: 'TT', flag: '🇹🇹' },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
  { name: 'Turkmenistan', code: 'TM', flag: '🇹🇲' },
  { name: 'Turks & Caicos Islands', code: 'TC', flag: '🇹🇨' },
  { name: 'Tuvalu', code: 'TV', flag: '🇹🇻' },
  { name: 'U.S. Virgin Islands', code: 'VI', flag: '🇻🇮' },
  { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
  { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿' },
  { name: 'Vanuatu', code: 'VU', flag: '🇻🇺' },
  { name: 'Vatican City', code: 'VA', flag: '🇻🇦' },
  { name: 'Venezuela', code: 'VE', flag: '🇻🇪' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  { name: 'Wallis & Futuna', code: 'WF', flag: '🇼🇫' },
  { name: 'Western Sahara', code: 'EH', flag: '🇪🇭' },
  { name: 'Yemen', code: 'YE', flag: '🇾🇪' },
  { name: 'Zambia', code: 'ZM', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' },
  // ... baki countries same format e add korben
];

// Custom option component for react-select
const Option = (props) => {
  return (
    <components.Option {...props}>
      <span className={`flag-icon flag-icon-${props.data.code.toLowerCase()}`} style={{ marginRight: 8 }}></span>
      {props.data.name}
    </components.Option>
  );
};

// Custom single value component for react-select
const SingleValue = (props) => {
  return (
    <components.SingleValue {...props}>
      <span className={`flag-icon flag-icon-${props.data.code.toLowerCase()}`} style={{ marginRight: 8 }}></span>
      {props.data.name}
    </components.SingleValue>
  );
};

const CountrySelector = ({ value, onChange }) => {
  // Find selected country object
  const selectedCountry = countries.find(c => c.name === value);

  return (
    <Select
      options={countries}
      getOptionLabel={option => option.name}
      getOptionValue={option => option.name}
      value={selectedCountry || null}
      onChange={onChange}
      components={{ Option, SingleValue }}
      placeholder="Select a country"
      isClearable
      styles={{
        control: (provided) => ({ ...provided, minHeight: '50px' }),
        option: (provided) => ({ ...provided, color: '#000' }),
        singleValue: (provided) => ({ ...provided, color: '#000' }),
      }}
    />
  );
};

export default CountrySelector;

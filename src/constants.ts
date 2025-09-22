import { IconType } from 'react-icons';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa';

type LinkItem = {
  label: string;
  href: string;
};

type ServiceLink = LinkItem;

type NavLink = LinkItem;

export type SocialLink = LinkItem & {
  icon: IconType;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ServiceContent = {
  id: string;
  title: string;
  image: string | null;
  paragraphs: string[];
};

export type FleetVehicle = {
  name: string;
  category: string;
  description: string;
  image: string;
  passengers: number;
  luggage: number;
};

export type FooterLinkGroup = {
  title: string;
  links: LinkItem[];
};

export const CONTACT_EMAIL = 'office@limosen.at';
export const CONTACT_PHONE = '+43 660 876 06 06';
export const CONTACT_PHONE_TEL = '+436608760606';

export const NAV_LINKS: NavLink[] = [
  { label: 'Service', href: '#services' },
  { label: 'Hauptseite', href: 'https://limosen.at/de' },
  { label: 'Unsere Fahrzeuge', href: '#fahrzeuge' },
  { label: 'Kundenfeedback', href: 'https://limosen.at/de/feedback' },
  { label: 'Registrieren', href: 'https://limosen.at/de/register/driver' },
  { label: 'Kontakt', href: 'https://limosen.at/de/page/contact' },
];

export const SERVICE_LINKS: ServiceLink[] = [
  { label: 'Flughafentransfer', href: '#flughafentransfer' },
  { label: 'Stadtreise', href: '#stadtreise' },
  { label: 'Individueller Fahrer-Service', href: '#individueller-fahrer-service' },
  { label: 'Institutionelle Dienstleistungen', href: '#institutionelle-dienstleistungen' },
  { label: 'Ortschaftstransfer', href: '#ortschaftstransfer' },
  { label: 'Auslandtransfer', href: '#auslandtransfer' },
  { label: 'Transfer Zwischen Den Bundesländern', href: '#transfer-zwischen-den-bundeslaendern' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/exclusiveaustriantransfer', icon: FaFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com/exclusive_austrian_transfer', icon: FaInstagram },
  { label: 'Twitter', href: 'https://www.twitter.com/exclusive_a_t', icon: FaTwitter },
];

export const HERO_SLIDES: string[] = [
  'https://admin.limosen.at/uploads/beauty_of_vienna-wallpaper-1920x10802-1593739458218.jpg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589243923726.jpeg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244001207.jpeg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244017831.jpeg',
  'https://admin.limosen.at/uploads/vienna_austria_cityscape_4k-hd_wallpapers2-1593739468623.jpg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244160841.jpeg',
  'https://admin.limosen.at/uploads/wien-hofburg-palace-at-night_2880x18002-1593740896794.jpg',
];

export const LOGO_SRC = 'https://admin.limosen.at/uploads/7-1601985268947.png';
export const FLAG_SRC = 'https://limosen.at/flags/de.png';
export const ABOUT_IMAGE = 'https://limosen.at/_nuxt/img/cars.3ec3e98.jpg';
export const BOOKING_BACKGROUND = 'https://limosen.at/_nuxt/img/home-2.32cb6f9.jpg';

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Welche Fahrzeugklassen stehen zur Auswahl?',
    answer:
      'Unsere Flotte umfasst Business- und First-Class-Modelle wie die Mercedes-Benz E Klasse, die V Klasse für Gruppen sowie die luxuriöse S Klasse für repräsentative Anlässe.',
  },
  {
    question: 'Wie läuft der Flughafentransfer ab?',
    answer:
      'Ihre vorgebuchten Chauffeure warten direkt am Flughafen, übernehmen Ihr Gepäck und bringen Sie ohne Wartezeiten sicher und komfortabel an Ihr Ziel – auf Wunsch auch wieder zurück.',
  },
  {
    question: 'Gibt es Kindersitze oder mehrsprachige Fahrer?',
    answer:
      'Auf Anfrage stellen wir Kindersitze, mehrsprachige Chauffeure in formeller Kleidung sowie bei Bedarf Übersetzer zur Verfügung, damit jede Fahrt Ihren Erwartungen entspricht.',
  },
  {
    question: 'Sind internationale Transfers möglich?',
    answer:
      'Ja, wir organisieren Auslandsfahrten zu Destinationen wie Bratislava, Budapest, Prag oder Venedig und begleiten Sie mit Tracking-System und persönlichem Service während der gesamten Reise.',
  },
];

export const SERVICES_CONTENT: ServiceContent[] = [
  {
    id: 'flughafentransfer',
    title: 'Flughafentransfer',
    image: 'https://admin.limosen.at/uploads/airport-transfer-1581462786357.jpg',
    paragraphs: [
      'Am internationalen Flughafen Wien bieten wir Ihnen mit dem professionellsten Transferservice der Stadt Luxus und Komfort.',
      'Unsere, speziell für Sie eingerichteten vorgebuchten Luxusfahrzeuge warten mit erfahrenen Fahrern am Flughafen auf Ihre Transfer-Anordnungen.',
      'Um Ihr Ziel nach Ihrer Landung zu erreichen, können sie sich sofort ein Fahrzeug zuteilen lassen.',
      'Wir verhelfen Ihnen zu einem dynamischeren und energischeren Start in Ihren Urlaub und auf gleiche Weise, bringen wir Sie nach Ihrem Urlaub wieder auf den Flughafen zurück.',
    ],
  },
  {
    id: 'stadtreise',
    title: 'Stadtreise',
    image: 'https://admin.limosen.at/uploads/driver-1581462805549.jpg',
    paragraphs: [
      'Durch unseren Tour-Service zu allen touristischen Orten innerhalb Österreichs, bieten wir durch unsere Mercedes-Benz-Fahrzeuge Luxus und Komfort in Einem.',
      'Mit unseren kompetenten Fahrern reisen Sie auf festgelegten Routen und finden Gelegenheit, die kulturelle, historische Struktur und Naturschönheiten Österreichs zu besichtigen.',
      'Wir haben Touren zum Stephansdom, nach Hofburg, Schönbrunn, Kahlenberg, zur Salzburger Altstadt, Seepromenade, nach Hallstadt, Eisriesenwelt, zum Gollinger Wasserfall und noch zu vielen sehenswerten Orten.',
      'Während Ihrer Tour sind wir für Ihre Sicherheit und Gelassenheit verantwortlich und wählen daher die praktischste, sicherste und einfachste Route aus.',
      'Unser Unternehmen entwickelt sich diesbezüglich ständig weiter und ist bestrebt, seinen Gästen immer hochwertigen Service anzubieten.',
      'Während Sie unsere sicheren und komfortablen Standards genießen, möchten wir Sie noch einmal darauf aufmerksam machen, dass Sie von allen Top-Einrichtungen, die wir Ihnen in unseren neuesten Mercedes-Benz Fahrzeugen anbieten, profitieren können.',
      'Wenn Sie möchten, können Sie Ihre Tour in Begleitung des von uns zugewiesenen Reiseleiters durchführen, ein angenehmeres und besonderes Erlebnis haben und unvergessliche Erinnerungen sammeln.',
    ],
  },
  {
    id: 'individueller-fahrer-service',
    title: 'Individueller Fahrer-Service',
    image: 'https://admin.limosen.at/uploads/limousine-1581462830996.jpg',
    paragraphs: [
      'Wenn Sie zum Beispiel ein Meeting in Wien haben, einen Gast herumführen oder bequem zu Ihrer Arbeit fahren möchten benötigen Sie möglicherweise ein VIP-Fahrzeug der Marken Mercedes-Benz V-Klasse (Business Van), S-Klasse (First Class) und E-Klasse (Business Class).',
      'Wenn Sie nach einem luxuriösen und komfortablen Service suchen, sind Sie hier richtig.',
      'Wir garantieren Ihnen, dass die Zeit, die Sie im Verkehr verbringen, blitzschnell vergehen wird und die Umweltfaktoren keinen Einfluss auf Sie haben werden.',
      'Darüber hinaus bieten wir Dienstleistungen wie privaten Fahrer mit Fremdsprachenkenntnissen und formeller Kleidung und auf Wunsch private Übersetzer an. Somit genießen Sie einen bequemeren Aufenthalt.',
      'Da wir in jeder Hinsicht an Ihre Sicherheit und natürlich auch an die Sicherheit Ihrer Kinder denken, befindet sich im Fahrzeug auch ein Kindersitz.',
      'Somit verbringen Sie eine sichere Fahrt im Verkehr und brauchen sich auch keine Sorgen um die Sicherheit Ihres Kindes zu machen.',
      'Da private Transfers nach den Ankunftszeiten der Gäste organisiert werden, gibt es an den Flughäfen keine Wartezeit.',
      'An den Ankunftsorten werden unsere Gäste von unseren Mitarbeitern empfangen und zu den Fahrzeugen geleitet, die sie transportieren werden.',
      'Auf diese Weise gelangen sie zum richtigen Fahrzeug.',
      'In unserem VIP-Fahrzeug der Marke Mercedes-Benz können Sie sich sicher und geborgen fühlen.',
      'Obgleich unsere Mitarbeiter alles mögliche unternehmen werden, um Ihren Komfort und Ihre Bequemlichkeit zu gewährleisten, können Sie sich bezüglich Ihrer zusätzlichen Bedürfnisse an unser Unternehmen wenden und Anfragen stellen.',
      'Da unsere Prinzipien auf Gastfreundschaft basieren, sind wir bestrebt unseren Gästen so gut wie möglich behilflich zu sein.',
    ],
  },
  {
    id: 'institutionelle-dienstleistungen',
    title: 'Institutionelle Dienstleistungen',
    image: null,
    paragraphs: [
      'Aufgrund unserer jahrelangen Erfahrung, versichern wir, dass alle, durch uns erbrachten Dienste im Rahmen eines gut durchdachten Planes und Programms erstellt wurden und unsere Qualitätsstandards ständig aktualisiert und an die weltweite Konjunktur angepasst werden.',
      'Für die Transportanforderungen Ihres Unternehmens können Sie, indem Sie uns Informationen über Destinationen weitergeben, günstige Preisangebote erhalten und von unseren Pauschalpreisen profitieren.',
      '• Organisationstransfers',
      '• Touristischer Transfers',
      '• Sportmannschaftstransfers',
      '• Eröffnung, Feier Transfers',
      '• Unternehmens- und Gewerkschaftstransfers',
      '• Gruppentransfers',
      '• Roadshow-Transfers',
      '• Messentransfer',
      '• Fahrzeugsoptionen in verschiedenen Segmenten',
      'Wir bieten Lösungen in den Bereichen institutioneller Verkauf, Fahrzeugzuteilung. Jede bestätigte Reservierung, ist eine Zusage an Sie.',
    ],
  },
  {
    id: 'ortschaftstransfer',
    title: 'Ortschaftstransfer',
    image: null,
    paragraphs: [
      'Das Exclusive Austrian Transfer Team holt Sie vom Hotel, Wohnort, Adresse oder Aufenthaltsort, den Sie angegeben haben, ohne Wartezeiten ab und bringt Sie unabhängig von der Fahrstrecke unter Genuss einer hochwertigen Fahrt zum gewünschten Ankunftsort.',
      'Anhand unserer Erfahrung in diesem Bereich bestimmen wir Ihre Route mit großer Sorgfalt und wählen die praktischste, sicherste und einfachste Route, um die Zeit, die sie im Verkehr verbringen werden, zu minimieren.',
    ],
  },
  {
    id: 'auslandtransfer',
    title: 'Auslandtransfer',
    image: null,
    paragraphs: [
      'Der Flughafen von Wien, eine der zentralsten Hauptstädte Europas, ist aufgrund seiner Lage der wichtigste Punkt für internationale Transfers.',
      'Als Flughafen-Transferservice empfangen wir Sie, tragen Ihr Gepäck vorsichtig bis zum Fahrzeug und bringen Sie zu Ihrer gewünschten Destination wie z.B. Bratislava, Budapest, Prag, Venedig und weitere Orte innerhalb der Schengen-Ländern.',
      'Gemäß unserer Unternehmensrichtlinien ist die Sicherheit unserer Kunden für uns einer der wichtigsten Faktoren.',
      'Wir werden Sie bis zu Ihrer Ankunft in unseren Fahrzeugen begleiten und dank unserem Fahrzeug-Tracking-System werden Sie sich immer sicher fühlen und Ihre Reise genießen.',
    ],
  },
  {
    id: 'transfer-zwischen-den-bundeslaendern',
    title: 'Transfer Zwischen Den Bundesländern',
    image: null,
    paragraphs: [
      'Die Bundesrepublik Österreich besteht aus neun Bundesländern. Wien, Niederösterreich, Oberösterreich, Steiermark, Tirol, Kärnten, Salzburg, Vorarlberg, Burgenland.',
      'In Österreich, wo Reisen zwischen den Bundesländern sehr intensiv sind, sorgen wir dafür, dass Sie nach Ihrer Landung wenn Sie kein Fahrzeug bereit haben oder öffentliche Verkehrsmittel aus zeitlichen Gründen nicht nutzen können, mit oder ohne Reservierung, sicher ihr Zielort erreichen.',
    ],
  },
];

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    name: 'Mercedes-Benz E Klasse',
    category: 'Business Class',
    description: 'E 350 d AMG Line - 2015 / 2016',
    image: 'https://admin.limosen.at/uploads/mercedes-benz-e-klasse%20e350d-1589814289680.jpg',
    passengers: 4,
    luggage: 3,
  },
  {
    name: 'Mercedes-Benz V Klasse',
    category: 'Business Class',
    description: 'V 250 d extralang - 2018',
    image: 'https://admin.limosen.at/uploads/vclass-1581462635925.jpeg',
    passengers: 7,
    luggage: 7,
  },
  {
    name: 'Mercedes-Benz S Klasse',
    category: 'First Class',
    description: 'S 400 d lang 4MATIC - 2020',
    image: 'https://admin.limosen.at/uploads/sclass-1581462643811.jpeg',
    passengers: 3,
    luggage: 2,
  },
  {
    name: 'Mercedes-Benz E Klasse',
    category: 'Business Class',
    description: 'E 220 d AMG Line - 2017 / 2018 / 2019',
    image: 'https://admin.limosen.at/uploads/eclass-1581462657307.jpeg',
    passengers: 4,
    luggage: 3,
  },
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Hauptseite', href: 'https://limosen.at/de' },
      { label: 'Unsere Fahrzeuge', href: 'https://limosen.at/de/cars' },
      { label: 'Kundenfeedback', href: 'https://limosen.at/de/feedback' },
      { label: 'Kontakt', href: 'https://limosen.at/de/page/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Registrieren', href: 'https://limosen.at/de/register/driver' },
      { label: 'Jetzt buchen', href: 'https://limosen.at/de/booking' },
      { label: 'Impressum', href: 'https://limosen.at/de/page/imprint' },
      { label: 'Datenschutz', href: 'https://limosen.at/de/page/privacy' },
    ],
  },
  {
    title: 'Kontakt',
    links: [
      { label: CONTACT_PHONE, href: `https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}` },
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      { label: 'Schreiben Sie uns', href: 'https://limosen.at/de/page/contact' },
    ],
  },
];

export const SERVICE_NAVIGATION_EVENT = 'service-accordion:navigate';

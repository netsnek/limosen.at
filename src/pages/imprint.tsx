import { Field, PageConfig, PageProps } from 'jaen';
import { Box } from '@chakra-ui/react';
import { graphql } from 'gatsby';
import * as React from 'react';

const ImprintPage: React.FC<PageProps> = () => {
  return (
    <Box as="main">
      <Field.Editor
        name="imprint"
        defaultValue={`# Impressum

**Medieninhaber, Diensteanbieter & Betreiber der Website (ECG, UGB, GewO, MedienG §25)**  
**LIMOSEN KG**  
Rechtsform: Kommanditgesellschaft  
Sitz: Mannswörth, polit. Gemeinde Schwechat (Niederösterreich)  
Geschäftsanschrift (Hauptadresse): Mannswörther Straße 59–61/12/5, 2320 Schwechat, Österreich  
Weitere Anschrift (Wien): Margaretengürtel 42/3/16, 1050 Wien, Österreich

**Kontakt**  
Telefon: +43 660 876 06 06  
E-Mail: office@limosen.at  
Facebook: exclusiveaustriantransfer  
Instagram: @exclusive_austrian_transfer  
Twitter/X: @exclusive_a_t

**Unternehmensdaten**  
Firmenbuchnummer: FN 447754 m  
Firmenbuchgericht: Landesgericht Korneuburg  
UID-Nummer: ATU70712428  
Geschäftszweig: Taxi, Mietwagen & Limousinenservice

**Vertretungs- & Verantwortungsangaben**  
Geschäftsinhaber: Aykut CETINKAYA  
Gewerberechtlicher Geschäftsführer: Ertan SEN

**Zuständige Aufsichts-/Gewerbebehörde (GewO)**  
Bezirkshauptmannschaft Bruck an der Leitha – Außenstelle Schwechat, Hauptplatz 4, 2320 Schwechat

**Berufsrechtliche Vorschriften**  
Gewerbeordnung (GewO) in der geltenden Fassung sowie einschlägige landesrechtliche Vorschriften.  
Zugriff auf Rechtsvorschriften: ris.bka.gv.at

---

## Offenlegung nach § 25 Mediengesetz (Blattlinie)
Diese Website informiert über das Unternehmen LIMOSEN KG sowie über angebotene Dienstleistungen (Taxi-, Mietwagen- und Limousinenservice), Preise, Buchungsmöglichkeiten und Kontaktinformationen. Ziel ist die Förderung des Absatzes eigener Dienstleistungen.

---

## Online-Streitbeilegung / Verbraucherinformation
Plattform der EU-Kommission zur Online-Streitbeilegung (OS-Plattform): https://ec.europa.eu/consumers/odr  
Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

---

## Haftungsausschluss
Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für Richtigkeit, Vollständigkeit und Aktualität der Inhalte. Verbindlich sind ausschließlich individuell vereinbarte Leistungsinhalte und Preise.  
Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.

---

## Urheberrecht
Texte, Bilder, Grafiken und sonstige Inhalte dieser Website sind – soweit nicht anders gekennzeichnet – urheberrechtlich geschützt. Jede Nutzung über die gesetzlich zulässigen Fälle hinaus bedarf unserer vorherigen schriftlichen Zustimmung.

---

## Datenschutz
Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer **Datenschutzerklärung**.

---

## Gender-Hinweis
Aus Gründen der besseren Lesbarkeit wird auf dieser Website teilweise auf eine geschlechtergerechte Sprachform verzichtet. Sämtliche Personenbezeichnungen gelten gleichermaßen für alle Geschlechter.

---

*© LIMOSEN KG – alle Rechte vorbehalten.*
`}
      />
    </Box>
  );
};

export default ImprintPage;

export const pageConfig: PageConfig = {
  label: 'Imprint page',
  icon: 'FaPassport'
};

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`;

export { Head } from 'jaen';

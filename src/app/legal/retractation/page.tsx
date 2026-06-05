import { Metadata } from "next";

export const metadata: Metadata = { title: "Droit de r\u00e9tractation \u2014 Momenterie" };

export default function RetractationPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-gray">
      <h1>Droit de r\u00e9tractation</h1>

      <h2>Produits personnalis\u00e9s</h2>
      <p>Conform\u00e9ment \u00e0 l\u2019article L221-28, 3\u00b0 du Code de la consommation, <strong>le droit de r\u00e9tractation ne s\u2019applique pas</strong> aux biens confectionn\u00e9s selon les sp\u00e9cifications du consommateur ou nettement personnalis\u00e9s.</p>
      <p>Tous nos produits (cartes de villes, cartes du ciel, puzzles photo) sont fabriqu\u00e9s \u00e0 la demande avec vos personnalisations uniques et ne peuvent \u00eatre revendus.</p>

      <h2>Notre engagement qualit\u00e9</h2>
      <p>Si vous recevez un produit pr\u00e9sentant un d\u00e9faut de fabrication (erreur d\u2019impression, produit endommag\u00e9 pendant le transport), nous nous engageons \u00e0 le remplacer ou \u00e0 vous rembourser. Contactez-nous \u00e0 contact@momenterie.com avec une photo du probl\u00e8me dans les 14 jours suivant la r\u00e9ception.</p>

      <h2>Formulaire de r\u00e9clamation</h2>
      <p>Pour toute r\u00e9clamation concernant un d\u00e9faut de fabrication, veuillez nous contacter par email \u00e0 <a href="mailto:contact@momenterie.com">contact@momenterie.com</a> en pr\u00e9cisant :</p>
      <ul>
        <li>Votre num\u00e9ro de commande</li>
        <li>Une description du probl\u00e8me</li>
        <li>Une ou plusieurs photos du produit re\u00e7u</li>
      </ul>
      <p>Nous vous r\u00e9pondrons sous 48 heures ouvrables.</p>
    </div>
  );
}

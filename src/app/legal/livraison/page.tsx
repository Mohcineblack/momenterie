import { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de livraison \u2014 Momenterie" };

export default function LivraisonPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-gray">
      <h1>Politique de livraison</h1>

      <h2>D\u00e9lais de fabrication</h2>
      <p>Chaque produit est cr\u00e9\u00e9 sur mesure apr\u00e8s votre commande. Le d\u00e9lai de fabrication est de 3 \u00e0 5 jours ouvrables.</p>

      <h2>D\u00e9lais de livraison</h2>
      <ul>
        <li><strong>France m\u00e9tropolitaine :</strong> 5 \u00e0 8 jours ouvrables apr\u00e8s exp\u00e9dition</li>
        <li><strong>Union Europ\u00e9enne :</strong> 7 \u00e0 12 jours ouvrables</li>
        <li><strong>Suisse :</strong> 8 \u00e0 14 jours ouvrables</li>
        <li><strong>Royaume-Uni :</strong> 7 \u00e0 14 jours ouvrables</li>
      </ul>

      <h2>Frais de livraison</h2>
      <ul>
        <li><strong>Gratuit</strong> d\u00e8s 59 \u20ac d\u2019achat</li>
        <li>France et UE : 4,95 \u20ac</li>
        <li>Suisse : 9,95 \u20ac</li>
        <li>Royaume-Uni : 7,95 \u20ac</li>
      </ul>

      <h2>Suivi de commande</h2>
      <p>Un email de confirmation d\u2019exp\u00e9dition avec un lien de suivi vous est envoy\u00e9 d\u00e8s que votre commande est prise en charge par le transporteur.</p>

      <h2>Probl\u00e8me de livraison</h2>
      <p>En cas de colis endommag\u00e9 ou non re\u00e7u, contactez-nous \u00e0 contact@momenterie.com dans les 14 jours suivant la date de livraison pr\u00e9vue.</p>
    </div>
  );
}

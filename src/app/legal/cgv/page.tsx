import { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions G\u00e9n\u00e9rales de Vente \u2014 Momenterie" };

export default function CgvPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-gray">
      <h1>Conditions G\u00e9n\u00e9rales de Vente</h1>
      <p><em>Derni\u00e8re mise \u00e0 jour : juin 2026</em></p>

      <h2>1. Objet</h2>
      <p>Les pr\u00e9sentes CGV r\u00e9gissent les ventes de produits personnalis\u00e9s propos\u00e9s par Momenterie sur le site momenterie.com.</p>

      <h2>2. Produits</h2>
      <p>Les produits sont des cr\u00e9ations personnalis\u00e9es (cartes de villes, cartes du ciel, puzzles photo) fabriqu\u00e9es \u00e0 la demande selon les sp\u00e9cifications du client.</p>

      <h2>3. Prix</h2>
      <p>Les prix sont indiqu\u00e9s en euros TTC. TVA non applicable, article 293 B du CGI. Les frais de livraison sont indiqu\u00e9s avant validation de la commande.</p>

      <h2>4. Commande</h2>
      <p>La validation de la commande implique l\u2019acceptation des pr\u00e9sentes CGV. Le paiement est effectu\u00e9 par carte bancaire via Stripe.</p>

      <h2>5. Livraison</h2>
      <p>Les d\u00e9lais de livraison sont indiqu\u00e9s \u00e0 titre indicatif. Voir notre politique de livraison pour plus de d\u00e9tails.</p>

      <h2>6. Droit de r\u00e9tractation</h2>
      <p>Conform\u00e9ment \u00e0 l\u2019article L221-28 du Code de la consommation, le droit de r\u00e9tractation ne s\u2019applique pas aux produits personnalis\u00e9s ou confectionn\u00e9s selon les sp\u00e9cifications du consommateur. Voir notre page d\u00e9di\u00e9e.</p>

      <h2>7. Garantie</h2>
      <p>En cas de d\u00e9faut de fabrication ou de non-conformit\u00e9, contactez-nous \u00e0 contact@momenterie.com dans les 14 jours suivant la r\u00e9ception.</p>

      <h2>8. Droit applicable</h2>
      <p>Les pr\u00e9sentes CGV sont soumises au droit fran\u00e7ais. Tout litige rel\u00e8ve des tribunaux comp\u00e9tents.</p>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialit\u00e9 \u2014 Momenterie" };

export default function ConfidentialitePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-gray">
      <h1>Politique de confidentialit\u00e9</h1>
      <p><em>Derni\u00e8re mise \u00e0 jour : juin 2026</em></p>

      <h2>1. Responsable du traitement</h2>
      <p>Momenterie, 43 rue des picards, 77750 Orly-sur-Morin, France. Contact : contact@momenterie.com</p>

      <h2>2. Donn\u00e9es collect\u00e9es</h2>
      <p>Nous collectons : nom, pr\u00e9nom, adresse email, adresse postale, t\u00e9l\u00e9phone (optionnel), donn\u00e9es de paiement (trait\u00e9es par Stripe), donn\u00e9es de personnalisation des produits.</p>

      <h2>3. Finalit\u00e9s</h2>
      <p>Vos donn\u00e9es sont utilis\u00e9es pour : traiter vos commandes, vous livrer, communiquer sur l\u2019\u00e9tat de votre commande, am\u00e9liorer nos services, et vous envoyer notre newsletter (avec votre consentement).</p>

      <h2>4. Base l\u00e9gale</h2>
      <p>Ex\u00e9cution du contrat (commandes), consentement (newsletter), int\u00e9r\u00eat l\u00e9gitime (am\u00e9lioration du service).</p>

      <h2>5. Dur\u00e9e de conservation</h2>
      <p>Donn\u00e9es de commande : 5 ans (obligation comptable). Donn\u00e9es de compte : dur\u00e9e de vie du compte + 3 ans. Newsletter : jusqu\u2019au d\u00e9sabonnement.</p>

      <h2>6. Vos droits (RGPD)</h2>
      <p>Vous disposez d\u2019un droit d\u2019acc\u00e8s, de rectification, de suppression, de portabilit\u00e9, de limitation et d\u2019opposition. Contactez-nous \u00e0 contact@momenterie.com. Vous pouvez \u00e9galement introduire une r\u00e9clamation aupr\u00e8s de la CNIL.</p>

      <h2>7. Cookies</h2>
      <p>Nous utilisons des cookies essentiels au fonctionnement du site (session, panier). Aucun cookie publicitaire n\u2019est utilis\u00e9.</p>

      <h2>8. Sous-traitants</h2>
      <p>Stripe (paiement, USA, clauses contractuelles types), Vercel (h\u00e9bergement, USA), Prodigi (impression et exp\u00e9dition, UK/UE), Resend (emails transactionnels).</p>
    </div>
  );
}

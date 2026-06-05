import { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions l\u00e9gales \u2014 Momenterie" };

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-gray">
      <h1>Mentions l\u00e9gales</h1>
      <h2>\u00c9diteur du site</h2>
      <p>Momenterie<br/>Micro-entreprise<br/>43 rue des picards, 77750 Orly-sur-Morin, France<br/>Email : contact@momenterie.com</p>
      <h2>H\u00e9bergement</h2>
      <p>Vercel Inc.<br/>440 N Barranca Avenue #4133, Covina, CA 91723, USA<br/>www.vercel.com</p>
      <h2>Propri\u00e9t\u00e9 intellectuelle</h2>
      <p>L\u2019ensemble du contenu du site (textes, images, graphismes, logo, ic\u00f4nes) est la propri\u00e9t\u00e9 exclusive de Momenterie, sauf mention contraire. Toute reproduction est interdite sans autorisation pr\u00e9alable.</p>
      <h2>TVA</h2>
      <p>TVA non applicable, article 293 B du CGI.</p>
    </div>
  );
}

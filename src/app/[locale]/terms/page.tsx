import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const es = locale === "es";
  return (
    <main className="shell legal">
      <section className="hero">
        <div className="eyebrow">{es ? "Condiciones" : "Terms"}</div>
        <h1>
          {es ? "Uso responsable de AkiCoches" : "Using AkiCoches responsibly"}
        </h1>
      </section>
      <section className="panel prose">
        <h2>{es ? "Contenido" : "Content"}</h2>
        <p>
          {es
            ? "Los negocios y usuarios deben publicar información verdadera, autorizada y legal. AkiCoches puede moderar, ocultar o retirar contenido engañoso, inseguro o infractor."
            : "Businesses and users must publish truthful, authorised and lawful information. AkiCoches may moderate, hide or remove misleading, unsafe or infringing content."}
        </p>
        <h2>{es ? "Solicitudes de alquiler" : "Rental requests"}</h2>
        <p>
          {es
            ? "AkiCoches permite enviar solicitudes al proveedor indicado. Una solicitud no confirma disponibilidad, precio final ni reserva, y AkiCoches no procesa el pago del alquiler."
            : "AkiCoches lets you send requests to the stated provider. A request does not confirm availability, final price or a booking, and AkiCoches does not process rental payment."}
        </p>
        <h2>{es ? "Cuentas de negocio" : "Business accounts"}</h2>
        <p>
          {es
            ? "Podemos solicitar prueba de representación antes de publicar una empresa o sucursal de alquiler. Los accesos de equipo deben asignarse únicamente a personas autorizadas."
            : "We may request proof of authority before publishing a rental company or branch. Team access must only be assigned to authorised people."}
        </p>
        <h2>{es ? "Contacto" : "Contact"}</h2>
        <p>support@akipasa.com</p>
        <p>
          <small>
            {es
              ? "Versión preliminar, 23 de julio de 2026. Pendiente de revisión jurídica profesional."
              : "Preview version, 23 July 2026. Pending professional legal review."}
          </small>
        </p>
      </section>
    </main>
  );
}
import { publicPageMetadata } from "@/lib/page-metadata";

export const generateMetadata = publicPageMetadata("/terms");

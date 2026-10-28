import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";

export default async function PrivacyPage({
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
        <div className="eyebrow">{es ? "Privacidad" : "Privacy"}</div>
        <h1>
          {es
            ? "Tu información, bajo control"
            : "Your information, under control"}
        </h1>
        <p className="lede">
          {es
            ? "Resumen de privacidad de AkiCoches para la versión preliminar pública."
            : "AkiCoches privacy summary for the public preview."}
        </p>
      </section>
      <section className="panel prose">
        <h2>{es ? "Qué guardamos" : "What we store"}</h2>
        <p>
          {es
            ? "Datos de cuenta, solicitudes de alquiler, datos de contacto incluidos en esas solicitudes, preferencias y consentimiento. La ubicación precisa del dispositivo no se guarda por defecto."
            : "Account data, rental requests, contact details included in those requests, preferences and consent. Precise device location is not stored by default."}
        </p>
        <h2>{es ? "Para qué" : "Why"}</h2>
        <p>
          {es
            ? "Para prestar el servicio, enviar tu solicitud al proveedor elegido, proteger AkiCoches contra abusos y ofrecer estadísticas agregadas. No vendemos datos personales."
            : "To provide the service, send your request to the chosen provider, protect AkiCoches from abuse and provide aggregate statistics. We do not sell personal data."}
        </p>
        <h2>{es ? "Lista de lanzamiento" : "Launch waitlist"}</h2>
        <p>
          {es
            ? "Si te apuntas para recibir noticias del lanzamiento, recogemos nombre, correo, ciudad o zona de interés, perfil particular o empresa, idioma, intereses opcionales y tus consentimientos. No se crea una solicitud de alquiler ni hace falta una cuenta. Enviamos un enlace para verificar el correo."
            : "If you sign up for launch news, we collect name, email, city or area, individual or business audience, language, optional interests and your consent choices. This does not create a rental request or require an account. We send a link to verify your address."}
        </p>
        <p>
          {es
            ? "Los avisos del lanzamiento requieren un email confirmado y tu consentimiento. Las comunicaciones comerciales tienen un consentimiento independiente, opcional y sin marcar por defecto. Usamos Cloudflare Turnstile para limitar el abuso y un proveedor de correo para entregar la confirmación."
            : "Launch updates require a confirmed email and your consent. Promotional messages need separate, optional consent, unchecked by default. We use Cloudflare Turnstile to limit abuse and an email provider to deliver verification."}
        </p>
        <p>
          {es
            ? "El plazo previsto es de 30 días para solicitudes no confirmadas, hasta 12 meses para suscripciones verificadas y 2 días para registros antiabuso. Puedes retirar el consentimiento, acceder o solicitar la eliminación de tus datos escribiendo a privacy@akipasa.com. El responsable es AkiPasa Marketing S.L."
            : "Planned retention is 30 days for unconfirmed submissions, up to 12 months for verified subscriptions and two days for anti-abuse records. You can withdraw consent, access or request deletion at privacy@akipasa.com. The data controller is AkiPasa Marketing S.L."}
        </p>
        <h2>{es ? "Tus derechos" : "Your rights"}</h2>
        <p>
          {es
            ? "Puedes descargar tus datos y solicitar la eliminación desde Cuenta. Las solicitudes se registran y se procesan de forma verificable."
            : "You can download your data and request deletion from Account. Requests are logged and processed verifiably."}
        </p>
        <h2>{es ? "Contacto" : "Contact"}</h2>
        <p>privacy@akipasa.com</p>
        <p>
          <small>
            {es
              ? "Última actualización: 28 de octubre de 2026. Pendiente de revisión jurídica profesional antes del lanzamiento comercial."
              : "Last updated: 28 October 2026. Pending professional legal review before commercial launch."}
          </small>
        </p>
      </section>
    </main>
  );
}
import { publicPageMetadata } from "@/lib/page-metadata";

export const generateMetadata = publicPageMetadata("/privacy");

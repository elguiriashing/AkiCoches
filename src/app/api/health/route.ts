export function GET() {
  return Response.json(
    { status: "ok", product: "akicoches" },
    { headers: { "Cache-Control": "no-store" } },
  );
}

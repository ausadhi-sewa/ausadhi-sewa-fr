import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen ">
      <section className="mx-auto w-full max-w-5xl px-4 py-10">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-neutral-900">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h3>1. Information We Collect</h3>
            <ul>
              <li>Account information (name, email, phone).</li>
              <li>Order details and delivery information.</li>
              <li>Technical data such as device and usage information.</li>
            </ul>
            <h3>2. How We Use Information</h3>
            <ul>
              <li>To fulfill orders and provide customer support.</li>
              <li>To improve our services and prevent fraud.</li>
              <li>To communicate updates, if you opt-in.</li>
            </ul>
            <h3>3. Data Sharing</h3>
            <p>
              We do not sell your personal information. We may share data with trusted service
              providers (e.g., payment, delivery) under strict confidentiality.
            </p>
            <h3>4. Cookies</h3>
            <p>
              We use cookies to maintain sessions and improve your experience. You can control
              cookies via your browser settings.
            </p>
            <h3>5. Your Rights</h3>
            <ul>
              <li>Access, update, or delete your data where applicable.</li>
              <li>Contact us for privacy requests at <strong>privacy@ausadhisewa.com</strong>.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}



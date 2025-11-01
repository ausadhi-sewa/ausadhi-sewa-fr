import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-5xl px-4 py-10">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-neutral-900">About AusadhiSewa</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none">
            <p>
              Pioneer Ausadhi Sewa is a modern online pharmacy focused on fast, reliable medicine delivery
              and a smooth shopping experience. We aim to make healthcare more accessible by
              combining verified products with helpful information and customer-first support.
            </p>
            <h3>What we value</h3>
            <ul>
              <li>Authentic, quality-checked medicines</li>
              <li>Clear pricing and transparent communication</li>
              <li>Fast delivery within our service areas</li>
              <li>Privacy and data protection</li>
            </ul>
            <h3>Contact</h3>
            <p>
              Have questions? Reach us at <strong>info@ausadhisewa.com</strong> or call
              <strong> +977 1-591-2222</strong>.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}



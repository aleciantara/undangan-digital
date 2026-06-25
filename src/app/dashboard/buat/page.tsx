import { CreateInvitationForm } from "@/components/dashboard/create-invitation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuatUndanganPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-invitation text-2xl font-semibold text-brand-ink">Buat undangan baru</h1>
      <p className="mt-1 text-sm text-stone-600">Isi data mempelai dan pilih template.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Data mempelai</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateInvitationForm />
        </CardContent>
      </Card>
    </div>
  );
}

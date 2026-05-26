import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FiturXyz() {
  return (
    <div id="dashboard-container">
      <PageHeader title="Fitur XYZ" />
      <p>Ini halaman Fitur XYZ</p>

      <Button variant="" size="xs">Simpan</Button>
      <Button variant="outline" size="sm">Simpan</Button>
      <Button variant="secondary">Simpan</Button>
      <Button variant="ghost">Simpan</Button>
      <Button variant="descructive">Simpan</Button>
      <Button variant="link">Simpan</Button>

            <Card className="mt-4 w-[380px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Belajar shadcn/ui</CardTitle>
            <Badge variant="secondary">Baru</Badge>
          </div>
          <CardDescription>
            Contoh penggunaan komponen shadcn/ui di React
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Komponen ini dibuat di branch <strong>setup-shadcn</strong>
            lalu di-merge ke main.
          </p>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button>Simpan</Button>
          <Button variant="outline">Batal</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
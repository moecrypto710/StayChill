
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building, DollarSign, Users, Star, Plus } from "lucide-react";

export default function Dashboard() {
  const { data: properties } = useQuery<Property[]>({
    queryKey: ['/api/properties/owner'],
  });

  const totalEarnings = properties?.reduce((sum, prop) => sum + prop.price, 0) || 0;
  const averageRating = properties?.reduce((sum, prop) => sum + (prop.rating || 0), 0) || 0;
  const totalBookings = properties?.reduce((sum, prop) => sum + (prop.reviewCount || 0), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <Link href="/list-property">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 ml-2" />
            إضافة عقار جديد
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">العقارات</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الحجوزات</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(averageRating / 10).toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">عقاراتي</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties?.map((property) => (
            <Card key={property.id}>
              <img src={property.images[0]} alt={property.title} className="w-full h-48 object-cover rounded-t-lg" />
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">{property.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${property.price}</span>
                  <Link href={`/property/${property.id}`}>
                    <Button variant="outline" size="sm">عرض</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

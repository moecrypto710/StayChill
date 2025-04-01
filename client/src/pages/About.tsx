import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { UmbrellaIcon, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Stay Chill</title>
        <meta name="description" content="Learn about Stay Chill, the premier vacation rental platform for Sahel and Ras El Hekma, Egypt." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-ocean-600 py-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"}}>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Stay Chill</h1>
            <p className="text-xl text-white mb-8">
              We're on a mission to make your vacation in Egypt's most beautiful coastal destinations unforgettable.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Stay Chill was founded in 2023 with a simple goal: to help travelers find exceptional vacation rentals in Sahel and Ras El Hekma while supporting property owners in maximizing the potential of their beach homes.
              </p>
              <p className="text-gray-700 mb-4">
                As travelers ourselves, we noticed a gap in the market for a dedicated platform focusing exclusively on Egypt's premium coastal destinations. We created Stay Chill to fill that gap, offering a curated selection of beach properties that meet our high standards.
              </p>
              <p className="text-gray-700">
                Today, we're proud to connect property owners with guests looking for the perfect beachside getaway, ensuring memorable experiences for everyone involved.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1591017403286-fd8493524e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Beach view in Egypt" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at Stay Chill
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-ocean-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality First</h3>
              <p className="text-gray-600">
                We personally verify all properties on our platform to ensure they meet our high standards of cleanliness, comfort, and location.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-ocean-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Expertise</h3>
              <p className="text-gray-600">
                Our team has deep knowledge of Sahel and Ras El Hekma, helping both guests and property owners navigate the local market with confidence.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-ocean-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exceptional Service</h3>
              <p className="text-gray-600">
                We're committed to providing outstanding support to both guests and property owners at every step of the journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're looking to book a vacation or list your property, we've made the process simple and transparent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <UmbrellaIcon className="mr-2 text-coral-400" />
                <span>For Guests</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-ocean-500 text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Browse Properties</h4>
                    <p className="text-gray-600">
                      Explore our curated selection of premium vacation rentals in Sahel and Ras El Hekma.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-ocean-500 text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Contact or Book</h4>
                    <p className="text-gray-600">
                      Send an inquiry or request to book directly through our platform.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-ocean-500 text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Enjoy Your Stay</h4>
                    <p className="text-gray-600">
                      Receive confirmation, arrival details, and enjoy your perfect beachside vacation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/properties">
                  <Button className="bg-ocean-500 hover:bg-ocean-600 text-white">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <UmbrellaIcon className="mr-2 text-coral-400" />
                <span>For Property Owners</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">List Your Property</h4>
                    <p className="text-gray-600">
                      Submit your property details through our platform for review.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Get Verified</h4>
                    <p className="text-gray-600">
                      Our team will verify your property to ensure it meets our quality standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Start Earning</h4>
                    <p className="text-gray-600">
                      Receive bookings, manage your calendar, and maximize your rental income.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/list-property">
                  <Button className="bg-coral-500 hover:bg-coral-600 text-white">
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-ocean-600 rounded-lg p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"}}>
            </div>
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Stay Chill?</h2>
              <p className="text-xl text-white mb-8">
                Whether you're looking for the perfect vacation rental or want to list your property, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/properties">
                  <Button className="px-8 py-3 bg-white text-ocean-600 hover:bg-gray-100 w-full sm:w-auto">
                    Find a Property
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

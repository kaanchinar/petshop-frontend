import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About PetPals Shop</h1>

      {/* Our Story */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Our store"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-lg text-muted-foreground">
              Founded in 2010, PetPals Shop began with a simple mission: to provide pet owners with high-quality
              products and expert advice. What started as a small local store has grown into a trusted destination for
              pet lovers nationwide.
            </p>
            <p className="text-lg text-muted-foreground">
              Our founder, Jane Smith, a veterinarian with over 15 years of experience, established PetPals with the
              belief that every pet deserves the best care possible. This philosophy continues to guide everything we
              do.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality First",
              description:
                "We carefully select every product we offer, ensuring it meets our high standards for quality, safety, and sustainability.",
            },
            {
              title: "Expert Guidance",
              description:
                "Our team includes trained pet specialists who can provide personalized recommendations for your pet's specific needs.",
            },
            {
              title: "Community Care",
              description:
                "We're committed to giving back to the pet community through partnerships with local shelters and rescue organizations.",
            },
          ].map((value, index) => (
            <div key={index} className="border p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
        { 
          name: "Jane Smith", 
          role: "Founder & CEO",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        { 
          name: "Michael Johnson", 
          role: "Head of Product",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop&ixlib=rb-4.1.0"
        },
        { 
          name: "Emily Davis", 
          role: "Lead Veterinarian",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&h=200&auto=format&fit=crop&ixlib=rb-4.1.0"
        },
        { 
          name: "David Wilson", 
          role: "Customer Experience Manager",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop&ixlib=rb-4.1.0"
        },
          ].map((member, index) => (
        <div key={index} className="text-center">
          <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
            <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
            />
          </div>
          <h3 className="text-xl font-bold">{member.name}</h3>
          <p className="text-muted-foreground">{member.role}</p>
        </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Visit Our Store</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Store Location</h3>
            <p className="text-muted-foreground">123 Pet Avenue, Anytown, USA 12345</p>
            <h3 className="text-xl font-bold">Hours</h3>
            <ul className="text-muted-foreground">
              <li>Monday - Friday: 9am - 7pm</li>
              <li>Saturday: 10am - 6pm</li>
              <li>Sunday: 11am - 5pm</li>
            </ul>
            <h3 className="text-xl font-bold">Contact</h3>
            <p className="text-muted-foreground">Phone: (555) 123-4567</p>
            <p className="text-muted-foreground">Email: info@petpalsshop.com</p>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/map.png"
              alt="Store location"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

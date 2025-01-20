from app import app, db
from models import User, Seller, Product, ProductImage, ProductCertificate

def create_sample_products():
    with app.app_context():
        # Get our seller
        seller = Seller.query.first()
        if not seller:
            print("No seller found. Please run add_test_users.py first.")
            return

        # Sample products
        products = [
            {
                "name": "Bamboo Toothbrush Set",
                "description": "Pack of 4 biodegradable bamboo toothbrushes. Made from sustainably harvested bamboo with charcoal-infused bristles. Plastic-free packaging.",
                "price": 12.99,
                "stock": 100,
                "eco_score": 95,
                "carbon_footprint_saved": 0.5,  # kg CO2 compared to plastic toothbrushes
                "images": ["bamboo_toothbrush_1.jpg", "bamboo_toothbrush_2.jpg"],
                "certificates": [
                    {"type": "Plastic Free", "url": "cert_plastic_free.pdf"},
                    {"type": "FSC", "url": "cert_fsc.pdf"}
                ]
            },
            {
                "name": "Organic Hemp Soap Bar",
                "description": "Handmade soap using organic hemp oil and essential oils. Zero waste packaging, vegan, and cruelty-free.",
                "price": 8.99,
                "stock": 150,
                "eco_score": 90,
                "carbon_footprint_saved": 0.3,
                "images": ["hemp_soap_1.jpg", "hemp_soap_2.jpg"],
                "certificates": [
                    {"type": "Organic", "url": "cert_organic.pdf"},
                    {"type": "Vegan", "url": "cert_vegan.pdf"}
                ]
            },
            {
                "name": "Reusable Produce Bags",
                "description": "Set of 6 mesh bags made from recycled plastic bottles. Perfect for grocery shopping. Machine washable.",
                "price": 15.99,
                "stock": 75,
                "eco_score": 85,
                "carbon_footprint_saved": 2.1,
                "images": ["produce_bags_1.jpg", "produce_bags_2.jpg"],
                "certificates": [
                    {"type": "Recycled Material", "url": "cert_recycled.pdf"}
                ]
            },
            {
                "name": "Stainless Steel Water Bottle",
                "description": "1L double-walled insulated bottle. Keeps drinks cold for 24h or hot for 12h. BPA-free and recyclable.",
                "price": 24.99,
                "stock": 50,
                "eco_score": 88,
                "carbon_footprint_saved": 12.5,
                "images": ["water_bottle_1.jpg", "water_bottle_2.jpg"],
                "certificates": [
                    {"type": "BPA Free", "url": "cert_bpa_free.pdf"}
                ]
            },
            {
                "name": "Compostable Phone Case",
                "description": "Made from plant-based materials. 100% compostable and biodegradable. Available for latest iPhone and Samsung models.",
                "price": 29.99,
                "stock": 200,
                "eco_score": 92,
                "carbon_footprint_saved": 0.8,
                "images": ["phone_case_1.jpg", "phone_case_2.jpg"],
                "certificates": [
                    {"type": "Compostable", "url": "cert_compostable.pdf"},
                    {"type": "Bio-based", "url": "cert_bio_based.pdf"}
                ]
            }
        ]

        # Add products to database
        for product_data in products:
            product = Product(
                seller_id=seller.id,
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                stock=product_data["stock"],
                eco_score=product_data["eco_score"],
                carbon_footprint_saved=product_data["carbon_footprint_saved"]
            )
            db.session.add(product)
            db.session.commit()

            # Add images
            for image_url in product_data["images"]:
                image = ProductImage(
                    product_id=product.id,
                    image_url=image_url
                )
                db.session.add(image)

            # Add certificates
            for cert in product_data["certificates"]:
                certificate = ProductCertificate(
                    product_id=product.id,
                    certificate_url=cert["url"],
                    certificate_type=cert["type"]
                )
                db.session.add(certificate)

        db.session.commit()
        print("Sample products added successfully!")

if __name__ == '__main__':
    create_sample_products()
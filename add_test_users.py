from app import app, db
from models import User, Seller

def create_test_users():
    with app.app_context():
        # Create normal user
        user1 = User(
            email='jinx@mail.com',
            name='Jinx',
            is_seller=False
        )
        user1.set_password('jinx')
        
        # Create seller user
        seller_user = User(
            email='seller@mail.com',
            name='Test Seller',
            is_seller=True
        )
        seller_user.set_password('seller123')
        
        # Add users to database
        db.session.add(user1)
        db.session.add(seller_user)
        db.session.commit()
        
        # Create seller profile
        seller = Seller(
            user_id=seller_user.id,
            business_name='Eco Store',
            phone='1234567890',
            address='123 Green Street, Eco City',
            gst_number='GST123456789'
        )
        
        db.session.add(seller)
        db.session.commit()
        
        print("Test users created successfully!")
        print("\nUser Credentials:")
        print("Normal User - Email: jinx@mail.com, Password: jinx")
        print("Seller User - Email: seller@mail.com, Password: seller123")

if __name__ == '__main__':
    create_test_users()
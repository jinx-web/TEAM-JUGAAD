from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from models import db, User, Seller, Product, ProductImage, ProductCertificate

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecoessentials.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'

# Initialize database
db.init_app(app)

# Create upload directories
UPLOAD_FOLDER = 'uploads'
PRODUCT_IMAGES_FOLDER = os.path.join(UPLOAD_FOLDER, 'product_images')
CERTIFICATES_FOLDER = os.path.join(UPLOAD_FOLDER, 'certificates')

os.makedirs(PRODUCT_IMAGES_FOLDER, exist_ok=True)
os.makedirs(CERTIFICATES_FOLDER, exist_ok=True)

# Create tables
with app.app_context():
    db.create_all()

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        if not all(k in data for k in ['email', 'password', 'name']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400
        
        user = User(
            email=data['email'],
            name=data['name']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error occurred: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not all(k in data for k in ['email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400
            
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            session['user_id'] = user.id
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'is_seller': user.is_seller
                }
            })
        
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'message': f'Error occurred: {str(e)}'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

# Seller routes
@app.route('/api/seller/register', methods=['POST'])
def register_seller():
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
    
    data = request.json
    user = User.query.get(session['user_id'])
    
    if user.is_seller:
        return jsonify({'message': 'User is already a seller'}), 400
    
    seller = Seller(
        user_id=user.id,
        business_name=data['businessName'],
        phone=data['phone'],
        address=data['address'],
        gst_number=data.get('gst'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )
    
    user.is_seller = True
    db.session.add(seller)
    db.session.commit()
    
    return jsonify({'message': 'Seller registered successfully'}), 201

@app.route('/api/seller/products', methods=['POST'])
def add_product():
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
    
    user = User.query.get(session['user_id'])
    if not user.is_seller:
        return jsonify({'message': 'User is not a seller'}), 403
    
    data = request.form
    files = request.files
    
    product = Product(
        seller_id=user.seller.id,
        name=data['name'],
        description=data['description'],
        price=float(data['price']),
        stock=int(data['stock']),
        eco_score=int(data['ecoScore']),
        carbon_footprint_saved=float(data['carbonFootprint'])
    )
    
    db.session.add(product)
    db.session.commit()
    
    # Handle product images
    for image in files.getlist('images'):
        if image:
            filename = secure_filename(image.filename)
            image_path = os.path.join(PRODUCT_IMAGES_FOLDER, filename)
            image.save(image_path)
            
            product_image = ProductImage(
                product_id=product.id,
                image_url=f'/uploads/product_images/{filename}'
            )
            db.session.add(product_image)
    
    # Handle certificates
    for cert in files.getlist('certificates'):
        if cert:
            filename = secure_filename(cert.filename)
            cert_path = os.path.join(CERTIFICATES_FOLDER, filename)
            cert.save(cert_path)
            
            certificate = ProductCertificate(
                product_id=product.id,
                certificate_url=f'/uploads/certificates/{filename}',
                certificate_type=os.path.splitext(filename)[1][1:]
            )
            db.session.add(certificate)
    
    db.session.commit()
    
    return jsonify({'message': 'Product added successfully', 'product_id': product.id}), 201

@app.route('/api/seller/products', methods=['GET'])
def get_seller_products():
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
    
    user = User.query.get(session['user_id'])
    if not user.is_seller:
        return jsonify({'message': 'User is not a seller'}), 403
    
    products = []
    for product in user.seller.products:
        products.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock': product.stock,
            'eco_score': product.eco_score,
            'carbon_footprint_saved': product.carbon_footprint_saved,
            'images': [{'url': img.image_url} for img in product.images],
            'certificates': [{'url': cert.certificate_url, 'type': cert.certificate_type} 
                           for cert in product.certificates],
            'created_at': product.created_at.isoformat()
        })
    
    return jsonify(products)

@app.route('/api/seller/dashboard', methods=['GET'])
def get_seller_dashboard():
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
    
    user = User.query.get(session['user_id'])
    if not user.is_seller:
        return jsonify({'message': 'User is not a seller'}), 403
    
    # Calculate dashboard statistics
    total_products = len(user.seller.products)
    total_revenue = sum(product.price * product.stock for product in user.seller.products)
    total_eco_impact = sum(product.carbon_footprint_saved for product in user.seller.products)
    
    return jsonify({
        'total_products': total_products,
        'total_revenue': total_revenue,
        'total_eco_impact': total_eco_impact
    })

# Product routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        search_query = request.args.get('search', '').lower()
        
        # Base query
        query = Product.query
        
        # Apply search filter if query exists
        if search_query:
            search_terms = search_query.split()
            search_filters = []
            for term in search_terms:
                search_filters.append(
                    db.or_(
                        db.func.lower(Product.name).contains(term),
                        db.func.lower(Product.description).contains(term)
                    )
                )
            query = query.filter(db.and_(*search_filters))
        
        # Get products
        products = query.all()
        
        return jsonify({
            'products': [{
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'price': p.price,
                'eco_score': p.eco_score,
                'carbon_footprint_saved': p.carbon_footprint_saved,
                'images': [img.image_url for img in p.images],
                'certificates': [
                    {
                        'url': cert.certificate_url,
                        'type': cert.certificate_type
                    } for cert in p.certificates
                ]
            } for p in products]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error occurred: {str(e)}'}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        product_data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock': product.stock,
            'eco_score': product.eco_score,
            'carbon_footprint_saved': product.carbon_footprint_saved,
            'images': [{'image_url': img.image_url} for img in product.images],
            'certificates': [{'certificate_type': cert.certificate_type, 
                            'certificate_url': cert.certificate_url} 
                           for cert in product.certificates]
        }
        
        return jsonify(product_data)

    except Exception as e:
        return jsonify({'message': f'Error occurred: {str(e)}'}), 500

@app.route('/api/products/search', methods=['GET'])
def search_products():
    try:
        # Get search query from URL parameters
        query = request.args.get('q', '').strip()
        
        if not query:
            # If no query, return all products
            products = Product.query.filter_by(is_active=True).all()
        else:
            # Search in product name, description, and category
            products = Product.query.filter(
                db.or_(
                    Product.name.ilike(f'%{query}%'),
                    Product.description.ilike(f'%{query}%'),
                    Product.category.ilike(f'%{query}%')
                ),
                Product.is_active == True
            ).all()
        
        # Get seller information for each product
        result = []
        for product in products:
            seller = Seller.query.filter_by(user_id=product.seller_id).first()
            seller_user = User.query.get(product.seller_id) if seller else None
            
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'category': product.category,
                'sustainability_score': product.sustainability_score,
                'image': product.image_url if product.image_url else None,
                'sellerName': seller_user.name if seller_user else 'EcoEssentials Seller',
                'latitude': seller.latitude if seller else None,
                'longitude': seller.longitude if seller else None,
                'created_at': product.created_at.isoformat(),
                'sustainability_attributes': product.sustainability_attributes
            }
            result.append(product_data)
        
        return jsonify({
            'message': 'Products retrieved successfully',
            'products': result,
            'total': len(result)
        })
        
    except Exception as e:
        return jsonify({
            'message': f'Error occurred while searching products: {str(e)}',
            'products': [],
            'total': 0
        }), 500

# User Preferences routes
@app.route('/api/user/preferences', methods=['GET', 'POST'])
def manage_preferences():
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
        
    if request.method == 'POST':
        data = request.json
        user_id = session['user_id']
        
        # Update or create preferences
        pref = UserPreference.query.filter_by(user_id=user_id).first()
        if not pref:
            pref = UserPreference(user_id=user_id)
            
        # Update preferences
        if 'preferred_categories' in data:
            pref.preferred_categories = ','.join(map(str, data['preferred_categories']))
        if 'sustainability_priorities' in data:
            pref.sustainability_priorities = ','.join(f"{k}:{v}" for k, v in data['sustainability_priorities'].items())
        if 'price_range_min' in data:
            pref.price_range_min = data['price_range_min']
        if 'price_range_max' in data:
            pref.price_range_max = data['price_range_max']
            
        db.session.add(pref)
        db.session.commit()
        
        return jsonify({'message': 'Preferences updated successfully'}), 200
        
    else:  # GET request
        pref = UserPreference.query.filter_by(user_id=session['user_id']).first()
        if not pref:
            return jsonify({}), 200
            
        return jsonify({
            'preferred_categories': [int(x) for x in pref.preferred_categories.split(',')] if pref.preferred_categories else [],
            'sustainability_priorities': dict(x.split(':') for x in pref.sustainability_priorities.split(',')) if pref.sustainability_priorities else {},
            'price_range_min': pref.price_range_min,
            'price_range_max': pref.price_range_max
        }), 200

@app.route('/api/products/recommended', methods=['GET'])
def get_recommended_products():
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
        
    user_id = session['user_id']
    pref = UserPreference.query.filter_by(user_id=user_id).first()
    
    # Base query
    query = Product.query
    
    if pref:
        # Filter by preferred categories if set
        if pref.preferred_categories:
            category_ids = [int(x) for x in pref.preferred_categories.split(',')]
            query = query.filter(Product.category_id.in_(category_ids))
            
        # Filter by price range if set
        if pref.price_range_min is not None:
            query = query.filter(Product.price >= pref.price_range_min)
        if pref.price_range_max is not None:
            query = query.filter(Product.price <= pref.price_range_max)
            
        # Sort by sustainability score based on user priorities
        if pref.sustainability_priorities:
            priorities = dict(x.split(':') for x in pref.sustainability_priorities.split(','))
            # Custom scoring based on priorities
            query = query.order_by(
                (Product.eco_score * float(priorities.get('eco_score', 1)) +
                 Product.recyclability_score * float(priorities.get('recyclability', 1)) +
                 Product.carbon_footprint_saved * float(priorities.get('carbon_footprint', 1))).desc()
            )
    
    # Get products with their sustainability attributes
    products = query.limit(20).all()
    
    return jsonify({
        'products': [{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'eco_score': p.eco_score,
            'carbon_footprint_saved': p.carbon_footprint_saved,
            'material_source': p.material_source,
            'recyclability_score': p.recyclability_score,
            'category': p.category.name,
            'sustainability_attributes': [
                {
                    'name': attr.name,
                    'type': attr.attribute_type,
                    'value': next((ps.value for ps in p.sustainability_attributes if ps.id == attr.id), None)
                } for attr in p.sustainability_attributes
            ],
            'images': [img.image_url for img in p.images],
            'certificates': [
                {
                    'url': cert.certificate_url,
                    'type': cert.certificate_type
                } for cert in p.certificates
            ]
        } for p in products]
    }), 200

# Product Categories routes
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = ProductCategory.query.filter_by(parent_id=None).all()
    
    def format_category(cat):
        return {
            'id': cat.id,
            'name': cat.name,
            'description': cat.description,
            'subcategories': [format_category(sub) for sub in cat.subcategories]
        }
    
    return jsonify({
        'categories': [format_category(cat) for cat in categories]
    }), 200

@app.route('/api/sustainability-attributes', methods=['GET'])
def get_sustainability_attributes():
    attributes = SustainabilityAttribute.query.all()
    return jsonify({
        'attributes': [{
            'id': attr.id,
            'name': attr.name,
            'description': attr.description,
            'type': attr.attribute_type
        } for attr in attributes]
    }), 200

if __name__ == '__main__':
    app.run(debug=True)

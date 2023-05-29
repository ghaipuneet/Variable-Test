import MongoClient

def create_database():
  client = MongoClient("mongodb://localhost:27017")
  db = client.getDatabase("orders")
  return db

def populate_database():
  db = create_database()
  db.orders.insert({
    "order_id": 1,
    "customer_id": 1,
    "product_id": 1,
    "quantity": 1,
    "order_status": "pending",
    "order_date": new Date(),
    "order_price": 100
  })
  db.orders.insert({
    "order_id": 2,
    "customer_id": 2,
    "product_id": 2,
    "quantity": 2,
    "order_status": "pending",
    "order_date": new Date(),
    "order_price": 200
  })

def connect_to_database():
  client = MongoClient("mongodb://localhost:27017")
  db = client.getDatabase("orders")
  return db

def retrieve_all_orders():
  db = connect_to_database()
  orders = db.orders.find()
  return orders

def insert_new_order(order):
  db = connect_to_database()
  db.orders.insert(order)

def update_order_status(order_id, order_status):
  db = connect_to_database()
  order = db.orders.findOne({"order_id": order_id})
  order["order_status"] = order_status
  db.orders.save(order)

def delete_order(order_id):
  db = connect_to_database()
  db.orders.deleteOne({"order_id": order_id})

from flask import Flask,render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#linking the server
local_server = True
if(local_server):
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:@localhost/learnthecode"
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:@localhost/learnthecode"

db = SQLAlchemy(app)


#from the database

class Cartp(db.Model):
    sno = db.Column(db.Integer,primary_key=True)
    lang = db.Column(db.String(20),nullable=False)
    level = db.Column(db.String(20),nullable=False)
    time = db.Column(db.Text(10),nullable =True)
    slug = db.Column(db.String(25),nullable = False)
    heading = db.Column(db.String(50),nullable=False)
    subheading = db.Column(db.String(50),nullable=False)

class Lectopic(db.Model):
    sno = db.Column(db.Integer,primary_key=True)
    topic = db.Column(db.String(40),nullable =True)
    tslug = db.Column(db.String(40),nullable =True)

class Posts(db.Model):
    sno = db.Column(db.Integer,primary_key=True)
    title = db.Column(db.String(40),nullable =True)
    author = db.Column(db.String(40),nullable =True)
    slug = db.Column(db.String(40),nullable =True)
    intro = db.Column(db.String(40),nullable =True)
    syntax = db.Column(db.String(40),nullable =True)
    exp1 = db.Column(db.String(40),nullable =True)
    code = db.Column(db.String(40),nullable =True)
    exp2 = db.Column(db.String(40),nullable =True)
    




@app.route("/")
def home():
    cart_post = Cartp.query.filter_by().all()
    post = Posts.query.all()
    all_posts = Posts.query.all()
    return render_template("index.html",cart_post=cart_post,post=post,p1=all_posts)

@app.route("/tutorial/<string:slug_cart>", methods=['GET'])
def tutorial(slug_cart):
    # Fetch the post that matches the slug
    post = Posts.query.filter_by(slug=slug_cart).first_or_404()

    # Optional: get all posts for sidebar or something
    all_posts = Posts.query.all()

    # Use clear naming in render
    return render_template("tutorial.html", post=post, all_posts=all_posts)


'''@app.route("/tutorial/<string:cart_slug>/<string:topic>")
def topic_page(cart_slug, topic):
    info_cart = Cartp.query.filter_by(slug=cart_slug).first()
    cart_post = Cartp.query.filter_by(slug=cart_slug).all()
    tname = Lectopic.query.all()

    return render_template("tutorial.html", cart_post=cart_post, info_cart=info_cart, tname=tname)'''

 
@app.route("/code")
def codeTest():
    return render_template("testcode.html")

@app.route("/dashboard")
def dashboard():
    post = Lectopic.query.all()
    return render_template("dashboard.html",post=post)

@app.route("/dashboard1")
def dashboard1():
    posts = Posts.query.all()
    return render_template("dashboard1.html", posts=posts)
    

app.run(debug=True)

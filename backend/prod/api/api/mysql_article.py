from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os

app = Flask(__name__)
CORS(app)

SQLALCHEMY_DATABASE_URI = "mysql+pymysql://{}:{}@{}:{}/{}".format(
    os.environ.get("DB_USER"),
    os.environ.get("DB_PASSWORD"),
    os.environ.get("DB_HOST"),
    os.environ.get("DB_PORT"),
    os.environ.get("DB_NAME"),
)
# データベース設定（PyMySQL）
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
migrate = Migrate(app,db)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    content = db.Column(db.String(80), default=False)
    slug = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False,default=datetime.utcnow)
    comments = db.relationship("Comment", backref="article", lazy=True)

    def to_json(self):
        return {"id": self.id, "title": self.title, "slug": self.slug, "created_at": self.created_at, "updated_at": self.updated_at, "content": self.content, "comments": [comment.to_json() for comment in self.comments] if self.comments else []}

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False,default=datetime.utcnow)
    article_id = db.Column(db.Integer, db.ForeignKey("article.id"), nullable=False)

    def to_json(self):
        return {"id": self.id, "article_id": self.article_id, "body": self.body, "created_at": self.created_at, "updated_at": self.updated_at}


# class Author(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), nullable=False)
#     avatarUrl = db.Column(db.String(80), nullable=False)
#     articles = db.relationship("Article", backref="author", lazy=True)
     

#     def to_json(self):
#         return {"id": self.id, "name": self.name, "avatarUrl": self.avatarUrl, "articles": [article.to_json() for article in self.articles] if self.articles else []}


# データベース初期化
with app.app_context():
    db.create_all()

@app.route("/api/healthcheck", methods=["GET"])
def health_check():
    return jsonify({"message": "ok"})

# ユーザーの記事一覧取得
@app.route("/authors/<int:author_id>/articles", methods=["GET"])
def get_author_articles(author_id):
    articles = Article.query.filter_by(author_id=author_id).all()
    return jsonify([article.to_json() for article in articles])

# 記事のコメント一覧取得
@app.route("/articles/<int:article_id>/comments", methods=["GET"])
def get_article_comments(article_id):
    comments = Comment.query.filter_by(article_id=article_id).all()
    return jsonify([comment.to_json() for comment in comments])



# 記事の作成
@app.route("/articles", methods=["POST"])
def create_article():
    article = Article(title=request.json["title"], slug=request.json["slug"],content=request.json["content"])
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_json())

# 記事の更新
@app.route("/articles/<int:article_id>", methods=["PUT"])
def update_article(article_id):
    article = Article.query.get(article_id)
    article.title = request.json["title"]
    article.slug = request.json["slug"]
    article.author_id = request.json["author_id"]
    db.session.commit()
    return jsonify(article.to_json())

# 記事の削除
@app.route("/articles/<int:article_id>", methods=["DELETE"])
def delete_article(article_id):
    article = Article.query.get(article_id)
    db.session.delete(article)
    db.session.commit()
    return jsonify(article.to_json())

# コメントの作成
@app.route("/articles/<int:article_id>/comments", methods=["POST"])
def create_comment(article_id):
    comment = Comment(body=request.json["body"], article_id=article_id)
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_json())

# コメントの更新
@app.route("/comments/<int:comment_id>", methods=["PUT"])
def update_comment(comment_id):
    comment = Comment.query.get(comment_id)
    comment.body = request.json["body"]
    db.session.commit()
    return jsonify(comment.to_json())

# コメントの削除
@app.route("/comments/<int:comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify(comment.to_json())

# ユーザーの作成
# @app.route("/authors", methods=["POST"])
# def create_author():
    # author = Author(name=request.json["name"], avatarUrl=request.json["avatarUrl"])
    # db.session.add(author)
    # db.session.commit()
    # return jsonify(author.to_json())

# ユーザーの更新
# @app.route("/authors/<int:author_id>", methods=["PUT"])
# def update_author(author_id):
    # author = Author.query.get(author_id)
    # author.name = request.json["name"]
    # author.avatarUrl = request.json["avatarUrl"]
    # db.session.commit()
    # return jsonify(author.to_json())

# ユーザーの削除
# @app.route("/authors/<int:author_id>", methods=["DELETE"])
# def delete_author(author_id):
    # author = Author.query.get(author_id)
    # db.session.delete(author)
    # db.session.commit()
    # return jsonify(author.to_json())

# ユーザーの一覧取得
# @app.route("/authors", methods=["GET"])
# def get_authors():
    # authors = Author.query.all()
    # return jsonify([author.to_json() for author in authors])
# 
# ユーザーの取得
# @app.route("/authors/<int:author_id>", methods=["GET"])
# def get_author(author_id):
    # author = Author.query.get(author_id)
    # return jsonify(author.to_json())

# 記事の一覧取得
@app.route("/articles", methods=["GET"])
def get_articles():
    articles = Article.query.all()
    return jsonify([article.to_json() for article in articles])

# 記事の取得
@app.route("/articles/<int:article_id>", methods=["GET"])
def get_article(article_id):
    article = Article.query.get(article_id)
    return jsonify(article.to_json())

# コメントの一覧取得
@app.route("/comments", methods=["GET"])
def get_comments():
    comments = Comment.query.all()
    return jsonify([comment.to_json() for comment in comments])








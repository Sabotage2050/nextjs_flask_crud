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


# ToDoモデル
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def to_json(self):
        return {"id": self.id, "title": self.title, "completed": self.completed}


# データベース初期化
# with app.app_context():
    # db.create_all()


@app.route("/todos", methods=["GET", "POST"])
def manage_todos():
    if request.method == "GET":
        todos = Todo.query.all()
        return jsonify([todo.to_json() for todo in todos])
    elif request.method == "POST":
        data = request.get_json()
        new_todo = Todo(title=data["title"])
        db.session.add(new_todo)
        db.session.commit()
        return jsonify(new_todo.to_json())


@app.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({"message": "ToDo not found"}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "ToDo deleted"})


@app.route("/todos/<int:todo_id>", methods=["PUT"])
def update_todo_status(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({"message": "ToDo not found"}), 404
    data = request.get_json()
    todo.title = data["title"]
    todo.completed = data["completed"]
    db.session.commit()
    return jsonify(todo.to_json())
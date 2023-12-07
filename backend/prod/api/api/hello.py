from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# アプリケーションの設定
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "todos.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
CORS(app)
db = SQLAlchemy(app)


# ToDoモデル
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def to_json(self):
        return {"id": self.id, "title": self.title, "completed": self.completed}


# データベース初期化
with app.app_context():
    db.create_all()


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
        return jsonify(new_todo.to_json()), 201


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

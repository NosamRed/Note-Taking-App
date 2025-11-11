from db import users_collection, db, client

def find_by_username(username):
    return users_collection.find_one({"username": username})

def change_note_by_title(username, title, content):
    result = users_collection.update_one(
        {"username": username, "notes.title": title},
        {"$set": {"notes.$.content": content}}
    )

    if result.modified_count == 0:
        users_collection.update_one(
            {"username": username},
            {"$push": {"notes": {"title": title, "content": content}}}
        )

    return find_by_username(username)
import streamlit as st
from models import find_by_username, change_note_by_title

st.set_page_config(page_title="Note Taking App")

st.title("Note Taking App")

username = st.text_input("Enter your username:")
if not username:
    st.stop()

user = find_by_username(username)
if not user:
    st.warning("User not found in database.")
    st.stop()

st.success(f"Welcome back, {username}")

# Display notes
if user.get("notes"):
    for note in user["notes"]:
        with st.expander(note["title"]):
            st.write(note["content"])

st.subheader("Add or Edit a Note")
title = st.text_input("Note Title")
content = st.text_area("Note Content")

if st.button("Save Note"):
    change_note_by_title(username, title, content)
    st.success("Note saved successfully.")
    st.rerun()
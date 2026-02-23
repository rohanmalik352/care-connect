import streamlit as st
import pandas as pd
import json
import os
from datetime import datetime
import hashlib
import uuid

# ────────────────────────────────────────────────
# CONFIG
# ────────────────────────────────────────────────
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

DATA_FILE = os.path.join(DATA_DIR, "records.jsonl")
USERS_FILE = "users.json"

# ────────────────────────────────────────────────
# LOAD USERS
# ────────────────────────────────────────────────
def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)

USERS = load_users()

# ────────────────────────────────────────────────
# SESSION INIT
# ────────────────────────────────────────────────
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
    st.session_state.username = None
    st.session_state.role = None
    st.session_state.patient_id = None

# ────────────────────────────────────────────────
# HELPERS
# ────────────────────────────────────────────────
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def save_record(record):
    with open(DATA_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")
    st.success("Record saved successfully!")

def load_all_records():
    if not os.path.exists(DATA_FILE):
        return []
    records = []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line.strip()))
    return records

def get_records_for_user():
    records = load_all_records()
    if not records:
        return pd.DataFrame()

    df = pd.DataFrame(records)

    if "doctor" not in df.columns:
        df["doctor"] = None

    if st.session_state.role == "admin":
        return df

    if st.session_state.role == "doctor":
        return df[df["doctor"] == st.session_state.username]

    if st.session_state.role == "patient":
        return df[df["patient_id"] == st.session_state.patient_id]

    return pd.DataFrame()

def generate_patient_id():
    return "P" + uuid.uuid4().hex[:6].upper()

# ────────────────────────────────────────────────
# LOGIN
# ────────────────────────────────────────────────
def show_login():
    st.title("Care Connect Login")

    with st.form("login_form"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        submitted = st.form_submit_button("Login")

        if submitted:
            username = username.strip().lower()

            if username not in USERS:
                st.error("User not found")
                return

            user = USERS[username]

            # Patient without password must set it
            if user["role"] == "patient" and not user.get("password_hash"):
                st.warning("First login detected. Please set your password.")
                new_pass = st.text_input("Set New Password", type="password")
                if st.button("Save Password"):
                    USERS[username]["password_hash"] = hash_password(new_pass)
                    save_users(USERS)
                    st.success("Password set. Please login again.")
                    st.rerun()
                return

            if hash_password(password) == user.get("password_hash"):
                st.session_state.logged_in = True
                st.session_state.username = username
                st.session_state.role = user["role"]
                st.session_state.patient_id = user.get("patient_id")
                st.rerun()
            else:
                st.error("Incorrect password")

# ────────────────────────────────────────────────
# DASHBOARD
# ────────────────────────────────────────────────
def show_dashboard():
    st.title(f"{st.session_state.role.capitalize()} Dashboard")

    if st.button("Logout"):
        st.session_state.clear()
        st.rerun()

    df = get_records_for_user()

    tab1, tab2 = st.tabs(["📊 Records", "⚙ Actions"])

    # ─────────── RECORD VIEW ───────────
    with tab1:
        if df.empty:
            st.info("No records found.")
        else:
            if st.session_state.role in ["doctor", "admin"]:
                search = st.text_input("Search Records")
                if search:
                    search = search.lower()
                    df = df[df.apply(lambda row: search in str(row).lower(), axis=1)]

            st.dataframe(df.sort_values("timestamp", ascending=False),
                         use_container_width=True,
                         hide_index=True)

            if st.session_state.role == "admin":
                idx = st.number_input("Delete record index", min_value=0, step=1)
                if st.button("Delete Record"):
                    records = load_all_records()
                    if 0 <= idx < len(records):
                        del records[idx]
                        with open(DATA_FILE, "w", encoding="utf-8") as f:
                            for r in records:
                                f.write(json.dumps(r) + "\n")
                        st.success("Deleted.")
                        st.rerun()

    # ─────────── ACTIONS ───────────
    with tab2:

        # DOCTOR → Add Medical Record
        if st.session_state.role == "doctor":
            st.subheader("Add Medical Record")

            with st.form("add_record"):
                patient_id = st.text_input("Patient ID")
                diagnosis = st.text_input("Diagnosis")
                protocol = st.text_area("Treatment Protocol")
                outcome = st.selectbox("Outcome",
                    ["Success", "Partial Improvement", "Complications", "Referred", "Other"])
                notes = st.text_area("Notes")

                submitted = st.form_submit_button("Save")

                if submitted and patient_id and diagnosis and protocol:
                    record = {
                        "timestamp": datetime.now().isoformat(),
                        "patient_id": patient_id.strip().upper(),
                        "doctor": st.session_state.username,
                        "diagnosis": diagnosis,
                        "protocol": protocol,
                        "outcome": outcome,
                        "doctor_notes": notes
                    }
                    save_record(record)

            # DOCTOR → Create Patient
            st.subheader("Create New Patient")

            new_username = st.text_input("Patient Username")
            if st.button("Create Patient"):
                if new_username in USERS:
                    st.error("Username already exists")
                else:
                    pid = generate_patient_id()
                    USERS[new_username] = {
                        "role": "patient",
                        "patient_id": pid,
                        "password_hash": None
                    }
                    save_users(USERS)
                    st.success(f"Patient created. ID: {pid}")

        # ADMIN → Only management, no medical entry
        elif st.session_state.role == "admin":
            st.info("Admin cannot add medical records.")

        # PATIENT → Nothing extra
        else:
            st.info("Patients cannot perform administrative actions.")

# ────────────────────────────────────────────────
# MAIN FLOW
# ────────────────────────────────────────────────
if not st.session_state.logged_in:
    show_login()
else:
    show_dashboard()
import sys
import os
import json

# -------------------- CONFIG --------------------
VOTES_FILE = 'user_votes.json'
# ------------------------------------------------

def load_votes(file_path):
    """טוען את ההצבעות, ואם הקובץ לא קיים או פגום - יוצר חדש בזיכרון"""
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except:
            return {} # במקרה של שגיאה בקריאה, נתחיל מאפס
    return {}

def save_votes(file_path, votes_dict):
    """שומר את ההצבעות לקובץ"""
    try:
        with open(file_path, 'w') as f:
            json.dump(votes_dict, f, indent=2)
    except Exception as e:
        sys.stderr.write(f"Error saving votes: {str(e)}\n")

if __name__ == "__main__":
    try:
        # בדיקת תקינות קלט (השרת שולח: שם קובץ, URL, תווית)
        if len(sys.argv) < 3:
            print(json.dumps({"status": "error", "message": "Missing arguments (URL and Label)"}))
            sys.exit(1)

        url_to_update = sys.argv[1]
        try:
            new_label = int(sys.argv[2]) # 0 = safe, 1 = malicious
        except ValueError:
            print(json.dumps({"status": "error", "message": "Label must be an integer"}))
            sys.exit(1)

        # הגדרת נתיבים
        script_dir = os.path.dirname(os.path.abspath(__file__))
        votes_path = os.path.join(script_dir, VOTES_FILE)

        # 1. טעינת בסיס הנתונים של ההצבעות
        votes_db = load_votes(votes_path)

        # 2. יצירת רשומה ללינק אם הוא חדש
        if url_to_update not in votes_db:
            votes_db[url_to_update] = {"safe": 0, "malicious": 0}

        # 3. עדכון ההצבעה
        if new_label == 0:
            votes_db[url_to_update]["safe"] += 1
            vote_type = "SAFE"
        else:
            votes_db[url_to_update]["malicious"] += 1
            vote_type = "MALICIOUS"

        # 4. שמירה לקובץ
        save_votes(votes_path, votes_db)

        # נתונים ללוגים ולתשובה
        current_safe = votes_db[url_to_update]["safe"]
        current_mal = votes_db[url_to_update]["malicious"]
        total = current_safe + current_mal

        # --- לוגים לטרמינל (כדי שתראי שהכל עובד) ---
        sys.stderr.write("\n" + "="*40 + "\n")
        sys.stderr.write(f"🗳️  [VOTE MANAGER] Vote Recorded!\n")
        sys.stderr.write(f"🔗 URL: {url_to_update}\n")
        sys.stderr.write(f"👤 User Voted: {vote_type}\n")
        sys.stderr.write(f"📊 Current Stats: {current_safe} Safe | {current_mal} Malicious\n")
        sys.stderr.write("="*40 + "\n")

        # החזרת תשובה ל-Node.js (חייב להיות JSON)
        # אנחנו מחזירים מבנה שנראה כמו תוצאת אימון כדי לא לשבור את הקונטרולר
        print(json.dumps({
            "status": "success", 
            "message": "Vote registered successfully",
            "url": url_to_update,
            "votes_safe": current_safe,
            "votes_malicious": current_mal,
            "total_votes": total
        }))

    except Exception as e:
        # טיפול בשגיאות בלתי צפויות
        sys.stderr.write(f"Critical Error: {str(e)}\n")
        print(json.dumps({"status": "error", "message": str(e)}))
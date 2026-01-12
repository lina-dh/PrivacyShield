import sys
import os
import math
import json  # הוספנו את זה בשביל לקרוא את ההצבעות
import pandas as pd
import xgboost as xgb

# -------------------- CONFIGURATION --------------------
# כאן את שולטת על הכוח של המשתמשים מול המודל
VOTES_FILE = 'user_votes.json'
VOTE_POWER = 0.2        # כמה כוח נותנת הצבעה אחת (0.2 = 20%)
MAX_USER_WEIGHT = 0.9   # מקסימום כוח למשתמשים (לא נותנים להם 100% אף פעם)
# -------------------------------------------------------

def calculate_entropy(text):
    if not text: return 0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    return -sum(p * math.log(p) / math.log(2.0) for p in prob)

def extract_features(url):
    features = {}
    url_lower = url.lower()
    sus_tlds = ['.xyz', '.top', '.club', '.win', '.info', '.gq', '.tk', '.ml', '.ga', '.cf']
    shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co', 'is.gd', 'buff.ly']
    sus_keywords = ['login', 'verify', 'update', 'account', 'secure', 'banking', 'confirm']
    brands = ['google', 'facebook', 'apple', 'paypal', 'microsoft', 'netflix', 'amazon']
    dangerous_ext = ['.exe', '.zip', '.rar', '.tar', '.7z', '.js', '.vbs']

    features['len'] = len(url)
    features['dots'] = url.count('.')
    features['hyphens'] = url.count('-')
    features['at_symbol'] = url.count('@')
    features['percent'] = url.count('%')
    features['slashes'] = url.count('/')
    digits = sum(c.isdigit() for c in url)
    features['digit_ratio'] = digits / len(url) if len(url) > 0 else 0
    features['entropy'] = calculate_entropy(url)
    features['is_sus_tld'] = 1 if any(url_lower.endswith(tld) for tld in sus_tlds) else 0
    features['is_shortener'] = 1 if any(short in url_lower for short in shorteners) else 0
    features['sus_keywords'] = sum(1 for word in sus_keywords if word in url_lower)
    features['brands'] = sum(1 for brand in brands if brand in url_lower)
    features['dangerous_ext'] = 1 if any(url_lower.endswith(ext) for ext in dangerous_ext) else 0
    features['is_https'] = 1 if url_lower.startswith('https') else 0
    features['has_www'] = 1 if 'www.' in url_lower else 0

    columns = ["len","dots","hyphens","at_symbol","percent","slashes","digit_ratio",
               "entropy","is_sus_tld","is_shortener","sus_keywords","brands",
               "dangerous_ext","is_https","has_www"]
    return pd.DataFrame([features], columns=columns)

def load_votes(file_path):
    """טעינת קובץ ההצבעות בצורה בטוחה"""
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

if __name__ == "__main__":
    # הגנה בסיסית: אם אין ארגומנטים
    if len(sys.argv) < 2:
        print(0)
        sys.exit()

    try:
        # הגדרת נתיבים
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'enhanced_url_classifier.json') 
        votes_path = os.path.join(script_dir, VOTES_FILE)

        # 1. טעינת המודל והרצת XGBoost (כמו שהיה קודם)
        model = xgb.Booster()
        model.load_model(model_path)
        
        input_url = sys.argv[1]
        df = extract_features(input_url)
        dmatrix = xgb.DMatrix(df)
        
        # ציון טכני טהור מהמודל (0.0 עד 1.0)
        raw_model_score = float(model.predict(dmatrix)[0])
        
        # 2. בדיקת "חוכמת ההמונים" (החלק החדש)
        votes_db = load_votes(votes_path)
        final_score = raw_model_score # ברירת מחדל: אם אין הצבעות, הציון נשאר כמו שהוא
        user_impact = 0.0
        
        if input_url in votes_db:
            v = votes_db[input_url]
            safe_votes = v.get("safe", 0)
            malicious_votes = v.get("malicious", 0)
            total_votes = safe_votes + malicious_votes

            if total_votes > 0:
                # א. מה הקהל חושב? (0 = בטוח, 1 = מסוכן)
                # אם 5 אמרו זדוני ו-0 בטוח -> user_verdict = 1.0
                user_verdict = float(malicious_votes) / float(total_votes)

                # ב. כמה אנחנו סומכים עליהם? (הנדנדה)
                # כל הצבעה מוסיפה 20% לכוח, עד מקסימום 90%
                user_impact = min(total_votes * VOTE_POWER, MAX_USER_WEIGHT)
                model_impact = 1.0 - user_impact

                # ג. הנוסחה הסופית
                final_score = (raw_model_score * model_impact) + (user_verdict * user_impact)

                # לוגים מפורטים ל-stderr (כדי שתראי בטרמינל ב-Node)
                sys.stderr.write(f"\n👥 [CROWD WISDOM ACTIVE]\n")
                sys.stderr.write(f"   Votes: {safe_votes} Safe vs {malicious_votes} Malicious\n")
                sys.stderr.write(f"   Model Weight: {model_impact:.2f} | User Weight: {user_impact:.2f}\n")

        # --- הדפסה סופית לטרמינל ---
        sys.stderr.write(f"\n[AI SCAN] URL: {input_url}\n")
        sys.stderr.write(f"   🤖 Model Score: {raw_model_score:.4f}\n")
        sys.stderr.write(f"   🏁 FINAL Score: {final_score:.4f}\n")
        sys.stderr.write("-" * 30 + "\n")

        # זה מה ש-Node.js קורא (רק המספר הסופי)
        print(final_score)
        
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}")
        # במקרה חירום מחזירים 0 (בטוח) כדי לא לתקוע את המערכת
        print(0)
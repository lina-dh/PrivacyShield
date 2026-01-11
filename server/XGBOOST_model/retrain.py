import sys
import os
import json
import math
import pandas as pd
import xgboost as xgb

# פונקציית עזר לחישוב אקראיות הטקסט (Entropy)
def calculate_entropy(text):
    if not text: return 0
    # חישוב הסתברות לכל תו בטקסט
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    # נוסחת אנטרופיה בבסיס 2
    return -sum(p * math.log(p) / math.log(2.0) for p in prob)

# הפיכת ה-URL לרשימת מאפיינים מספריים שהמחשב מבין
def extract_features(url):
    features = {}
    url_lower = url.lower()
    
    # רשימות של סימנים מחשידים (TLDs, מילים מחשידות וכו')
    sus_tlds = ['.xyz', '.top', '.club', '.win', '.info', '.gq', '.tk', '.ml', '.ga', '.cf']
    shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co', 'is.gd', 'buff.ly']
    sus_keywords = ['login', 'verify', 'update', 'account', 'secure', 'banking', 'confirm']
    brands = ['google', 'facebook', 'apple', 'paypal', 'microsoft', 'netflix', 'amazon']
    dangerous_ext = ['.exe', '.zip', '.rar', '.tar', '.7z', '.js', '.vbs']

    # חילוץ נתונים טכניים מהכתובת
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

    # הגדרת סדר העמודות (חייב להתאים בדיוק למודל המאומן!)
    columns = ["len","dots","hyphens","at_symbol","percent","slashes","digit_ratio",
               "entropy","is_sus_tld","is_shortener","sus_keywords","brands",
               "dangerous_ext","is_https","has_www"]
               
    return pd.DataFrame([features], columns=columns)

if __name__ == "__main__":
    try:
        # הגנה 1: בדיקה שהתקבלו מספיק נתונים מהשרת
        if len(sys.argv) < 3:
            print(json.dumps({"status": "error", "message": "Missing arguments (URL and Label)"}))
            sys.exit(1)

        url_to_learn = sys.argv[1]
        new_label = int(sys.argv[2]) # 1 לזדוני, 0 לבטוח

        # איתור נתיב המודל
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'enhanced_url_classifier.json')

        # הגנה 2: בדיקה שקובץ המודל קיים לפני שמנסים לטעון אותו
        if not os.path.exists(model_path):
            print(json.dumps({"status": "error", "message": "Model file not found"}))
            sys.exit(1)

        # 1. טעינת המודל הקיים
        model = xgb.Booster()
        model.load_model(model_path)

        # 2. הכנת המידע החדש וחישוב ציון "לפני"
        df_new = extract_features(url_to_learn)
        dmatrix_new = xgb.DMatrix(df_new)
        score_before = float(model.predict(dmatrix_new)[0])

        # 3. אימון אינקרמנטלי (עדכון המודל על בסיס הדוגמה החדשה)
        dtrain = xgb.DMatrix(df_new, label=[new_label], weight=[10.0])
        params = {
            'objective': 'binary:logistic',
            'eta': 1.0,             # learning rate מקסימלי - למידה מהירה מאוד
            'max_depth': 6,         # מאפשר לעצים להיות מספיק עמוקים כדי לזהות הבדלים
            'min_child_weight': 1 
              # מאפשר ללמוד גם מדוגמה בודדת אחת
        }
        updated_model = xgb.train(params, dtrain, num_boost_round=200, xgb_model=model)

        # 4. שמירה וחישוב ציון "אחרי"
        updated_model.save_model(model_path)
        score_after = float(updated_model.predict(dmatrix_new)[0])

        # הדפסה ללוגים של השרת (לא נשלח למשתמש, רק למתכנתת)
        # --- הדפסה מעוצבת לטרמינל (יופיע בשרת ה-Node.js) ---
        sys.stderr.write("\n" + "="*40 + "\n")
        sys.stderr.write(f"🤖 [AI RETRAIN LOG]\n")
        sys.stderr.write(f"🔗 URL: {url_to_learn}\n")
        sys.stderr.write(f"📈 Score BEFORE: {score_before:.10f}\n")
        sys.stderr.write(f"📉 Score AFTER:  {score_after:.10f}\n")
        sys.stderr.write(f"✨ Improvement:  {abs(score_after - score_before):.10f}\n")
        sys.stderr.write("="*40 + "\n")

        # החזרת תשובה מסודרת בפורמט JSON לשרת ה-Node.js
        print(json.dumps({
            "status": "success", 
            "url": url_to_learn,
            "before": score_before, 
            "after": score_after
        }))

    except Exception as e:
        # טיפול בשגיאות לא צפויות
        print(json.dumps({"status": "error", "message": str(e)}))
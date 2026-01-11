import sys
import pandas as pd
import xgboost as xgb
import json
import os
import re

# --- אותה פונקציית פיצ'רים בדיוק ---
def extract_features(url):
    url = str(url).lower()
    features = []
    
    features.append(len(url))
    features.append(url.count('.'))
    features.append(url.count('-'))
    features.append(url.count('@'))
    features.append(url.count('%'))
    features.append(url.count('/'))

    digits = sum(c.isdigit() for c in url)
    letters = sum(c.isalpha() for c in url)
    features.append(digits / (letters + 1) if letters > 0 else 0)
    
    has_ip = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url) else 0
    features.append(has_ip)

    suspicious_words = ['login', 'signin', 'bank', 'secure', 'account', 'update', 
                        'verify', 'confirm', 'wallet', 'crypto', 'bonus', 'free']
    features.append(sum(1 for word in suspicious_words if word in url))
    
    brands = ['paypal', 'apple', 'google', 'microsoft', 'facebook', 'netflix', 'amazon']
    features.append(sum(1 for brand in brands if brand in url))
    
    dangerous_ext = ['.exe', '.zip', '.tar', '.js', '.vbs', '.apk']
    features.append(1 if any(ext in url for ext in dangerous_ext) else 0)

    features.append(1 if 'https' in url else 0)
    features.append(1 if 'www.' in url else 0)

    return features

feature_names = [
    'len', 'dots', 'hyphens', 'at_symbol', 'percent', 'slashes', 
    'digit_ratio', 'has_ip', 'sus_keywords', 'brands', 'is_file', 'is_https', 'has_www'
]

# --- הלוגיקה הראשית: אימון ועדכון ---
if __name__ == "__main__":
    try:
        # מצפים ל: שם סקריפט, URL, לייבל (1/0)
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Missing arguments"}))
            sys.exit(1)

        url_to_learn = sys.argv[1]
        new_label = int(sys.argv[2])
        
        model_path = os.path.join(os.path.dirname(__file__), "enhanced_url_classifier.json")

        if not os.path.exists(model_path):
            print(json.dumps({"error": "Model file missing"}))
            sys.exit(1)

        # 1. טעינת המוח הקיים
        model = xgb.XGBClassifier()
        model.load_model(model_path)

        # 2. יצירת הדוגמה החדשה
        features = extract_features(url_to_learn)
        df_new = pd.DataFrame([features], columns=feature_names)
        y_new = pd.Series([new_label])

        # 3. אימון אינקרמנטלי (הוספת הידע החדש על גבי הישן)
        model.fit(df_new, y_new, xgb_model=model_path)

        # 4. שמירה
        model.save_model(model_path)

        print(json.dumps({
            "status": "success", 
            "message": "Model updated successfully",
            "url": url_to_learn
        }))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
import sys
import pandas as pd
import xgboost as xgb
import json
import os
import re

# --- פונקציית הפיצ'רים (חייבת להיות זהה לזו שבאימון) ---
def extract_features(url):
    url = str(url).lower()
    features = []
    
    # מבנה ה-URL
    features.append(len(url))
    features.append(url.count('.'))
    features.append(url.count('-'))
    features.append(url.count('@'))
    features.append(url.count('%'))
    features.append(url.count('/'))

    # סטטיסטיקה
    digits = sum(c.isdigit() for c in url)
    letters = sum(c.isalpha() for c in url)
    features.append(digits / (letters + 1) if letters > 0 else 0)
    
    # בדיקת IP
    has_ip = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url) else 0
    features.append(has_ip)

    # מילות מפתח חשודות
    suspicious_words = ['login', 'signin', 'bank', 'secure', 'account', 'update', 
                        'verify', 'confirm', 'wallet', 'crypto', 'bonus', 'free']
    features.append(sum(1 for word in suspicious_words if word in url))
    
    # מותגים
    brands = ['paypal', 'apple', 'google', 'microsoft', 'facebook', 'netflix', 'amazon']
    features.append(sum(1 for brand in brands if brand in url))
    
    # סיומות קבצים מסוכנות
    dangerous_ext = ['.exe', '.zip', '.tar', '.js', '.vbs', '.apk']
    features.append(1 if any(ext in url for ext in dangerous_ext) else 0)

    features.append(1 if 'https' in url else 0)
    features.append(1 if 'www.' in url else 0)

    return features

# שמות העמודות (חובה שיהיה תואם למודל)
feature_names = [
    'len', 'dots', 'hyphens', 'at_symbol', 'percent', 'slashes', 
    'digit_ratio', 'has_ip', 'sus_keywords', 'brands', 'is_file', 'is_https', 'has_www'
]

# --- הלוגיקה הראשית ---
if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No URL provided"}))
            sys.exit(1)

        url_to_scan = sys.argv[1]
        
        # נתיב למודל (נמצא באותה תיקייה)
        model_path = os.path.join(os.path.dirname(__file__), "enhanced_url_classifier.json")

        if not os.path.exists(model_path):
            print(json.dumps({"error": "Model file not found"}))
            sys.exit(1)

        # טעינת המודל
        model = xgb.XGBClassifier()
        model.load_model(model_path)

        # חיזוי
        features = extract_features(url_to_scan)
        df = pd.DataFrame([features], columns=feature_names)

        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]

        # החזרת JSON ל-Node.js
        print(json.dumps({
            "url": url_to_scan,
            "is_malicious": int(prediction) == 1,
            "risk_score": float(probability),
            "status": "success"
        }))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
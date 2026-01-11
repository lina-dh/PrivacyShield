# server/XGBOOST_model/predict_server.py
import sys
import os
import json
import math
import pandas as pd
import xgboost as xgb
from urllib.parse import urlparse

# --- 1. חילוץ תכונות למודל ---
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

# --- 2. מנגנון חוקים (החלק החדש!) ---
def apply_heuristics(url, model_score):
    """
    פונקציה זו מתקנת את הציון אם המודל פיספס משהו קריטי
    """
    url_lower = url.lower()
    heuristic_score = 0.0
    
    # חוק 1: התחזות למותגים (הכי חשוב!)
    # אם כתוב 'paypal' אבל הדומיין הוא לא paypal.com
    high_risk_brands = ['paypal', 'google', 'facebook', 'apple', 'microsoft', 'bank']
    
    for brand in high_risk_brands:
        if brand in url_lower:
            # בדיקה פשוטה: אם המותג קיים, אבל הוא לא הדומיין הראשי
            # (זה לא קוד מושלם אבל מספיק להאקתון)
            if not (f"{brand}.com" in url_lower or f"{brand}.co.il" in url_lower):
                heuristic_score = 0.95 # סיכון מיידי!
                
    # חוק 2: סיומות מסוכנות מאוד
    dangerous_tlds = ['.xyz', '.top', '.win']
    if any(url_lower.endswith(tld) for tld in dangerous_tlds):
        if heuristic_score < 0.6:
            heuristic_score = 0.6
            
    # אנחנו מחזירים את הגבוה מבין השניים: מה שהמודל חשב, או מה שהחוקים קבעו
    return max(model_score, heuristic_score)

# --- 3. ראשי ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(0)
        sys.exit()

    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'enhanced_url_classifier.json') 

        if not os.path.exists(model_path):
            print(0)
            sys.exit()

        # חיזוי המודל
        model = xgb.Booster()
        model.load_model(model_path)
        
        input_url = sys.argv[1]
        df = extract_features(input_url)
        dmatrix = xgb.DMatrix(df)
        
        # הציון הגולמי של המודל
        raw_score = float(model.predict(dmatrix)[0])
        
        # הציון המשוקלל עם החוקים שלנו
        final_score = apply_heuristics(input_url, raw_score)
        
        # הדפסה (חשוב להדפיס רק את המספר הסופי!)
        print(final_score)
        
    except Exception as e:
        # במקרה שגיאה נדפיס 0
        sys.stderr.write(f"Error: {str(e)}")
        print(0)
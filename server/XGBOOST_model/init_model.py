import xgboost as xgb
import pandas as pd
import os
import json

# רשימת העמודות שהמודל מצפה להן (חייב להיות זהה ל-retrain.py)
columns = ["len","dots","hyphens","at_symbol","percent","slashes","digit_ratio",
           "entropy","is_sus_tld","is_shortener","sus_keywords","brands",
           "dangerous_ext","is_https","has_www"]

def initialize_empty_model():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'enhanced_url_classifier.json')

    # 1. יצירת דאטה דמיוני (לינק אחד "טוב" ולינק אחד "רע") כדי שהמודל יכיר את המבנה
    dummy_data = pd.DataFrame([[0]*15, [1]*15], columns=columns)
    dummy_labels = [0, 1]

    # 2. אימון בסיסי ראשוני
    # אנחנו משתמשים ב-Booster ישירות כדי להבטיח תאימות ל-retrain.py
    dtrain = xgb.DMatrix(dummy_data, label=dummy_labels)
    params = {'objective': 'binary:logistic'}
    model = xgb.train(params, dtrain, num_boost_round=2)

    # 3. שמירה
    model.save_model(model_path)
    print(f"✅ Created a fresh model file at: {model_path}")

if __name__ == "__main__":
    initialize_empty_model()
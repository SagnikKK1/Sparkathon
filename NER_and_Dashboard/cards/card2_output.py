import json
from pathlib import Path

def load_buzz_pie(product: str):
    """Load and return the contents of <product>_buzz_pie.json."""
    clean = "".join(c for c in product.lower() if c.isalnum())
    pie_path = Path(__file__).parent.parent / f"{clean}_buzz_pie.json"
    
    try:
        with open(pie_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ File not found: {pie_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error in {pie_path}: {e}")
        return None

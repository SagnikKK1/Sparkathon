import json
from pathlib import Path

def load_summary(product: str):
    """Load and return the contents of <product>_summary.json."""
    clean = "".join(c for c in product.lower() if c.isalnum())
    summary_path = Path(__file__).parent.parent / f"{clean}_summary.json"
    
    try:
        with open(summary_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ File not found: {summary_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error in {summary_path}: {e}")
        return None

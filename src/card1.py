#!/usr/bin/env python3
"""
card_overview.py
----------------
Outputs a single JSON object of “score-out-of-10” values:

{
  "<Product Name>": 7.88,
  "<Feature1>": 8.40,
  "<Feature2>": 6.25,
  ...
}

•  Overall product score  = sentiment-weighted mean from clustered.json → 0-10 scale
•  Feature scores         = avg_sentiment from features_clustered.json → 0-10 scale
•  Features ranked by relevance (desc), then by count
"""

import argparse, json, pathlib

# ────────────────────────────────────────────────────────────────────────────
def sentiment_to_score(s: float) -> float:
    """Convert [-1,1] sentiment to a [0,10] dashboard score."""
    return round((s + 1) * 5, 2)

def weighted_product_sent(clustered: dict) -> float:
    total, weighted = 0, 0.0
    for v in clustered.values():
        cnt = v["count"]
        total   += cnt
        weighted += cnt * v["avg_sentiment"]
    return weighted / total if total else 0.0

# ────────────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--product", required=True)
    ap.add_argument("--clustered_json",  default="json_dumps/clustered.json")
    ap.add_argument("--features_json",   default="json_dumps/features_clustered.json")
    ap.add_argument("--top", type=int,   default=5)
    ap.add_argument("--output",          default="json_dumps/card_overview.json")
    args = ap.parse_args()

    clustered = json.loads(pathlib.Path(args.clustered_json).read_text(encoding="utf-8"))
    features  = json.loads(pathlib.Path(args.features_json).read_text(encoding="utf-8"))

    # 1️⃣  Overall score
    overall_sent   = weighted_product_sent(clustered)
    overall_score  = sentiment_to_score(overall_sent)

    # 2️⃣  Top‑N features by relevance then count
    top_feats = sorted(
        features.items(),
        key=lambda kv: (-kv[1].get("relevance", 0.0), -kv[1]["count"])
    )[: args.top]

    # 3️⃣  Build output JSON
    card = {args.product: overall_score}
    for name, data in top_feats:
        card[name] = sentiment_to_score(data["avg_sentiment"])

    # 4️⃣  Save
    pathlib.Path(args.output).write_text(json.dumps(card, indent=2), encoding="utf-8")
    print(f"📊  Overview card JSON → {args.output}")

# ────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    main()

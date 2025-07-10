#!/usr/bin/env python3
"""
buzz_summary.py
---------------
Creates two JSONs:
1. summary_card.json  -> global product metrics
2. buzz_pie.json      -> top‑5 feature contribution to Buzz Score

Buzz Score formula (per feature):
    volume_share  = count / Σcount
    sentiment_norm = (avg_sentiment + 1) / 2     # −1..1 → 0..1
    relevance_share = relevance / Σrelevance     # 0..1 normalized
    buzz_feature = sentiment_norm × (0.5*volume_share + 0.5*relevance_share)

Product Buzz Score = 10 × Σ buzz_feature   ∈ [0, 10]
"""

import argparse, json
from pathlib import Path

# ── Conversion helpers ─────────────────────────────────────────────────────
def sentiment_to_score(s: float) -> float:
    """Map VADER compound −1..1 → 0..10 linear."""
    return round((s + 1) * 5, 2)

# ── Sentiment stats on raw comments ────────────────────────────────────────
def get_comment_sentiment_stats(comments_file: str):
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    analyzer = SentimentIntensityAnalyzer()

    comments = Path(comments_file).read_text(encoding="utf-8").split("\n\n")
    pos = neg = neu = total = sent_sum = 0.0
    for txt in comments:
        if not txt.strip():
            continue
        total += 1
        score = analyzer.polarity_scores(txt)["compound"]
        sent_sum += score
        if score >= 0.05:
            pos += 1
        elif score <= -0.05:
            neg += 1
        else:
            neu += 1

    pos_neg_ratio = round(pos / neg, 2) if neg else float("inf")
    avg_sent = round(sent_sum / total, 4) if total else 0.0
    return total, pos, neg, neu, pos_neg_ratio, avg_sent

# ── Buzz score computation ─────────────────────────────────────────────────
def compute_feature_buzz(feature_dict, vol_total, rel_total):
    """Compute normalized buzz for ONE feature."""
    vol_share = feature_dict["count"] / vol_total
    sent_norm = (feature_dict["avg_sentiment"] + 1) / 2
    rel_share = feature_dict.get("relevance", 0.0) / rel_total if rel_total else 0
    return sent_norm * (0.5 * vol_share + 0.5 * rel_share)

# ── JSON builders ──────────────────────────────────────────────────────────
def build_summary_card(product: str,
                       reddit_file: str,
                       yt_file: str,
                       comments_file: str,
                       features_json: str):

    # -- comment counts --
    reddit_cnt  = len(Path(reddit_file ).read_text(encoding="utf-8").split("\n\n")) - 1
    youtube_cnt = len(Path(yt_file).read_text(encoding="utf-8").split("\n\n")) - 1

    # -- sentiment stats on all comments --
    total, pos, neg, neu, pn_ratio, avg_sent = get_comment_sentiment_stats(comments_file)

    # -- feature‑level buzz --
    feats = json.loads(Path(features_json).read_text(encoding="utf-8"))
    vol_total = sum(v["count"]      for v in feats.values()) or 1
    rel_total = sum(v["relevance"]  for v in feats.values()) or 1

    product_buzz = sum(
        compute_feature_buzz(v, vol_total, rel_total) for v in feats.values()
    )
    product_buzz_score = round(product_buzz * 10, 2)

    return {
        "Buzz Score": product_buzz_score,
        "Reddit Comments Count": reddit_cnt,
        "YouTube Comments Count": youtube_cnt,
        "Total Comments": total,
        "Positive Comments": pos,
        "Negative Comments": neg,
        "Neutral Comments": neu,
        "Positive to Negative Ratio": pn_ratio,
        "Net Sentiment Score": sentiment_to_score(avg_sent)
    }

def build_buzz_pie(features_json: str, top_k=5):
    feats = json.loads(Path(features_json).read_text(encoding="utf-8"))
    vol_total = sum(v["count"]     for v in feats.values()) or 1
    rel_total = sum(v["relevance"] for v in feats.values()) or 1

    buzz_vals = {
        name: compute_feature_buzz(v, vol_total, rel_total)
        for name, v in feats.items()
    }
    total_buzz = sum(buzz_vals.values()) or 1

    # -- top‑K + "Other" --
    sorted_feats = sorted(buzz_vals.items(), key=lambda kv: kv[1], reverse=True)
    top_feats  = sorted_feats[:top_k]
    other_val  = sum(v for _, v in sorted_feats[top_k:])

    pie = {name: round(val / total_buzz, 4) for name, val in top_feats}
    pie["Other Features"] = round(other_val / total_buzz, 4)
    return pie

# ── CLI wrapper ────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--product",        required=True)
    ap.add_argument("--reddit",         required=True)
    ap.add_argument("--youtube",        required=True)
    ap.add_argument("--comments",       required=True)
    ap.add_argument("--features_json",  required=True)
    ap.add_argument("--summary_out",    default="../json_dumps/summary_card.json")
    ap.add_argument("--pie_out",        default="../json_dumps/buzz_pie.json")
    args = ap.parse_args()

    # Ensure output directory exists
    Path(args.summary_out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.pie_out).parent.mkdir(parents=True, exist_ok=True)

    summary = build_summary_card(
        args.product, args.reddit, args.youtube, args.comments, args.features_json
    )
    pie = build_buzz_pie(args.features_json)

    Path(args.summary_out).write_text(json.dumps(summary, indent=2), encoding="utf-8")
    Path(args.pie_out).write_text(json.dumps(pie, indent=2), encoding="utf-8")

    print(f"✅ Summary card  → {args.summary_out}")
    print(f"✅ Buzz pie JSON → {args.pie_out}")

if __name__ == "__main__":
    main()

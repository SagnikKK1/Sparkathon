import praw

reddit = praw.Reddit(
    client_id="OUwBrtAey0Q62gRas9SSGQ",
    client_secret="7Ixb0wkCPpnR1vHGas9osU0ADrUnrw",
    user_agent="ai-dashboard-script by u/FastLemon8081"
)

search_query = "iphone 15"
limit_posts = 5  

print(f"🔍 Searching posts about: {search_query}")
results = reddit.subreddit("all").search(search_query, sort="relevance", time_filter="month", limit=limit_posts)

comments_collected = []

for post in results:
    post.comments.replace_more(limit=0)  
    print(f"\n📄 Post: {post.title}")
    
    for comment in post.comments:
        text = comment.body.strip()
        if len(text) > 20:  
            comments_collected.append(text)

print(f"\n✅ Collected {len(comments_collected)} comments.")

output_file = "iphone15_comments.txt"
with open(output_file, "w", encoding="utf-8") as f:
    for c in comments_collected:
        f.write(c + "\n\n")

print(f"💾 Comments saved to: {output_file}")

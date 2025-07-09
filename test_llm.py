#!/usr/bin/env python3
"""
Test script to debug LLM response
"""

import json
import re
import litellm
import os
from dotenv import load_dotenv

load_dotenv()

def test_llm():
    # Sample clusters from the actual data
    clusters = [
        "apple",
        "iphone / the iphone / an iphone / a iphone / iphones / the new iphone", 
        "the camera / camera",
        "samsung",
        "15 pro max",
        "android"
    ]
    
    prompt = (
        "You will be given clusters of phrases extracted from user comments.\n"
        "For EACH cluster, respond with exactly one label:\n"
        "  ENTITY   - brand, model, company, competitor product\n"
        "  FEATURE  - attribute, specification, part, or quality\n"
        "  IGNORE   - anything else (numbers, vague words)\n\n"
        "Product: 'iPhone 15'  (type: 'mobile phone')\n\n"
        "Return JSON object mapping the literal cluster string to its label."
    )
    
    user = json.dumps(clusters, indent=2)
    
    print("🔍 Sending to LLM:")
    print("Prompt:", prompt)
    print("User:", user)
    print("\n" + "="*50 + "\n")
    
    try:
        rsp = litellm.completion(
            model=os.getenv("LLM_MODEL", "ollama/llama3"),
            messages=[{"role":"system","content":prompt},
                      {"role":"user","content":user}],
            max_tokens=512,
            temperature=0.0,
            api_key=os.getenv("LLM_API_KEY") or None,
        ).choices[0].message.content.strip()
        
        print("🔍 LLM RAW RESPONSE:")
        print(repr(rsp))
        print("\n" + "="*50 + "\n")
        
        print("🔍 LLM RESPONSE (formatted):")
        print(rsp)
        print("\n" + "="*50 + "\n")
        
        # Try to parse JSON
        try:
            mapping = json.loads(re.search(r"\{.*\}", rsp, re.S).group())
            print("✅ JSON parsed successfully:")
            print(json.dumps(mapping, indent=2))
        except Exception as e:
            print("❌ JSON parse failed:", e)
            print("Trying to extract JSON manually...")
            
            # Try different approaches
            if "{" in rsp and "}" in rsp:
                start = rsp.find("{")
                end = rsp.rfind("}") + 1
                json_str = rsp[start:end]
                print("Extracted JSON string:", json_str)
                try:
                    mapping = json.loads(json_str)
                    print("✅ Manual extraction worked!")
                    print(json.dumps(mapping, indent=2))
                except Exception as e2:
                    print("❌ Manual extraction failed:", e2)
            
    except Exception as e:
        print("❌ LLM call failed:", e)

if __name__ == "__main__":
    test_llm() 
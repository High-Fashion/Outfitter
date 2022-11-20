import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import Normalizer
from sklearn.compose import make_column_transformer

def color_code_to_rgb(color):
    color = color.lstrip('#')
    return tuple(int(color[i:i+2], 16) for i in (0, 2, 4))

df = pd.read_json("./shoes.json")

ohe = OneHotEncoder()

transformer = make_column_transformer(
    (ohe, ["category", "material", "pattern", "brand"]),
    remainder='drop')

tf = transformer.fit_transform(df)

tfidf = TfidfVectorizer(stop_words="english")
df["subcategories"] = df["subcategories"].str.join(" ")
tfid_matrix = tfidf.fit_transform(df["subcategories"])

cosine_sim_subcats = linear_kernel(tfid_matrix, tfid_matrix)
cosine_sim = linear_kernel(tf, tf)

norm = Normalizer(norm="max")
cosine_sim = norm.fit_transform(cosine_sim)

indices = pd.Series(df.index, index=df['id']).drop_duplicates()

def get_recommendations(id, cosine_sim=cosine_sim):
    idx = indices[id]
    tdf = df
    tdf["similarity A"] = cosine_sim[idx]
    tdf["similarity B"] = cosine_sim_subcats[idx]
    tdf["score"] = (tdf["similarity A"] + tdf["similarity B"]) / 2
    tdf = tdf[["score", "similarity A", "similarity B", "category", "subcategories", "brand", "pattern", "material"]]
    tdf = tdf.sort_values("score", ascending=False)
    print(tdf.head(3))
    # sim_scores = enumerate(zip(cosine_sim[idx], cosine_sim_subcats[idx]))
    # sort based on sim scores
    # sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # for i in sim_scores[1:11]:
        # print(i)

for i in range(100):
    get_recommendations(i)
    print("\n")
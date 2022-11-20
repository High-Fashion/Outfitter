import numpy as np
import pandas as pd
import json
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import nan_euclidean_distances
from sklearn.feature_extraction import DictVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import Normalizer
from sklearn.compose import make_column_transformer

def color_code_to_rgb(color):
    if color == "None":
        return None
    color = color.lstrip("#")
    return tuple(int(color[i:i+2], 16) for i in (0, 2, 4))

data = {}

with open("./shoes.json") as f:
    data = json.load(f)
    f.close()

df = pd.json_normalize(data).truncate(after=9)
df = df.fillna(np.nan).replace([np.nan], [None])

df["colors.primary"] = df["colors.primary"].astype(str).apply(color_code_to_rgb)
df["colors.secondary"] = df["colors.secondary"].astype(str).apply(color_code_to_rgb)
df["colors.tertiary"] = df["colors.tertiary"].astype(str).apply(color_code_to_rgb)


for rank in ["colors.primary","colors.secondary","colors.tertiary"]:
    df[rank + ".r"], df[rank + ".g"], df[rank + ".b"] = df[rank].str
    print(rank)

print(df)

primary_colors = df[["colors.primary.r", "colors.primary.g", "colors.primary.b"]]
# primary_colors = primary_colors.dropna(how="any")
secondary_colors = df[["colors.secondary.r", "colors.secondary.g", "colors.secondary.b"]]
# secondary_colors = secondary_colors.dropna(how="any")
tertiary_colors = df[["colors.tertiary.r", "colors.tertiary.g", "colors.tertiary.b"]]
# tertiary_colors = tertiary_colors.dropna(how="any")

scaler = MinMaxScaler()

inverse = np.vectorize(lambda x: 0 if x!=x else 1-x, otypes=[object])

cosine_sim_p = nan_euclidean_distances(primary_colors, primary_colors)
cosine_sim_p = scaler.fit_transform(cosine_sim_p)
cosine_sim_p = inverse(cosine_sim_p)

cosine_sim_s = nan_euclidean_distances(X=secondary_colors, Y=secondary_colors)
cosine_sim_s = scaler.fit_transform(cosine_sim_s)
cosine_sim_s = inverse(cosine_sim_s)

cosine_sim_t = nan_euclidean_distances(tertiary_colors, tertiary_colors)
cosine_sim_t = scaler.fit_transform(cosine_sim_t)
cosine_sim_t = inverse(cosine_sim_t)

indices = pd.Series(df.index, index=df['id']).drop_duplicates()

def get_recommendations(id):
    idx = indices[id]
    sim_scores = enumerate(zip(cosine_sim_p[idx], cosine_sim_s[idx], cosine_sim_t[idx]))
    # sort based on sim scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    for i in sim_scores:
        print(i)

get_recommendations(2)

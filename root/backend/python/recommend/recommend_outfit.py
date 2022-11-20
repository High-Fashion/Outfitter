import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import Normalizer
from sklearn.feature_extraction import DictVectorizer
from sklearn.compose import make_column_transformer

df = pd.read_json("outfits.json").truncate(after=9)


# tops sim
dv = DictVectorizer()
df_tops = df.explode("tops")
# df_tops = df_tops[["user", "tops"]]
# df_tops["type"] = df_tops["tops"].astype(object).get("type")
# print(df_tops)
# tf = dv.fit_transform(df_tops)
# print(tf)
# bottoms sim
# shoes sim
# accessories sim

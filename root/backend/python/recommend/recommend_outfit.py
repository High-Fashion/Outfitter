from urllib.parse import unquote
import sys
import argparse
import json
import numpy as np
import pandas as pd
import itertools
from dataclasses import make_dataclass
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import nan_euclidean_distances
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import Normalizer
from sklearn.feature_extraction import DictVectorizer
from sklearn.compose import make_column_transformer

Top = make_dataclass("Top", [
    ("_id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict),
    ("fit", str)])

Bottom = make_dataclass("Bottom", [
    ("_id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict),
    ("fit", str)])

Accessory = make_dataclass("Accessory", [
    ("_id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("slot", list),
    ("colors", dict)])

Shoe = make_dataclass("Shoes", [
    ("_id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict)])

OnePiece = make_dataclass("OnePiece", [
    ("_id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict)])

Outfit = make_dataclass("Outfit", [
    ("_id", int),
    ("tops", list),
    ("bottoms", Bottom),
    ("shoes", str),
    ("accessories", list),
    ("one_piece", OnePiece)])


def create_top(content):
    if (type(content) != dict):
        return Top(None, None, None, None, None, None, None, None)
    return Top(content["_id"],
               content["category"],
               content["brand"],
               content["pattern"],
               content["material"],
               content["subcategories"],
               content["colors"],
               content["fit"])


def create_bottom(content):
    if (type(content) != dict):
        return Bottom(None, None, None, None, None, None, None, None)
    return Bottom(content["_id"],
                  content["category"],
                  content["brand"],
                  content["pattern"],
                  content["material"],
                  content["subcategories"],
                  content["colors"],
                  content["fit"])


def create_accessory(content):
    if (type(content) != dict):
        return Accessory(None, None, None, None, None, None, None, None)
    return Accessory(content["_id"],
                     content["category"],
                     content["brand"],
                     content["pattern"],
                     content["material"],
                     content["subcategories"],
                     content["slot"],
                     content["colors"])


def create_shoe(content):
    if (type(content) != dict):
        return Shoe(None, None, None, None, None, None, None)
    return Shoe(content["_id"],
                content["category"],
                content["brand"],
                content["pattern"],
                content["material"],
                content["subcategories"],
                content["colors"])


def create_one_piece(content):
    if (type(content) != dict):
        return OnePiece(None, None, None, None, None, None, None)
    return OnePiece(content["_id"],
                    content["category"],
                    content["brand"],
                    content["pattern"],
                    content["material"],
                    content["subcategories"],
                    content["colors"])


def score_category(data):
    ohe = OneHotEncoder()
    cat_tf = ohe.fit_transform(data["category"].to_numpy().reshape(-1, 1))
    cat_sim = linear_kernel(cat_tf, cat_tf)
    return cat_sim


def clean_string(string: str):
    for remove in ["-", " ", "_"]:
        string = string.replace(remove, "")
    return string


def score_subcategories(data):
    tfidf_word = TfidfVectorizer()
    subcategories: pd.Series = data["subcategories"]
    sub_strings = ["None" if value == None else " ".join(
        [clean_string(v) for v in value]) for i, value in subcategories.items()]
    sub_cat_tf = tfidf_word.fit_transform(sub_strings)
    sub_cat_sim = linear_kernel(sub_cat_tf, sub_cat_tf)
    return sub_cat_sim


def score_metadata(data, fit=False):
    ohe = OneHotEncoder()
    norm = Normalizer(norm="max")
    transformer = make_column_transformer(
        (ohe, ["material", "pattern", "brand", "fit"]
         if fit else ["material", "pattern", "brand"]),
        remainder='drop')
    tf = transformer.fit_transform(data)
    meta_data_sim = linear_kernel(tf, tf)
    meta_data_sim = norm.fit_transform(meta_data_sim)
    return meta_data_sim


def color_code_to_rgb(color):
    if color == None:
        return None
    color = color.lstrip("#")
    return list(int(color[i:i+2], 16) for i in (0, 2, 4))


def score_colors(data: pd.DataFrame, num):
    primary_colors = []
    secondary_colors = []
    tertiary_colors = []
    for index, value in data["colors.primary"].items():
        if (index < num):
            primary_colors.append(value)
            continue
        if value == None or value != value:
            primary_colors.append([None, None, None])
        else:
            primary_colors.append(color_code_to_rgb(value))
    for index, value in data["colors.secondary"].items():
        if (index < num):
            secondary_colors.append(value)
            continue
        if value == None or value != value:
            secondary_colors.append([None, None, None])
        else:
            secondary_colors.append(color_code_to_rgb(value))
    for index, value in data["colors.tertiary"].items():
        if (index < num):
            tertiary_colors.append(value)
            continue
        if value == None or value != value:
            tertiary_colors.append([None, None, None])
        else:
            tertiary_colors.append(color_code_to_rgb(value))

    df_colors = pd.DataFrame({"_id": data["_id"], "colors.primary": primary_colors,
                             "colors.secondary": secondary_colors, "colors.tertiary": tertiary_colors})
    scaler = MinMaxScaler()
    inverse = np.vectorize(lambda x: 0 if x != x else 1-x, otypes=[object])

    color_sim_primary = nan_euclidean_distances(
        df_colors["colors.primary"].to_list(), df_colors["colors.primary"].to_list())
    color_sim_primary = inverse(color_sim_primary)
    if (color_sim_primary.max() != color_sim_primary.min()):
        color_sim_primary = scaler.fit_transform(color_sim_primary)
    color_sim_secondary = nan_euclidean_distances(
        df_colors["colors.secondary"].to_list(), df_colors["colors.secondary"].to_list())
    color_sim_secondary = inverse(color_sim_secondary)
    if (color_sim_secondary.max() != color_sim_secondary.min()):
        color_sim_secondary = scaler.fit_transform(color_sim_secondary)
    color_sim_tertiary = nan_euclidean_distances(
        df_colors["colors.tertiary"].to_list(), df_colors["colors.tertiary"].to_list())
    color_sim_tertiary = inverse(color_sim_tertiary)
    if (color_sim_tertiary.max() != color_sim_tertiary.min()):
        color_sim_tertiary = scaler.fit_transform(color_sim_tertiary)

    return color_sim_primary, color_sim_secondary, color_sim_tertiary


def score_tops(tops: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_tops = desired_outfit[["torso"]].iloc[0]["torso"]
    df_outfit_tops = pd.DataFrame(df_outfit_tops)
    num_tops = len(df_outfit_tops.index)
    df_outfit_tops = pd.DataFrame(create_top(row.to_dict())
                                  for index, row in df_outfit_tops.iterrows())
    colors = []
    for index, value in df_outfit_tops["colors"].items():
        if value == None:
            colors.append(
                [[None, None, None], [None, None, None], [None, None, None]])
        else:
            primary = [None, None, None] if "primary" not in value.keys(
            ) else color_code_to_rgb(value["primary"])
            secondary = [None, None, None] if "secondary" not in value.keys(
            ) else color_code_to_rgb(value["secondary"])
            tertiary = [None, None, None] if "tertiary" not in value.keys(
            ) else color_code_to_rgb(value["tertiary"])
            color = (primary, secondary, tertiary)
            colors.append(color)
    df_colors = pd.DataFrame({"_id": df_outfit_tops["_id"], "colors.primary": [c[0] for c in colors], "colors.secondary": [
                             c[1] for c in colors], "colors.tertiary": [c[2] for c in colors]})
    df_outfit_tops = df_outfit_tops.merge(df_colors, how="right", on="_id")
    df_temp = df_outfit_tops[["_id", "category", "subcategories", "brand", "material",
                              "pattern", "colors.primary", "colors.secondary", "colors.tertiary", "fit"]]
    df_temp = pd.concat([df_temp, tops], ignore_index=True)
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp, fit=True)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp, num_tops)

    scores = []
    for index, row in df_outfit_tops.iterrows():
        color_n = len(row.to_dict()["colors"].keys())
        df_score = df_temp[["_id"]]
        df_cat = pd.DataFrame(
            {"_id": df_temp["_id"], "category": category_sim[index]})

        df_subcat = pd.DataFrame(
            {"_id": df_temp["_id"], "subcategories": subcategory_sim[index]})
        df_meta = pd.DataFrame(
            {"_id": df_temp["_id"], "metadata": metadata_sim[index]})
        df_colors = pd.DataFrame({"_id": df_temp["_id"], "primary": color_sim_primary[index],
                                 "secondary": color_sim_secondary[index], "tertiary": color_sim_tertiary[index]})
        df_score = df_score.merge(
            df_cat, how="right", on="_id").drop_duplicates()
        df_score = df_score.merge(
            df_subcat, how="right", on="_id").drop_duplicates()
        df_score = df_score.merge(
            df_meta, how="right", on="_id").drop_duplicates()
        df_score = df_score.merge(
            df_colors, how="right", on="_id").drop_duplicates()
        df_score["colors"] = (df_score["primary"] +
                              (df_score["secondary"] if color_n > 1 else 0) +
                              (df_score["tertiary"] if color_n > 2 else 0)) / color_n
        df_score["score"] = df_score["category"] + \
            (df_score["category"] * df_score["subcategories"]) + \
            df_score["metadata"] + df_score["colors"]
        df_score = df_score.sort_values(by="score", ascending=False)
        scores.append(df_score[["_id", "score"]])
    return scores


def score_bottoms(bottoms: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_bottoms = desired_outfit[["legs"]].iloc[0]["legs"]
    df_outfit_bottoms = pd.DataFrame(df_outfit_bottoms)
    df_outfit_bottoms = pd.DataFrame(create_bottom(row.to_dict())
                                     for index, row in df_outfit_bottoms.iterrows())
    colors = []
    for index, value in df_outfit_bottoms["colors"].items():
        if value == None:
            colors.append(
                [[None, None, None], [None, None, None], [None, None, None]])
        else:
            primary = [None, None, None] if "primary" not in value.keys(
            ) else color_code_to_rgb(value["primary"])
            secondary = [None, None, None] if "secondary" not in value.keys(
            ) else color_code_to_rgb(value["secondary"])
            tertiary = [None, None, None] if "tertiary" not in value.keys(
            ) else color_code_to_rgb(value["tertiary"])
            color = (primary, secondary, tertiary)
            colors.append(color)
    df_colors = pd.DataFrame({"_id": df_outfit_bottoms["_id"], "colors.primary": [c[0] for c in colors], "colors.secondary": [
                             c[1] for c in colors], "colors.tertiary": [c[2] for c in colors]})
    df_outfit_bottoms = df_outfit_bottoms.merge(
        df_colors, how="right", on="_id")

    df_temp = df_outfit_bottoms[[
        "_id", "category", "subcategories", "brand", "material", "pattern", "colors.primary", "colors.secondary", "colors.tertiary", "fit"]]
    df_temp = pd.concat([df_temp, bottoms], ignore_index=True)
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp, fit=True)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp, 1)
    color_n = len(desired_outfit.iloc[0]["legs"][0]["colors"].keys())
    df_score = df_temp[["_id"]]
    df_cat = pd.DataFrame(
        {"_id": df_temp["_id"], "category": category_sim[0]})
    df_subcat = pd.DataFrame(
        {"_id": df_temp["_id"], "subcategories": subcategory_sim[0]})
    df_meta = pd.DataFrame(
        {"_id": df_temp["_id"], "metadata": metadata_sim[0]})
    df_colors = pd.DataFrame(
        {"_id": df_temp["_id"], "primary": color_sim_primary[0], "secondary": color_sim_secondary[0], "tertiary": color_sim_tertiary[0]})

    df_score = df_score.merge(df_cat, how="right", on="_id").drop_duplicates()
    df_score = df_score.merge(df_subcat, how="right",
                              on="_id").drop_duplicates()
    df_score = df_score.merge(df_meta, how="right", on="_id").drop_duplicates()
    df_score = df_score.merge(df_colors, how="right",
                              on="_id").drop_duplicates()

    df_score["colors"] = (df_score["primary"] +
                          (df_score["secondary"] if color_n > 1 else 0) +
                          (df_score["tertiary"] if color_n > 2 else 0)) / color_n
    df_score["score"] = df_score["category"] + \
        (df_score["category"] * df_score["subcategories"]) + \
        df_score["metadata"] + df_score["colors"]
    df_score = df_score.sort_values(by="score", ascending=False)
    return df_score[["_id", "score"]]


def score_shoes(shoes: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_shoes = desired_outfit[["feet"]].iloc[0]["feet"]
    df_outfit_shoes = pd.DataFrame(df_outfit_shoes)
    df_outfit_shoes = pd.DataFrame(create_shoe(row.to_dict())
                                   for index, row in df_outfit_shoes.iterrows())
    colors = []
    for index, value in df_outfit_shoes["colors"].items():
        if value == None:
            colors.append(
                [[None, None, None], [None, None, None], [None, None, None]])
        else:
            primary = [None, None, None] if "primary" not in value.keys(
            ) else color_code_to_rgb(value["primary"])
            secondary = [None, None, None] if "secondary" not in value.keys(
            ) else color_code_to_rgb(value["secondary"])
            tertiary = [None, None, None] if "tertiary" not in value.keys(
            ) else color_code_to_rgb(value["tertiary"])
            color = (primary, secondary, tertiary)
            colors.append(color)
    df_colors = pd.DataFrame({"_id": df_outfit_shoes["_id"], "colors.primary": [c[0] for c in colors], "colors.secondary": [
                             c[1] for c in colors], "colors.tertiary": [c[2] for c in colors]})
    df_outfit_shoes = df_outfit_shoes.merge(
        df_colors, how="right", on="_id")

    df_temp = df_outfit_shoes[[
        "_id", "category", "subcategories", "brand", "material", "pattern", "colors.primary", "colors.secondary", "colors.tertiary"]]
    df_temp = pd.concat([df_temp, shoes], ignore_index=True)
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp, 1)
    color_n = len(desired_outfit.iloc[0]["legs"][0]["colors"].keys())
    df_score = df_temp[["_id"]]
    df_cat = pd.DataFrame(
        {"_id": df_temp["_id"], "category": category_sim[0]})
    df_subcat = pd.DataFrame(
        {"_id": df_temp["_id"], "subcategories": subcategory_sim[0]})
    df_meta = pd.DataFrame(
        {"_id": df_temp["_id"], "metadata": metadata_sim[0]})
    df_colors = pd.DataFrame(
        {"_id": df_temp["_id"], "primary": color_sim_primary[0], "secondary": color_sim_secondary[0], "tertiary": color_sim_tertiary[0]})

    df_score = df_score.merge(df_cat, how="right", on="_id").drop_duplicates()
    df_score = df_score.merge(df_subcat, how="right",
                              on="_id").drop_duplicates()
    df_score = df_score.merge(df_meta, how="right", on="_id").drop_duplicates()
    df_score = df_score.merge(df_colors, how="right",
                              on="_id").drop_duplicates()

    df_score["colors"] = (df_score["primary"] +
                          (df_score["secondary"] if color_n > 1 else 0) +
                          (df_score["tertiary"] if color_n > 2 else 0)) / color_n
    df_score["score"] = df_score["category"] + \
        (df_score["category"] * df_score["subcategories"]) + \
        df_score["metadata"] + df_score["colors"]
    df_score = df_score.sort_values(by="score", ascending=False)
    return df_score[["_id", "score"]]


def score_accessories(accessories: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_accessories = desired_outfit.drop(
        ['torso', 'feet', 'legs', "user", "_id", "__v"], axis=1)
    if ("name" in df_outfit_accessories.columns.values):
        df_outfit_accessories = df_outfit_accessories.drop(['name'], axis=1)
    if ("styles" in df_outfit_accessories.columns.values):
        df_outfit_accessories = df_outfit_accessories.drop(['styles'], axis=1)
    if ("imageName" in df_outfit_accessories.columns.values):
        df_outfit_accessories = df_outfit_accessories.drop(
            ['imageName'], axis=1)
    slots = {}
    agg = None
    for label, column in df_outfit_accessories.items():
        if (len(column[0]) > 0):
            slots[label] = len(column[0])
            temp = pd.DataFrame.from_dict(column[0])
            temp["slot"] = label
            try:
                if (agg == None):
                    agg = temp
                else:
                    agg = pd.concat([agg, temp])
            except:
                agg = pd.concat([agg, temp])
    df_outfit_accessories = agg
    df_outfit_accessories = df_outfit_accessories.drop("__v", axis=1)
    num_accessories = len(df_outfit_accessories.index)
    df_outfit_accessories = pd.DataFrame(create_accessory(row.to_dict())
                                         for index, row in df_outfit_accessories.iterrows())
    colors = []

    for index, value in df_outfit_accessories["colors"].items():
        if value == None:
            colors.append(
                [[None, None, None], [None, None, None], [None, None, None]])
        else:
            primary = [None, None, None] if "primary" not in value.keys(
            ) else color_code_to_rgb(value["primary"])
            secondary = [None, None, None] if "secondary" not in value.keys(
            ) else color_code_to_rgb(value["secondary"])
            tertiary = [None, None, None] if "tertiary" not in value.keys(
            ) else color_code_to_rgb(value["tertiary"])
            color = (primary, secondary, tertiary)
            colors.append(color)
    df_colors = pd.DataFrame({"_id": df_outfit_accessories["_id"], "colors.primary": [c[0] for c in colors], "colors.secondary": [
                             c[1] for c in colors], "colors.tertiary": [c[2] for c in colors]})

    df_outfit_accessories = df_outfit_accessories.merge(
        df_colors, how="right", on="_id")

    df_temp = df_outfit_accessories[["_id", "category", "subcategories", "brand", "material",
                                     "pattern", "colors.primary", "colors.secondary", "colors.tertiary"]]
    df_temp = pd.concat([df_temp, accessories], ignore_index=True)
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp, num_accessories)

    scores = {}
    for index, row in df_outfit_accessories.iterrows():
        slot = row.to_dict()["slot"]
        color_n = len(row.to_dict()["colors"].keys())
        df_score = df_temp[["_id"]]
        df_cat = pd.DataFrame(
            {"_id": df_temp["_id"], "category": category_sim[index]})
        df_subcat = pd.DataFrame(
            {"_id": df_temp["_id"], "subcategories": subcategory_sim[index]})
        df_meta = pd.DataFrame(
            {"_id": df_temp["_id"], "metadata": metadata_sim[index]})
        df_colors = pd.DataFrame({"_id": df_temp["_id"], "primary": color_sim_primary[index],
                                 "secondary": color_sim_secondary[index], "tertiary": color_sim_tertiary[index]})
        df_score = df_score.merge(
            df_cat, how="right", on="_id").drop_duplicates()
        df_score = df_score.merge(
            df_subcat, how="right", on="_id").drop_duplicates()
        df_score = df_score.merge(
            df_meta, how="right", on="_id").drop_duplicates()
        df_score = df_score.merge(
            df_colors, how="right", on="_id").drop_duplicates()
        df_score["colors"] = (df_score["primary"] +
                              (df_score["secondary"] if color_n > 1 else 0) +
                              (df_score["tertiary"] if color_n > 2 else 0)) / color_n
        df_score["score"] = df_score["category"] + \
            (df_score["category"] * df_score["subcategories"]) + \
            df_score["metadata"] + df_score["colors"]
        df_score = df_score.sort_values(by="score", ascending=False)
        if (slot not in scores):
            scores[slot] = [df_score[["_id", "score"]]]
        else:
            scores[slot].append(df_score[["_id", "score"]])
    return scores


def score_one_pieces(one_pieces: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_one_pieces = desired_outfit[["feet"]].iloc[0]["feet"]
    df_outfit_one_pieces = pd.DataFrame(df_outfit_one_pieces)
    df_outfit_one_pieces = pd.DataFrame(create_shoe(row.to_dict())
                                        for index, row in df_outfit_one_pieces.iterrows())
    colors = []
    for index, value in df_outfit_one_pieces["colors"].items():
        if value == None:
            colors.append(
                [[None, None, None], [None, None, None], [None, None, None]])
        else:
            primary = [None, None, None] if "primary" not in value.keys(
            ) else color_code_to_rgb(value["primary"])
            secondary = [None, None, None] if "secondary" not in value.keys(
            ) else color_code_to_rgb(value["secondary"])
            tertiary = [None, None, None] if "tertiary" not in value.keys(
            ) else color_code_to_rgb(value["tertiary"])
            color = (primary, secondary, tertiary)
            colors.append(color)
    df_colors = pd.DataFrame({"_id": df_outfit_one_pieces["_id"], "colors.primary": [c[0] for c in colors], "colors.secondary": [
                             c[1] for c in colors], "colors.tertiary": [c[2] for c in colors]})
    df_outfit_one_pieces = df_outfit_one_pieces.merge(
        df_colors, how="right", on="_id")

    df_temp = df_outfit_one_pieces[[
        "_id", "category", "subcategories", "brand", "material", "pattern", "colors.primary", "colors.secondary", "colors.tertiary"]]
    df_temp = pd.concat([df_temp, one_pieces], ignore_index=True)
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp, 1)
    color_n = len(desired_outfit.iloc[0]["legs"][0]["colors"].keys())
    df_score = df_temp[["_id"]]
    df_cat = pd.DataFrame(
        {"_id": df_temp["_id"], "category": category_sim[0]})
    df_subcat = pd.DataFrame(
        {"_id": df_temp["_id"], "subcategories": subcategory_sim[0]})
    df_meta = pd.DataFrame(
        {"_id": df_temp["_id"], "metadata": metadata_sim[0]})
    df_colors = pd.DataFrame(
        {"_id": df_temp["_id"], "primary": color_sim_primary[0], "secondary": color_sim_secondary[0], "tertiary": color_sim_tertiary[0]})

    df_score = df_score.merge(df_cat, how="right", on="_id").drop_duplicates()
    df_score = df_score.merge(df_subcat, how="right",
                              on="_id").drop_duplicates()
    df_score = df_score.merge(df_meta, how="right", on="_id").drop_duplicates()
    df_score = df_score.merge(df_colors, how="right",
                              on="_id").drop_duplicates()

    df_score["colors"] = (df_score["primary"] +
                          (df_score["secondary"] if color_n > 1 else 0) +
                          (df_score["tertiary"] if color_n > 2 else 0)) / color_n
    df_score["score"] = df_score["category"] + \
        (df_score["category"] * df_score["subcategories"]) + \
        df_score["metadata"] + df_score["colors"]
    df_score = df_score.sort_values(by="score", ascending=False)
    return df_score[["_id", "score"]]


def outfit_permutations(options: dict):
    # Tops
    top_permutations = list(itertools.product(*options["tops"]))
    top_scores = []
    for i, t in enumerate(top_permutations):
        ids = [top[0] for top in t]
        if (len(set(ids)) != len(ids)):
            continue
        avg_score = sum([j[1] for j in t]) / len(t)
        top_scores.append((i, avg_score))
    sorted_top_scores = sorted(top_scores, key=lambda x: x[1], reverse=True)
    sorted_top_scores = sorted_top_scores[:10]
    best_tops = []
    for i, score in sorted_top_scores:
        ids = [t[0] for t in top_permutations[i]]
        best_tops.append((ids, score))

    # Accessories
    accessory_slot_permutations = {}
    accessory_scores = {}
    best_accessories = {}
    for slot in options["accessories"].keys():
        accessory_slot_permutations[slot] = list(
            itertools.product(*options["accessories"][slot]))
        accessory_scores[slot] = []
        for i, a in enumerate(accessory_slot_permutations[slot]):
            ids = [accessory[0] for accessory in a]
            if (len(set(ids)) != len(ids)):
                continue
            avg_score = sum([j[1] for j in a]) / len(a)
            accessory_scores[slot].append((i, avg_score))
        sorted_accessory_scores = sorted(
            accessory_scores[slot], key=lambda x: x[1], reverse=True)
        sorted_accessory_scores = sorted_accessory_scores[:10]
        best_accessories[slot] = []
        for i, score in sorted_accessory_scores:
            ids = [t[0] for t in accessory_slot_permutations[slot][i]]
            best_accessories[slot].append((ids, score))

    outfits = []
    scores = []
    best_outfits_product = []
    if (options["one_pieces"] != None):
        best_outfits_product = list(itertools.product(
            best_tops, options["one_pieces"], options["shoes"], best_accessories))
        for i, (top, one_piece, shoes, accessories) in enumerate(best_outfits_product):
            score = sum([score for id, score in [
                        top, one_piece, shoes, accessories]]) / 4
            scores.append((i, score))
        sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
        best_outfits = [best_outfits_product[i]
                        for (i, score) in sorted_scores[:10]]
        for (top, one_piece, shoes, accessories) in best_outfits:
            outfits.append({
                "tops": top[0],
                "one_piece": one_piece[0],
                "shoes": shoes[0],
                "accessories": accessories[0],
            })
    else:
        best_outfits_product = list(itertools.product(
            best_tops, options["bottoms"], options["shoes"], *(best_accessories[slot] for slot in best_accessories.keys())))
        for i, (top, bottom, shoes, *accessories) in enumerate(best_outfits_product):
            s = top[1] + bottom[1] + shoes[1]
            for a in accessories:
                s += a[1]
            score = s / (3 + len(accessories))
            scores.append((i, score))
        sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
        best_outfits = [best_outfits_product[i]
                        for (i, score) in sorted_scores[1:11]]
        for (top, bottom, shoes, *accessories) in best_outfits:
            outfit_dict = {
                "tops": top[0],
                "bottoms": bottom[0],
                "shoes": shoes[0]
            }
            for i, a in enumerate(accessories):
                slot = list(best_accessories.keys())[i]
                outfit_dict[slot] = a[0]
            outfits.append(outfit_dict)
    # 215349842231 <- my dog typed this while I was afk so I'm gonna leave it
    return outfits


def main(args):
    outfit_dict = json.loads(args["desired_outfit"])
    tops_dict = json.loads(args["tops"])
    bottoms_dict = json.loads(args["bottoms"])
    shoes_dict = json.loads(args["shoes"])
    accessories_dict = json.loads(args["accessories"])
    one_pieces_dict = json.loads(args["one_pieces"])

    outfits = pd.json_normalize(outfit_dict)
    tops = pd.json_normalize(tops_dict)
    bottoms = pd.json_normalize(bottoms_dict)
    accessories = pd.json_normalize(shoes_dict)
    shoes = pd.json_normalize(accessories_dict)
    one_pieces = pd.json_normalize(one_pieces_dict)
    # Find outfit and remove it from the list
    desired_outfit_id = outfit_dict["_id"]
    desired_outfit_index = outfits[outfits._id == desired_outfit_id].index
    desired_outfit = outfits.loc[desired_outfit_index]
    outfits = outfits.drop(desired_outfit_index)

    options = {
        "tops": [],
        "bottoms": None,
        "shoes": None,
        "accessories": {},
        "one_pieces": None,
    }

    # Score all tops against desired outfit
    tops_scores = score_tops(tops, desired_outfit)
    num_tops = len(tops_scores)
    for i, scores in enumerate(tops_scores):
        top_ten = list(zip(scores.head(10)["_id"].to_list(),
                           scores.head(10)["score"].to_list()))
        options["tops"].append(top_ten)

    # Score all bottoms against desired outfit
    if (not pd.isna(desired_outfit.loc[0].to_dict()["legs"])):
        bottoms_scores = score_bottoms(bottoms, desired_outfit)
        options["bottoms"] = list(zip(bottoms_scores.head(
            10)["_id"].to_list(), bottoms_scores.head(10)["score"].to_list()))

    # Score all one_pieces against desired outfit
    if ("one_piece" in desired_outfit.loc[0].to_dict().keys() and not pd.isna(desired_outfit.loc[0].to_dict()["one_piece"])):
        one_pieces_scores = score_one_pieces(one_pieces, desired_outfit)
        options["one_pieces"] = list(zip(one_pieces_scores.head(
            10)["_id"].to_list(), one_pieces_scores.head(10)["score"].to_list()))

    # Score all shoes against desired outfit
    shoes_scores = score_shoes(shoes, desired_outfit)
    options["shoes"] = list(zip(shoes_scores.head(
        10)["_id"].to_list(), shoes_scores.head(10)["score"].to_list()))

    # Score all accessories against desired outfit
    accessories_scores = score_accessories(accessories, desired_outfit)
    num_slots = len(accessories_scores.keys())
    for (slot, scores) in accessories_scores.items():
        for item_scores in scores:
            top_ten = list(
                zip(item_scores.head(5)["_id"].to_list(), item_scores.head(5)["score"].to_list()))
            if slot not in options["accessories"].keys():
                options["accessories"][slot] = [top_ten]
            else:
                options["accessories"][slot].append(top_ten)

    best_outfit_ids = outfit_permutations(options)
    best_outfits_propogated = []
    desired_outfit_dict = desired_outfit.loc[0].to_dict()
    desired_outfit_dict["_id"] = 0
    del_keys = []
    for key, value in desired_outfit_dict.items():
        if (value != value):
            del_keys.append(key)
    for key in del_keys:
        del desired_outfit_dict[key]
    best_outfits_propogated.append(desired_outfit_dict)

    json_out = json.dumps(best_outfit_ids, ensure_ascii=False)
    print(json_out)


if __name__ == "__main__":
    args = {}
    args["desired_outfit"] = input("desired_outfit")
    args["tops"] = input("tops")
    args["bottoms"] = input("bottoms")
    args["shoes"] = input("shoes")
    args["accessories"] = input("accessories")
    args["one_pieces"] = input("one_pieces")
    main(args)

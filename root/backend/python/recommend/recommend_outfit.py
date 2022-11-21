import sys
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
    ("id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict),
    ("fit", str)])

Bottom = make_dataclass("Bottom", [
    ("id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict),
    ("fit", str)])

Accessory = make_dataclass("Accessory", [
    ("id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict)])

Shoe = make_dataclass("Shoes", [
    ("id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict)])

OnePiece = make_dataclass("OnePiece", [
    ("id", int),
    ("category", str),
    ("brand", str),
    ("pattern", str),
    ("material", str),
    ("subcategories", list),
    ("colors", dict)])

Outfit = make_dataclass("Outfit", [
    ("id", int),
    ("tops", list),
    ("bottoms", Bottom),
    ("shoes", str),
    ("accessories", list),
    ("one_piece", OnePiece)])


def create_top(content):
    if (type(content) != dict):
        return Top(None, None, None, None, None, None, None, None)
    return Top(content["id"],
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
    return Bottom(content["id"],
                  content["category"],
                  content["brand"],
                  content["pattern"],
                  content["material"],
                  content["subcategories"],
                  content["colors"],
                  content["fit"])


def create_accessory(content):
    if (type(content) != dict):
        return Accessory(None, None, None, None, None, None, None)
    return Accessory(content["id"],
                     content["category"],
                     content["brand"],
                     content["pattern"],
                     content["material"],
                     content["subcategories"],
                     content["colors"])


def create_shoe(content):
    if (type(content) != dict):
        return Shoe(None, None, None, None, None, None, None)
    return Shoe(content["id"],
                content["category"],
                content["brand"],
                content["pattern"],
                content["material"],
                content["subcategories"],
                content["colors"])


def create_one_piece(content):
    if (type(content) != dict):
        return OnePiece(None, None, None, None, None, None, None)
    return OnePiece(content["id"],
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


def score_colors(data: pd.DataFrame):
    colors = []
    for index, value in data["colors"].items():
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
    df_colors = pd.DataFrame({"id": data["id"], "primary": [c[0] for c in colors], "secondary": [
                             c[1] for c in colors], "tertiary": [c[2] for c in colors]})

    scaler = MinMaxScaler()
    inverse = np.vectorize(lambda x: 0 if x != x else 1-x, otypes=[object])

    color_sim_primary = nan_euclidean_distances(
        df_colors["primary"].to_list(), df_colors["primary"].to_list())
    color_sim_secondary = nan_euclidean_distances(
        df_colors["secondary"].to_list(), df_colors["secondary"].to_list())
    color_sim_tertiary = nan_euclidean_distances(
        df_colors["tertiary"].to_list(), df_colors["tertiary"].to_list())

    return scaler.fit_transform(inverse(color_sim_primary)), scaler.fit_transform(inverse(color_sim_secondary)), scaler.fit_transform(inverse(color_sim_tertiary))


def score_tops(tops: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_tops = desired_outfit[["tops"]].explode("tops")
    num_tops = len(df_outfit_tops.index)
    df_outfit_tops = pd.DataFrame(create_top(content)
                                  for index, row in df_outfit_tops.iterrows() for _, content in row.items())
    df_temp = df_outfit_tops[[
        "id", "category", "subcategories", "brand", "material", "pattern", "colors", "fit"]]
    df_temp = pd.concat([df_temp, tops])
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp, fit=True)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp)

    scores = []

    for index, row in df_outfit_tops.iterrows():
        color_n = len(row.to_dict()["colors"].keys())
        df_score = df_temp[["id"]]
        df_cat = pd.DataFrame(
            {"id": df_temp["id"], "category": category_sim[index]})
        df_subcat = pd.DataFrame(
            {"id": df_temp["id"], "subcategories": subcategory_sim[index]})
        df_meta = pd.DataFrame(
            {"id": df_temp["id"], "metadata": metadata_sim[index]})
        df_colors = pd.DataFrame(
            {"id": df_temp["id"], "primary": color_sim_primary[index], "secondary": color_sim_secondary[index], "tertiary": color_sim_tertiary[index]})
        df_score = df_score.merge(df_cat, how="right", on="id").merge(df_subcat, how="right", on="id").merge(
            df_meta, how="right", on="id").merge(df_colors, how="right", on="id")
        df_score["colors"] = df_score["primary"] + \
            df_score["secondary"] if color_n > 1 else 0 + \
            df_score["tertiary"] if color_n > 2 else 0
        df_score["score"] = df_score["category"] + \
            (df_score["category"] * df_score["subcategories"]) + \
            df_score["metadata"] + df_score["colors"]
        df_score.drop(index=df_score.index[:num_tops], axis=0, inplace=True)
        df_score = df_score.sort_values(by="score", ascending=False)
        scores.append(df_score[["id", "score"]])
    return scores


def score_bottoms(bottoms: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_bottoms = desired_outfit[["bottoms"]]
    df_outfit_bottoms = pd.DataFrame(create_bottom(content)
                                     for index, row in df_outfit_bottoms.iterrows() for _, content in row.items())
    df_temp = df_outfit_bottoms[[
        "id", "category", "subcategories", "brand", "material", "pattern", "colors", "fit"]]
    df_temp = pd.concat([df_temp, bottoms])
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp, fit=True)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp)

    row = df_temp.iloc[0]
    color_n = len(row.to_dict()["colors"].keys())
    df_score = df_temp[["id"]]
    df_cat = pd.DataFrame(
        {"id": df_temp["id"], "category": category_sim[0]})
    df_subcat = pd.DataFrame(
        {"id": df_temp["id"], "subcategories": subcategory_sim[0]})
    df_meta = pd.DataFrame(
        {"id": df_temp["id"], "metadata": metadata_sim[0]})
    df_colors = pd.DataFrame(
        {"id": df_temp["id"], "primary": color_sim_primary[0], "secondary": color_sim_secondary[0], "tertiary": color_sim_tertiary[0]})
    df_score = df_score.merge(df_cat, how="right", on="id").merge(df_subcat, how="right", on="id").merge(
        df_meta, how="right", on="id").merge(df_colors, how="right", on="id")
    df_score["colors"] = df_score["primary"] + \
        df_score["secondary"] if color_n > 1 else 0 + \
        df_score["tertiary"] if color_n > 2 else 0
    df_score["score"] = df_score["category"] + \
        (df_score["category"] * df_score["subcategories"]) + \
        df_score["metadata"] + df_score["colors"]
    df_score.drop(index=df_score.index[:1], axis=0, inplace=True)
    df_score = df_score.sort_values(by="score", ascending=False)
    return df_score[["id", "score"]]


def score_shoes(shoes: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_shoes = desired_outfit[["shoes"]]
    df_outfit_shoes = pd.DataFrame(create_shoe(content)
                                   for index, row in df_outfit_shoes.iterrows() for _, content in row.items())
    df_temp = df_outfit_shoes[[
        "id", "category", "subcategories", "brand", "material", "pattern", "colors"]]
    df_temp = pd.concat([df_temp, shoes])
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp)

    row = df_temp.iloc[0]
    color_n = len(row.to_dict()["colors"].keys())
    df_score = df_temp[["id"]]
    df_cat = pd.DataFrame(
        {"id": df_temp["id"], "category": category_sim[0]})
    df_subcat = pd.DataFrame(
        {"id": df_temp["id"], "subcategories": subcategory_sim[0]})
    df_meta = pd.DataFrame(
        {"id": df_temp["id"], "metadata": metadata_sim[0]})
    df_colors = pd.DataFrame(
        {"id": df_temp["id"], "primary": color_sim_primary[0], "secondary": color_sim_secondary[0], "tertiary": color_sim_tertiary[0]})
    df_score = df_score.merge(df_cat, how="right", on="id").merge(df_subcat, how="right", on="id").merge(
        df_meta, how="right", on="id").merge(df_colors, how="right", on="id")
    df_score["colors"] = df_score["primary"] + \
        df_score["secondary"] if color_n > 1 else 0 + \
        df_score["tertiary"] if color_n > 2 else 0
    df_score["score"] = df_score["category"] + \
        (df_score["category"] * df_score["subcategories"]) + \
        df_score["metadata"] + df_score["colors"]
    df_score.drop(index=df_score.index[:1], axis=0, inplace=True)
    df_score = df_score.sort_values(by="score", ascending=False)
    return df_score[["id", "score"]]


def score_accessories(accessories: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_accessories = desired_outfit[[
        "accessories"]].explode("accessories")
    num_accessories = len(df_outfit_accessories.index)
    df_outfit_accessories = pd.DataFrame(create_accessory(content)
                                         for index, row in df_outfit_accessories.iterrows() for _, content in row.items())
    df_temp = df_outfit_accessories[[
        "id", "category", "subcategories", "brand", "material", "pattern", "colors"]]
    df_temp = pd.concat([df_temp, accessories])
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp)

    scores = []

    for index, row in df_outfit_accessories.iterrows():
        color_n = len(row.to_dict()["colors"].keys())
        df_score = df_temp[["id"]]
        df_cat = pd.DataFrame(
            {"id": df_temp["id"], "category": category_sim[index]})
        df_subcat = pd.DataFrame(
            {"id": df_temp["id"], "subcategories": subcategory_sim[index]})
        df_meta = pd.DataFrame(
            {"id": df_temp["id"], "metadata": metadata_sim[index]})
        df_colors = pd.DataFrame(
            {"id": df_temp["id"], "primary": color_sim_primary[index], "secondary": color_sim_secondary[index], "tertiary": color_sim_tertiary[index]})
        df_score = df_score.merge(df_cat, how="right", on="id").merge(df_subcat, how="right", on="id").merge(
            df_meta, how="right", on="id").merge(df_colors, how="right", on="id")
        df_score["colors"] = df_score["primary"] + \
            df_score["secondary"] if color_n > 1 else 0 + \
            df_score["tertiary"] if color_n > 2 else 0
        df_score["score"] = df_score["category"] + \
            (df_score["category"] * df_score["subcategories"]) + \
            df_score["metadata"] + df_score["colors"]
        df_score.drop(
            index=df_score.index[:num_accessories], axis=0, inplace=True)
        df_score = df_score.sort_values(by="score", ascending=False)
        scores.append(df_score[["id", "score"]])
    return scores


def score_one_pieces(one_pieces: pd.DataFrame, desired_outfit: pd.DataFrame):
    df_outfit_one_pieces = desired_outfit[["one_piece"]]
    df_outfit_one_pieces = pd.DataFrame(create_one_piece(content)
                                        for index, row in df_outfit_one_pieces.iterrows() for _, content in row.items())
    df_temp = df_outfit_one_pieces[[
        "id", "category", "subcategories", "brand", "material", "pattern", "colors"]]
    df_temp = pd.concat([df_temp, one_pieces])
    category_sim = score_category(df_temp)
    subcategory_sim = score_subcategories(df_temp)
    metadata_sim = score_metadata(df_temp)
    color_sim_primary, color_sim_secondary, color_sim_tertiary = score_colors(
        df_temp)

    row = df_temp.iloc[0]
    color_n = len(row.to_dict()["colors"].keys())
    df_score = df_temp[["id"]]
    df_cat = pd.DataFrame(
        {"id": df_temp["id"], "category": category_sim[0]})
    df_subcat = pd.DataFrame(
        {"id": df_temp["id"], "subcategories": subcategory_sim[0]})
    df_meta = pd.DataFrame(
        {"id": df_temp["id"], "metadata": metadata_sim[0]})
    df_colors = pd.DataFrame(
        {"id": df_temp["id"], "primary": color_sim_primary[0], "secondary": color_sim_secondary[0], "tertiary": color_sim_tertiary[0]})
    df_score = df_score.merge(df_cat, how="right", on="id").merge(df_subcat, how="right", on="id").merge(
        df_meta, how="right", on="id").merge(df_colors, how="right", on="id")
    df_score["colors"] = df_score["primary"] + \
        df_score["secondary"] if color_n > 1 else 0 + \
        df_score["tertiary"] if color_n > 2 else 0
    df_score["score"] = df_score["category"] + \
        (df_score["category"] * df_score["subcategories"]) + \
        df_score["metadata"] + df_score["colors"]
    df_score.drop(index=df_score.index[:1], axis=0, inplace=True)
    df_score = df_score.sort_values(by="score", ascending=False)
    return df_score[["id", "score"]]


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
    accessory_permutations = list(itertools.product(*options["accessories"]))
    accessory_scores = []
    for i, a in enumerate(accessory_permutations):
        ids = [accessory[0] for accessory in a]
        if (len(set(ids)) != len(ids)):
            continue
        avg_score = sum([j[1] for j in a]) / len(a)
        accessory_scores.append((i, avg_score))
    sorted_accessory_scores = sorted(
        accessory_scores, key=lambda x: x[1], reverse=True)
    sorted_accessory_scores = sorted_accessory_scores[:10]
    best_accessories = []
    for i, score in sorted_accessory_scores:
        ids = [t[0] for t in accessory_permutations[i]]
        best_accessories.append((ids, score))

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
            best_tops, options["bottoms"], options["shoes"], best_accessories))
        for i, (top, bottom, shoes, accessories) in enumerate(best_outfits_product):
            score = sum([score for id, score in [
                        top, bottom, shoes, accessories]]) / 4
            scores.append((i, score))
        sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
        best_outfits = [best_outfits_product[i]
                        for (i, score) in sorted_scores[:10]]
        for (top, bottom, shoes, accessories) in best_outfits:
            outfits.append({
                "tops": top[0],
                "bottoms": bottom[0],
                "shoes": shoes[0],
                "accessories": accessories[0],
            })
    # 215349842231 <- my dog typed this while I was afk so I'm gonna leave it
    return outfits


def main():
    outfits = pd.read_json("outfits.json").truncate(after=9)

    tops = pd.read_json("tops.json")
    bottoms = pd.read_json("bottoms.json")
    accessories = pd.read_json("accessories.json")
    shoes = pd.read_json("shoes.json")
    one_pieces = pd.read_json("one_pieces.json")

    # Find outfit and remove it from the list
    desired_outfit_id = 0
    desired_outfit_index = outfits[outfits.id == desired_outfit_id].index
    desired_outfit = outfits.loc[desired_outfit_index]
    outfits = outfits.drop(desired_outfit_index)

    options = {
        "tops": [],
        "bottoms": None,
        "shoes": None,
        "accessories": [],
        "one_pieces": None,
    }

    # Score all tops against desired outfit
    tops_scores = score_tops(tops, desired_outfit)
    num_tops = len(tops_scores)
    for i, scores in enumerate(tops_scores):
        top_ten = list(zip(scores.head(10)["id"].to_list(),
                           scores.head(10)["score"].to_list()))
        options["tops"].append(top_ten)

    # Score all bottoms against desired outfit
    if (not pd.isna(desired_outfit.loc[0].to_dict()["bottoms"])):
        bottoms_scores = score_bottoms(bottoms, desired_outfit)
        options["bottoms"] = list(zip(bottoms_scores.head(
            10)["id"].to_list(), bottoms_scores.head(10)["score"].to_list()))

    # Score all one_pieces against desired outfit
    if (not pd.isna(desired_outfit.loc[0].to_dict()["one_piece"])):
        one_pieces_scores = score_one_pieces(one_pieces, desired_outfit)
        options["one_pieces"] = list(zip(one_pieces_scores.head(
            10)["id"].to_list(), one_pieces_scores.head(10)["score"].to_list()))

    # Score all accessories against desired outfit
    accessories_scores = score_accessories(accessories, desired_outfit)
    num_accessories = len(accessories_scores)
    for i, scores in enumerate(accessories_scores):
        top_ten = list(zip(scores.head(5)["id"].to_list(),
                           scores.head(5)["score"].to_list()))
        options["accessories"].append(top_ten)

    # Score all shoes against desired outfit
    shoes_scores = score_shoes(shoes, desired_outfit)
    options["shoes"] = list(zip(shoes_scores.head(
        10)["id"].to_list(), shoes_scores.head(10)["score"].to_list()))

    best_outfit_ids = outfit_permutations(options)
    best_outfits_propogated = []
    desired_outfit_dict = desired_outfit.loc[0].to_dict()
    desired_outfit_dict["id"] = 0
    del_keys = []
    for key, value in desired_outfit_dict.items():
        if (value != value):
            del_keys.append(key)
    for key in del_keys:
        del desired_outfit_dict[key]
    best_outfits_propogated.append(desired_outfit_dict)
    for i, outfit in enumerate(best_outfit_ids):
        outfit_propogated = {
            "id": i + 1,
            "tops": [],
            "accessories": []
        }
        for top in outfit["tops"]:
            outfit_propogated["tops"].append(tops.loc[top].to_dict())
        for accessory in outfit["accessories"]:
            outfit_propogated["accessories"].append(
                accessories.loc[accessory].to_dict())
        if "bottoms" in outfit.keys():
            outfit_propogated["bottoms"] = bottoms.loc[outfit["bottoms"]].to_dict(
            )
        if "one_piece" in outfit.keys():
            outfit_propogated["one_piece"] = one_pieces.loc[outfit["one_piece"]].to_dict(
            )
        outfit_propogated["shoes"] = shoes.loc[outfit["shoes"]].to_dict()
        best_outfits_propogated.append(outfit_propogated)

    json_out = json.dumps(best_outfits_propogated,
                          indent=4, ensure_ascii=False)
    original_stout = sys.stdout
    with open("recommended_outfits.json", "w") as f:
        sys.stdout = f
        print(json_out)
        sys.stdout = original_stout


if __name__ == "__main__":
    main()

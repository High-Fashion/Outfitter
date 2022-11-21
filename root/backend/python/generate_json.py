import sys
import argparse
import json
from random import randint
from item_data import brands, patterns, materials, colors, categories


def get_random_brand():
    return brands[randint(0, len(brands) - 1)]


def get_random_colors():
    amount = randint(1, 3)
    color_list = []
    codes = [code for name, code in colors.items()]
    for i in range(amount):
        color_list.append(codes[randint(0, len(colors) - 1)])
    ret = {}

    for i in range(len(color_list)):
        if i == 0:
            ret["primary"] = color_list[i]
        elif i == 1:
            ret["secondary"] = color_list[i]
        elif i == 2:
            ret["tertiary"] = color_list[i]

    return ret


def get_random_pattern():
    return patterns[randint(0, len(patterns) - 1)]


def get_random_material():
    return materials[randint(0, len(materials) - 1)]


def get_random_category(categories):
    c = [item[0] for item in categories.items()]
    rand_index = randint(0, len(c)-1)
    ret = c[rand_index]
    return ret


def get_random_subcategories(categories, category):
    sc = categories.get(category)
    if len(sc) == 0:
        return []
    amount = randint(1, len(sc))
    return [*set(sc[randint(0, len(sc) - 1)] for x in range(amount))]


def get_random_item(item_type, item_id):
    cats = categories[item_type]
    category = get_random_category(cats)
    subcategories = get_random_subcategories(cats, category)
    ret = {
        "id": item_id,
        "type": item_type,
        "category": category,
        "subcategories": [] if subcategories == None else subcategories,
        "brand": get_random_brand(),
        "colors": get_random_colors(),
        "pattern": get_random_pattern(),
        "material": get_random_material(),
    }
    if item_type in ["top", "bottom"]:
        ret["fit"] = ["tight", "normal", "loose"][randint(0, 2)]
    return ret


def get_random_outfit(item_id):
    if (randint(0, 1) == 0):
        # top/bottom outfit
        return {
            "id": item_id,
            "user": randint(0, 10),
            "tops": [get_random_item("top", 200 + (10 * item_id) + j) for j in range(randint(1, 5))],
            "bottoms": get_random_item("bottom", 200 + (10 * item_id) + 1),
            "shoes": get_random_item("shoe", 200 + (10 * item_id) + 1),
            "accessories": [get_random_item("accessory", 200 + (10 * item_id) + j) for j in range(randint(0, 10))],
        }
    else:
        # one_piece outfit
        return {
            "id": item_id,
            "user": randint(0, 10),
            "tops": [get_random_item("top", 200 + (10 * item_id) + j) for j in range(randint(0, 5))],
            "one_piece": get_random_item("one_piece", 200 + (10 * item_id) + 1),
            "shoes": get_random_item("shoe", 200 + (10 * item_id) + 1),
            "accessories": [get_random_item("accessory", 200 + (10 * item_id) + j) for j in range(randint(0, 10))],
        }


def main(args):
    num_items = args.num_items
    item_type = args.item_type
    output_file = args.output_file
    if output_file == None:
        output_file = ((item_type + "s") if (item_type !=
                       "accessory") else "accessories") + ".json"

    print("Generating {} items of type {}...".format(num_items, item_type))
    original_stout = sys.stdout
    if item_type != "outfit":
        data = [get_random_item(item_type, i) for i in range(num_items)]
    else:
        data = [get_random_outfit(i) for i in range(num_items)]
    json_out = json.dumps(data, indent=4, ensure_ascii=False)
    with open(output_file, "w") as f:
        sys.stdout = f
        print(json_out)
        sys.stdout = original_stout
    print("Output saved to {}".format(output_file))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate items in a json file")
    parser.add_argument("-i", "--item_type", required=True, choices=[
                        "shoe", "top", "bottom", "one_piece", "accessory", "outfit"], help="The type of items you would like to generate")
    parser.add_argument("-n", "--num_items", type=int, default=100,
                        help="The number of items you would like to generate. Defaults to 100")
    parser.add_argument("-o", "--output_file",
                        help="The path of the output json file. Defaults to '<item_type>s.json'")
    args = parser.parse_args()
    main(args)

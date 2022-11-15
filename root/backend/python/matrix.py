items = [{id: 1},{id: 2},{id: 3},{id: 4},{id: 5}]

hashmap = {
    "0": {},
    "1": {},
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "7": {},
}
ratings = [
    {
        "outfit": [0, 1, 3],
        "rating": 5
    },
        {
        "outfit": [0, 1, 4],
        "rating": 4
    },
            {
        "outfit": [0, 1, 5],
        "rating": 1
    },
            {
        "outfit": [0, 1, 6],
        "rating": 5
    },
            {
        "outfit": [0, 1, 7],
        "rating": 5
    },
        {
        "outfit": [0, 2, 3],
        "rating": 5
    },
        {
        "outfit": [0, 2, 4],
        "rating": 5
    },
            {
        "outfit": [0, 2, 5],
        "rating": 5
    }

]

matrix = [[[] for i in range(len(hashmap))] for j in range(len(hashmap))]

for r in ratings:
    for item in r["outfit"]:
        for other in [x for x in r["outfit"] if x != item]:
            matrix[item][other].append(r["rating"])

for i in matrix:
    for j in i:
        avg = None if len(j) == 0 else sum(j) / len(j)
        print("{}".format(avg).rjust(4)[:4], end=" ")
    print("\n")
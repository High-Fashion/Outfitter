# Outfitter

Outfitter is a cross-platform mobile application designed for iOS and Android using Expo, React Native, and the Native Base UI framework.

The goal of the application is to allow users to create an inventory of their clothing, shoes, and accessories. Using these items, users may create outfits. Users may also post these items as well as outfits to their profile to share with other users on the platform. 

Users may also generate outfits using machine learning. This function is a proof of concept but can be greatly expanded on. In its current state, a user can choose an outfit that they like, whether that be one of their own or one posted by another user, and generate a similar outfit using items from their own wardrobe. In the future, we wish to expand on this feature by automatically generating similar outfits based on the posts users like and the outfits they create. We would also like to implement specific functionality for the occasion, style, and community receptiveness.

The backend server uses the Express Node.js web application framework and a MongoDB database. The server also uses python for machine-learning purposes. The python libraries used include pandas and sklearnkit.

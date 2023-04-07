# comics collection app

## Description

My project is a collection tracker for comic books published by Marvel. Users will be able to search for various issues across all Marvel series and add them as owned or wanted. This is inspired by an issue from my own life: I've got a box with a ton of unorganized issues in my closet and have given up on figuring out which ones I have (I have duplicates of a few!) and which ones I'd like to buy to fill in the gaps.

Beyond my own disorganization, Marvel has frequently ended series and started new series with the same characters over the last few years, making it extremely frustrating to keep tabs on where your favorite characters are showing up. My project seeks to leverage Marvel's own API as the source of authority for which titles are relevant for a specific character, making it much easier to pin down which titles you need to keep up with.

Ultimately, you'll be able to use my app to search for a character and get results (comic book series and/or individual issues) to be sure your collection can be comprehensive.

## API used

I'll be using the Marvel comics API. Example query: `https://gateway.marvel.com:443/v1/public/characters/1009610?ts=${timeStamp}&apikey=${pubKey}&hash=${hashedPayload}` will return information about Spider-Man.

## ERDs

![ERD](ERD2.png)

# RESTful Route Chart

| VERB   | URL                   | CRUD    | DESCRIPTION                                                          | VIEW        |
| :----- | :-------------------- | :------ | :------------------------------------------------------------------- | :---------- |
| GET    | /                     | Read    | Home View                                                            | Home        |
|        |                       |         |                                                                      |             |
| POST   | /users                | Create  | Add user data to db                                                  |             |
| GET    | /users/new            | Read    | Display signup form                                                  | Signup Form |
| GET    | /users/login          | Read    | Display login form                                                   | Login Form  |
| POST   | /users/login          | Read    | Checks user credentials against db                                   |             |
| GET    | /users/logout         | Read    | Logout user by clearing cookies                                      |             |
| GET    | /users/profile        | Read    | Display user data                                                    | Profile     |
| PUT    | /users/:id/           | Update  | Change user password                                                 |             |
|        |                       |         |                                                                      |             |
| GET    | /comics               | Read    | Main view of comics page with search                                 |             |
| GET    | /comics/favorites     | Read    | List of currently logged in user's favorite comics                   |             |
| POST   | /comics/:id/favorites | Create  | Adds selected comic to currently logged in user's favorites          |             |
| DELETE | /comics/:id/favorites | Destroy | Removes selected comic from currently logged in user's favorites     |             |
| GET    | /comics/wanted        | Read    | List of currently logged in user's wanted comics                     |             |
| POST   | /comics/:id/wanted    | Create  | Adds selected comic to currently logged in user's wanted comics      |             |
| DELETE | /comics/:id/wanted    | Destroy | Removes selected comic from currently logged in user's wanted comics |             |

## Installation Instructions

- Fork/clone the repo
- Run `npm i`
- Run `npm i dotenv` (not required in production environment, but will be needed for a local deployment)
- Create a .env file in your repo and add it to your .gitignore; store your public and private Marvel API keys here with variable names PUB_KEY and PRIV_KEY

## User Stories

- _As a collector, I want to mark comics as 'owned' so that I can track what's in my collection._
- _As a collector, I want to add comics to a wishlist so that I can see which ones I'm missing._
- _As an app user, I want to search for characters so that I can learn about new heroes and villains in the Marvel universe._

## MVP Goals

- User can create and delete account.
- User can change password.
- User can search for comics and add them to a list of favorite comics.
- User can search for comics and add them to a list of wanted comics.

## Stretch Goals

- User can search for characters and add them to a list of favorite characters.
- User can click on a search result (comic, character, etc) to navigate to a page where more comprehensive information about that individual item is displayed (character: first appearance, list of relevant series, etc).
- Include more robust search criteria to allow the user to benefit from the comprehensive information available via API query.

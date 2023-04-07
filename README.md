# comics collection app

## Description

WIP

## API used

I'll be using the Marvel comics API. Example query: `https://gateway.marvel.com:443/v1/public/characters/1009610?ts=${timeStamp}&apikey=${pubKey}&hash=${hashedPayload}` will return information about Spider-Man.

## ERDs

![ERD](ERD.png)

## RESTful Route Chart

| VERB   | URL                   | CRUD    | DESCRIPTION                                                          | VIEW        |
| :----- | :-------------------- | :------ | :------------------------------------------------------------------- | :---------- |
| GET    | /                     | Read    | Home View                                                            | Home        |
| POST   | /users                | Create  | Add user data to db                                                  |             |
| GET    | /users/new            | Read    | Display signup form                                                  | Signup Form |
| GET    | /users/login          | Read    | Display login form                                                   | Login Form  |
| POST   | /users/login          | Read    | Checks user credentials against db                                   |             |
| GET    | /users/logout         | Read    | Logout user by clearing cookies                                      |             |
| GET    | /users/profile        | Read    | Display user data                                                    | Profile     |
| PUT    | /users/:id/           | Update  | Change user password                                                 |             |
| GET    | /characters           | Read    | Main view of characters page with search                             |             |
| GET    | /characters/favorites | Read    | List of currently logged in user's favorite characters               |             |
| POST   | /characters/:id       | Create  | Adds selected character to currently logged in user's favorites      |             |
| DELETE | /characters/:id       | Destroy | Removes selected character from currently logged in user's favorites |             |
| GET    | /comics               | Read    | Main view of comics page with search                                 |             |
| GET    | /comics/favorites     | Read    | List of currently logged in user's favorite comics                   |             |
| POST   | /comics/:id           | Create  | Adds selected comic to currently logged in user's favorites          |             |
| DELETE | /comics/:id           | Destroy | Removes selected comic from currently logged in user's favorites     |             |

## User stories

- _As a collector, I want to mark comics as 'owned' so that I can track what's in my collection._
- _As a collector, I want to add comics to a wishlist so that I can see which ones I'm missing._
- _As an app user, I want to search for characters so that I can learn about new heroes and villains in the Marvel universe._

## MVP Goals

- User can create and delete account.
- User can change password.
- User can search for comics and add them to a list of favorite comics.
- User can search for characters and add them to a list of favorite characters.

## Stretch Goals

- In addition to a list of favorite comics, user can build a wishlist of comics they want to get.
- User can click on a search result (comic, character, etc) to navigate to a page where more comprehensive information about that individual item is displayed (character: first appearance, list of relevant series, etc).
- Include more robust search criteria to allow the user to benefit from the comprehensive information available via API query.

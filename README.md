# nearmint.app

## Description

[Nearmint.app](https://nearmint.app) is a collection tracker for comic books published by Marvel. Users can search for by issues or by series: add issues to your collection or to your wish list; add series to your pull list and see a list of the most recent issues of titles you're pulling.

This project is inspired by an issue from my own life: I've got a box with a ton of unorganized issues in my closet and have given up on figuring out which ones I have (I have duplicates of a few!) and which ones I'd like to acquire to fill in the gaps.  Compounding the problem of my own disorganization is Marvel's proclivity for rebooting series over the last few years, making it extremely frustrating to keep tabs on where your favorite characters are showing up.

All of this considered, the goal for this project is to leverage Marvel's own API as the source of authority for which titles are relevant for a specific character, hopefully making it much easier to pin down which titles you need to keep up with.

Check out my collection [here!](https://nearmint.app/users/andrew/collection)

## Tech/resources used

- Node.js
- Express
- Sequelize
- Postgres
- Bulma
- Marvel API

## RESTful Route Chart

| VERB   | URL                           | CRUD    | DESCRIPTION                                                                                                  | VIEW                  |
|:------ |:----------------------------- |:------- |:------------------------------------------------------------------------------------------------------------ |:--------------------- |
| GET    | /                             | Read    | Home View                                                                                                    | Home                  |
| GET    | /users/new                    | Read    | Display signup form                                                                                          | Signup form           |
| GET    | /users/login                  | Read    | Display login form                                                                                           | Login form            |
| POST   | /users                        | Create  | Add user data to db                                                                                          | Home                  |
| POST   | /users/login                  | Read    | Checks user credentials against db                                                                           | Home                  |
| GET    | /users/logout                 | Read    | Logout user by clearing cookies                                                                              | Home                  |
| GET    | /users/:username/:destination | Read    | General-purpose route to retrieve resources for a specific user: profile, collection, wishlist, or pull list | Destination           |
| POST   | /users/:username/:destination | Create  | General-purpose route to create a resource for a specific user: profile, collection, wishlist, or pull list  | Current view          |
| PUT    | /users/:username/collection   | Update  | General-purpose route to move a specific user's existing DB item from wishlist to collection                 | Current view          |
| DELETE | /users/:username/collection   | Destroy | Remove an entity from collection                                                                             | Collection            |
| DELETE | /users/:username/wishlist     | Destroy | Remove an entity from wishlist                                                                               | Wishlist              |
| DELETE | /users/:username/pull_list    | Destroy | Remove an entity from pull_list                                                                              | Pull list             |
| GET    | /search/comics                | Read    | Search form for searching specific comics issues                                                             | Comic search form     |
| GET    | /search/comics/results        | Read    | Results of comic search                                                                                      | Comic search results  |
| GET    | /search/series                | Read    | Search form for searching by series                                                                          | Series search form    |
| GET    | /search/series/results        | Read    | Results of series search                                                                                     | Series search results |                                                                                    | Series search results |

## Installation Instructions

- Fork/clone the repo.
- Run `npm i`.
- You'll need to have Sequelize CLI tools installed for the next steps, so if you don't have that package installed already, run `npm i sequelize-cli`.  I recommend running this with the `-g` flag to install globally if there's any likelihood of you working with Sequelize on other projects going forward.
- You're also going to need a Sequelize user in your local PSQL instance for the subsequent steps to work.  In your PSQL shell, run these commands to create this user and give it admin privs:
```
CREATE USER sequelize WITH SUPERUSER PASSWORD 'sequelize';
ALTER USER sequelize WITH SUPERUSER;
```
- Run `sequelize db:create` to create the database nearmint_db in Postgres, then `sequelize db:migrate` to create your tables.
- Create a .env file in your repo and add it to your .gitignore; store your public and private Marvel API keys here with variable names `PUB_KEY` and `PRIV_KEY`.
- In your .env file, create an encryption key named `ENC_KEY` for managing cookies.

## Project Takeaways

Coming soon

## Upcoming Features

Coming soon

## Changelog

2023-04-16: added the ability for users to set their collection visibility to public\
2023-04-14: published!
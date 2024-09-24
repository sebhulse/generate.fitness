This app is based on the [T3 teck stack](https://create.t3.gg/en/introduction).

Initial installation steps:
- create `.env` file from the `.env.example` file (basically just copy and rename the file - the DATABASE_URL should be correct if you use docker-compose as described below)
- install docker
- run `docker compose up`
- run `yarn install && yarn prisma generate && yarn prisma db push && yarn db-seed` (installs packages, generates database schema, creates initial database tables from generated schema, and seeds the empty database with some initial data)
  
To run this project each time after the initial installation steps:
- ensure your mysql database is up (run `docker compose up`)
- open new terminal for each of these services:
    - run `yarn dev` (required for NEXTJS)
    - run `yarn mailing` (required for intercepting emails - mainly for email auth)
    - run `yarn prisma studio` (nice-to-have for browsing the database)

These steps will allow you to create/log into accounts via email. If you also want to log in via discord on your local machine, you'll need to [create a new application](https://create.t3.gg/en/usage/next-auth#setting-up-the-default-discordprovider) in the discord developer portal.

If you encounter any problems with installation/local machine setup, let me know by creating an issue!
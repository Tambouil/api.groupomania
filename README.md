
# Groupomania

Backend part of Groupomania. A fully featured social network, with posts, likes, comments, follow/unfollow, admin/user roles, profile page and users page. 


## Tech Stack

**Client:** Vite, React, TailwindCSS

**Server:** Node, AdonisJS, PostgreSQL


## Environment Variables

To run this project, you will need to copy and paste the .env.example content to your .env file and customize the following environment variables to connect your DB

`PG_USER`

`PG_PASSWORD`

`PG_DB_NAME`


## Installation

Install api.groupomania with pnpm

```bash
  git clone https://github.com/Tambouil/api.groupomania.git
  cd api.groupomania
  pnpm i
  pnpm dev
```

Launch PostgreSQL with docker

```bash
  docker compose up -d
```

Run migrations

```bash
  node ace migration:run
```

Optionnal : Create users and fake posts with seeders. This command will create an admin and 3 users with 2 posts for each users

```bash
  node ace db:seed
```

Optionnal : Reset DB and run seeeders

```bash
  node ace migration:fresh --seed
```


    

# Creating a table to store logs

Enter PostgreSQL from the container:

```sh
docker exec -it postgres_db psql -U devuser -d devdb
```

Create a table to store logs:
```sql
 CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    level VARCHAR(10) NOT NULL CHECK (level IN ('INFO', 'WARNING', 'ERROR')),
    created_at TIMESTAMP DEFAULT NOW()
);
```

Verify table creation:
```sql
\dt
```

To read the contents of the table:
```sh
docker exec -it postgres_db psql -U devuser -d devdb -c "SELECT * FROM logs;"
```

I had to initialize the go project before initializing the container from
> docker-compose up --build -d
```sh
go mod init backend
go mod tidy
```
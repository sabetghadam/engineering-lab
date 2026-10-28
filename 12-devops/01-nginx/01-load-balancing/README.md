# Nginx Load Balancing with Node.js, TypeScript, and PostgreSQL

A hands-on DevOps lab demonstrating how to configure Nginx as a reverse proxy and load balancer for multiple Node.js backend instances, integrate PostgreSQL, and measure application performance under concurrent load.

## Overview

This lab explores the fundamentals of load balancing with a practical, locally reproducible setup.

Two Node.js backend instances run on separate ports. Nginx exposes a single entry point and distributes incoming HTTP requests across the backend instances. Each backend queries PostgreSQL and returns a JSON response containing its identity, port, timestamp, and the requested database record.

The lab also demonstrates how adding database work to an HTTP request can affect throughput and latency.

## Architecture

```text
                   HTTP Requests
                         |
                         v
                  Nginx :8080
                         |
                  Reverse Proxy
                         |
                Upstream: lab_backend
                    /         \
                   v           v
          Backend 1           Backend 2
          Node.js             Node.js
          :3002               :3003
              \                 /
               \               /
                v             v
                 PostgreSQL
                 eng_lab
                     |
                     v
               users table
```

### Components

- **Nginx:** Reverse proxy and HTTP load balancer.
- **Node.js:** Backend HTTP server.
- **TypeScript:** Backend implementation language.
- **PM2:** Backend process management.
- **PostgreSQL:** Relational database queried by each backend request.
- **Autocannon:** HTTP load-testing tool.

## Project Structure

```text
01-load-balancing/
├── README.md
├── .env
└── src/
    └── index.ts
```

The Nginx configuration is maintained separately in:

```text
/etc/nginx/conf.d/lab-load-balancer.conf
```

The project uses the repository-level `package.json` and npm scripts.

## Nginx Configuration

The following configuration defines an upstream group containing two backend instances and exposes them through port `8080`.

```nginx
upstream lab_backend {
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 8080;
    server_name localhost;

    location / {
        proxy_pass http://lab_backend;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

With the default Nginx upstream behavior, requests are distributed across the available backend servers using round-robin scheduling.

The client accesses a single entry point:

```text
http://127.0.0.1:8080/
```

The client does not need to know which backend instance processes a particular request.

## Backend Implementation

The backend is implemented in TypeScript using Node.js's HTTP server and the `pg` PostgreSQL client.

Each instance receives its port and name through environment variables:

```ts
const port = Number(process.env.PORT ?? 3002);
const name = process.env.BACKEND_NAME ?? "backend-1";
```

A PostgreSQL connection pool is configured with environment-based connection settings.

For each HTTP request, the application executes the following parameterized query:

```sql
SELECT * FROM users WHERE name = $1 LIMIT 1;
```

The query uses `Ali` as its parameter.

A successful response includes:

- Backend name
- Listening port
- Response timestamp
- Matching database record, or `null` if no matching record exists

Database errors are logged by the backend and returned as HTTP `500` responses.

## Environment Configuration

Database credentials are supplied through environment variables rather than hardcoded in the TypeScript source.

Example `.env` structure:

```dotenv
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=eng_lab
PGUSER=eng_user
PGPASSWORD=your_local_database_password
```

The `.env` file must remain local and must not be committed to version control.

The application loads environment variables using `dotenv`. The configuration path must match the actual location of the `.env` file; it should not depend on the directory from which the npm script is executed.

Each backend instance must also receive its own `PORT` and `BACKEND_NAME` values.

Example instance settings:

| Instance | PORT | BACKEND_NAME |
|---|---:|---|
| Backend 1 | 3002 | backend-1 |
| Backend 2 | 3003 | backend-2 |

These values can be supplied through the process manager or the environment used to launch each instance.

## Running the Lab

### 1. Install dependencies

From the repository root:

```bash
npm install
```

Ensure that the required packages are available, including `tsx`, `pg`, `dotenv`, and the PostgreSQL type definitions used by the project.

### 2. Configure PostgreSQL

Create or configure the `eng_lab` database, the `users` table, and a database user with the required permissions.

Ensure the configured credentials match the actual PostgreSQL authentication settings.

### 3. Start the backend instances

Start two backend processes with the correct environment variables:

- Backend 1: `127.0.0.1:3002`
- Backend 2: `127.0.0.1:3003`

PM2 can be used to keep the processes running and manage their logs.

### 4. Validate Nginx

Test the configuration:

```bash
sudo nginx -t
```

Reload Nginx after validating the configuration:

```bash
sudo systemctl reload nginx
```

### 5. Send a test request

```bash
curl -i http://127.0.0.1:8080/
```

A successful response should return HTTP `200 OK` and JSON containing the backend identity and database result.

## Load Testing with Autocannon

Autocannon was used to generate concurrent HTTP traffic against the Nginx entry point.

Example:

```bash
npx autocannon -c 25 -d 15 http://127.0.0.1:8080/
```

Parameters:

- `-c 25`: Maintain 25 concurrent connections.
- `-d 15`: Run the test for 15 seconds.
- URL: Send requests through Nginx rather than directly to a backend.

### Recorded Results

The following results were observed during the lab exercises.

| Scenario | Concurrency | Duration | Avg. Latency | Avg. Throughput |
|---|---:|---:|---:|---:|
| Earlier simple-response test | 25 | 15 s | 8.95 ms | 7,690.8 req/s |
| PostgreSQL-backed endpoint | 25 | 15 s | 9.35 ms | 4,665.87 req/s |

The PostgreSQL-backed test completed approximately 70,000 requests over 15 seconds and reported approximately 19.9 MB of response data.

### Initial Observations

Compared with the earlier simple-response test, the PostgreSQL-backed test showed:

- Approximately **0.40 ms higher average latency**.
- Approximately **4.5% higher average latency**, calculated from the recorded averages.
- Approximately **39.3% lower average throughput**.

These figures are observations from separate test runs, not a controlled measurement of PostgreSQL's isolated overhead. Differences in runtime conditions, database activity, and resource contention may affect the results.

The comparison illustrates why latency and throughput should be evaluated separately. A small change in average latency does not necessarily imply a similarly small change in the number of requests the system can process per second.

## Understanding Throughput and Latency

**Throughput** measures how many requests a system processes per unit of time, commonly expressed as requests per second (
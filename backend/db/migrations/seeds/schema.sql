CREATE TABLE if not exists "packages"
(
    "id"       integer PRIMARY KEY GENERATED always as IDENTITY,
    "name"     varchar(255),
    "duration" integer,
    "price"    integer
);

CREATE TABLE if not exists "users"
(
    "id"         integer PRIMARY KEY GENERATED always as IDENTITY,
    "username"   varchar(255) unique,
    "first_name" varchar(255),
    "last_name"  varchar(255),
    "password"   varchar(255),
    "email"      varchar(255) unique,
    "phone"      varchar(255) unique,
    "discount"   integer,
    "created_at" timestamp
);

CREATE TABLE if not exists "boxes"
(
    "id"   integer PRIMARY KEY GENERATED always as IDENTITY,
    "name" varchar(255)
);

create table if not exists "boxes_masters"
(
    "id"    integer primary key GENERATED always as IDENTITY,
    box_id  integer,
    user_id integer
);

CREATE TABLE if not exists "boxes_queue"
(
    "box_num"    integer unique,
    "curr_queue" integer,
    "status"     varchar
);

CREATE TABLE if not exists "roles"
(
    "id"    integer PRIMARY KEY GENERATED always as IDENTITY,
    "name"  text,
    "label" text
);

CREATE TABLE if not exists "users_roles"
(
    "id"      integer PRIMARY KEY GENERATED always as IDENTITY,
    "user_id" integer,
    "role_id" integer,
    unique (user_id, role_id)
);

CREATE TABLE if not exists "orders"
(
    "id"             integer PRIMARY KEY GENERATED always as IDENTITY,
    "user_id"        integer,
    "start_at"       timestamp,
    "payment_status" varchar(255),
    "payment_info"   json,
    "payment_type"   varchar(255),
    "box_num"        integer,
    "status"         varchar
);

CREATE TABLE if not exists "orders_packages"
(
    "id"          integer PRIMARY KEY GENERATED always as IDENTITY,
    "package_ids"  integer[],
    "order_id"    integer,
    "total_time"  integer,
    "total_price" integer
);

create table if not exists "bonuses"
(
    "user_id" integer,
    "amount" integer,
    "meta" json
)

-- ALTER TABLE "users_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
--
-- ALTER TABLE "roles" ADD FOREIGN KEY ("id") REFERENCES "users_roles" ("role_id");
--
-- ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
--
-- ALTER TABLE "services_orders_services" ADD FOREIGN KEY ("services_id") REFERENCES "services" ("id");
--
-- ALTER TABLE "services_orders_services" ADD FOREIGN KEY ("orders_services_service_id") REFERENCES "orders_services" ("service_id");
--
-- ALTER TABLE "orders_services" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");
begin;
insert into roles(label, name)
values ('Администратор', 'admin'),
       ('Пользователь', 'user'),
       ('Гость', 'guest'),
       ('Сотрудник', 'worker');


insert into boxes(name)
values ('Чил зона'),
       ('Заходим не стесняемся');

insert into packages(name, duration, price)
values ('Комплеск мойка', 120, 900),
       ('Полировка кузова', 5, 180);

-- password -> test123
insert into users(username, first_name, last_name, password, email, phone, created_at)
values ('admin', 'Admin', 'Adminovich', '$2b$10$AywVBU1egI3JwiaYOrPlF.6/JMq3ZL3.zch6Mqgl9YS5xTtTO/poC',
        'admin@gmail.com', '+799999999', now()),
       ('user', 'UserModel', 'Userovich', '$2b$10$AywVBU1egI3JwiaYOrPlF.6/JMq3ZL3.zch6Mqgl9YS5xTtTO/poC',
        'user@gmail.com', '+799999998', now()),
       ('worker', 'Worker', 'Workerovich', '$2b$10$AywVBU1egI3JwiaYOrPlF.6/JMq3ZL3.zch6Mqgl9YS5xTtTO/poC',
        'worker@gmail.com', '+799999997', now()),
       ('guest', 'Guest', 'Guestovich', '$2b$10$AywVBU1egI3JwiaYOrPlF.6/JMq3ZL3.zch6Mqgl9YS5xTtTO/poC',
        'guest@gmail.com', '+799999996', now());

with roles as (select json_build_object(name, id) as r from roles),
     users as (select json_build_object(username, id) as u from users)
insert
into users_roles(user_id, role_id)
values ((select (u -> 'admin')::jsonb::integer from users where u -> 'admin' is not null),
        (select (r -> 'admin')::jsonb::integer from roles where r -> 'admin' is not null)),
       ((select (u -> 'user')::jsonb::integer from users where u -> 'user' is not null),
        (select (r -> 'user')::jsonb::integer from roles where r -> 'user' is not null)),
       ((select (u -> 'worker')::jsonb::integer from users where u -> 'worker' is not null),
        (select (r -> 'worker')::jsonb::integer from roles where r -> 'worker' is not null)),
       ((select (u -> 'worker')::jsonb::integer from users where u -> 'worker' is not null),
        (select (r -> 'user')::jsonb::integer from roles where r -> 'user' is not null)),
       ((select (u -> 'guest')::jsonb::integer from users where u -> 'guest' is not null),
        (select (r -> 'guest')::jsonb::integer from roles where r -> 'guest' is not null));

insert into boxes_masters(box_id, user_id)
values ((select id from boxes order by id limit 1),
        (select id from users where username = 'worker'));
commit;
create type upload_status as enum ('new', 'completed', 'cancelled');
create type upload_type as enum ('operations');

create table uploads (
  id serial primary key,
  owner_id integer not null references users (id),
  date timestamp not null default now(),
  status upload_status not null default 'new',
  type upload_type not null default 'operations',
  params jsonb not null default '{}'
);

-- params structure
-- {
--   "fieldSeparator": "\t",
--   "fields": [ { "type": "date", "format": "" }, { "type": "",  }, "", "", "" ],
--   "mapping": [ { "type": "", "from": "", "to": "" } ]
-- }

create table upload_contents (
  id serial primary key,
  upload_id integer not null references uploads (id),
  row_index integer not null,
  row_data jsonb not null default '[]'
);

create sequence if not exists public.address_seq
    increment by 50;

create sequence if not exists public.contact_seq
    increment by 50;

create sequence if not exists public.customer_seq
    increment by 50;

create sequence if not exists public.email_seq
    increment by 50;

create sequence if not exists public.job_offer_seq
    increment by 50;

create sequence if not exists public.machine_state_seq
    increment by 50;

create sequence if not exists public.message_seq
    increment by 50;

create sequence if not exists public.professional_seq
    increment by 50;

create sequence if not exists public.skill_seq
    increment by 50;

create sequence if not exists public.telephone_seq
    increment by 50;




create table if not exists public.contact (
                                              contact_id bigint primary key not null default nextval('public.contact_seq'::regclass),
                                              category character varying(255),
                                              name character varying(255),
                                              ssn_code character varying(255),
                                              surname character varying(255)
);

create table if not exists public.address (
                                address_id bigint primary key not null default nextval('public.address_seq'::regclass),
                                address character varying(255)
);

create table if not exists public.address_contact (
                                        address_address_id bigint not null,
                                        contact_contact_id bigint not null,
                                        primary key (address_address_id, contact_contact_id),
                                        foreign key (address_address_id) references public.address (address_id)
                                            match simple on update no action on delete no action,
                                        foreign key (contact_contact_id) references public.contact (contact_id)
                                            match simple on update no action on delete no action
);



create table if not exists public.customer (
                                 customer_id bigint primary key not null default nextval('public.customer_seq'::regclass),
                                 notes character varying(255),
                                 contact_contact_id bigint,
                                 foreign key (contact_contact_id) references public.contact (contact_id)
                                     match simple on update no action on delete no action
);
create unique index if not exists uk_is92n98sns4ow5vvyrojtkymg on customer using btree (contact_contact_id);

create table if not exists public.email (
                              email_id bigint primary key not null default nextval('public.email_seq'::regclass),
                              email character varying(255)
);

create table if not exists public.email_contact (
                                      email_email_id bigint not null,
                                      contact_contact_id bigint not null,
                                      primary key (email_email_id, contact_contact_id),
                                      foreign key (email_email_id) references public.email (email_id)
                                          match simple on update no action on delete no action,
                                      foreign key (contact_contact_id) references public.contact (contact_id)
                                          match simple on update no action on delete no action
);

create table if not exists public.job_offer (
                                  job_offer_id bigint primary key not null default nextval('public.job_offer_seq'::regclass),
                                  description character varying(255),
                                  duration double precision not null,
                                  notes character varying(255),
                                  offer_value double precision not null,
                                  required_skills character varying(255),
                                  status smallint,
                                  current_customer_customer_id bigint,
                                  old_customer_customer_id bigint,
                                  foreign key (old_customer_customer_id) references public.customer (customer_id)
                                      match simple on update no action on delete no action,
                                  foreign key (current_customer_customer_id) references public.customer (customer_id)
                                      match simple on update no action on delete no action
);

create table if not exists public.message (
                                              message_id bigint primary key not null default nextval('public.message_seq'::regclass),
                                              body character varying(255),
                                              channel character varying(255),
                                              date timestamp(6) without time zone,
                                              priority integer not null,
                                              sender character varying(255),
                                              state smallint,
                                              subject character varying(255)
);

create table if not exists public.machine_state (
                                      machine_state_id bigint primary key not null default nextval('public.machine_state_seq'::regclass),
                                      comments character varying(255),
                                      date timestamp(6) without time zone,
                                      state smallint,
                                      message_message_id bigint,
                                      foreign key (message_message_id) references public.message (message_id)
                                          match simple on update no action on delete no action
);



create table if not exists public.professional (
                                     professional_id bigint primary key not null default nextval('public.professional_seq'::regclass),
                                     daily_rate double precision not null,
                                     employment smallint,
                                     geographical_info character varying(255),
                                     notes character varying(255),
                                     contact_contact_id bigint,
                                     job_offer_job_offer_id bigint,
                                     job_offer_proposal_job_offer_id bigint,
                                     foreign key (job_offer_proposal_job_offer_id) references public.job_offer (job_offer_id)
                                         match simple on update no action on delete no action,
                                     foreign key (contact_contact_id) references public.contact (contact_id)
                                         match simple on update no action on delete no action,
                                     foreign key (job_offer_job_offer_id) references public.job_offer (job_offer_id)
                                         match simple on update no action on delete no action
);
create unique index if not exists uk_lmmo9lgogaue32487cxrlid6r on professional using btree (contact_contact_id);
create unique index if not exists uk_ds9tewbu95kog6vhrnjapv6m7 on professional using btree (job_offer_job_offer_id);

create table if not exists public.skill (
                              skill_id bigint primary key not null default nextval('public.skill_seq'::regclass),
                              skill character varying(255)
);

create table if not exists public.skill_professional (
                                           skills_skill_id bigint not null,
                                           professional_professional_id bigint not null,
                                           primary key (skills_skill_id, professional_professional_id),
                                           foreign key (professional_professional_id) references public.professional (professional_id)
                                               match simple on update no action on delete no action,
                                           foreign key (skills_skill_id) references public.skill (skill_id)
                                               match simple on update no action on delete no action
);

create table if not exists public.telephone (
                                  telephone_id bigint primary key not null default nextval('public.telephone_seq'::regclass),
                                  telephone character varying(255)
);

create table if not exists public.telephone_contact (
                                          telephone_telephone_id bigint not null,
                                          contact_contact_id bigint not null,
                                          primary key (telephone_telephone_id, contact_contact_id),
                                          foreign key (contact_contact_id) references public.contact (contact_id)
                                              match simple on update no action on delete no action,
                                          foreign key (telephone_telephone_id) references public.telephone (telephone_id)
                                              match simple on update no action on delete no action
);



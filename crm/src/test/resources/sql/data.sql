delete from skill_professional;
delete from skill;
delete from job_offer;
delete from professional;
delete from customer;
delete from contact;
delete from message;

insert into contact (contact_id, category, name, ssn_code, surname) values
                            (1,
                            'this is the first contact category',
                            'this is the first contact name',
                            'this is the first contact ssn code',
                            'this is the first contact surname'),
                           (2,
                            'this is the second contact category',
                            'this is the second contact name',
                            'this is the second contact ssn code',
                            'this is the second contact surname'),
                            (3,
                            'this is the third contact category',
                            'this is the third contact name',
                            'this is the third contact ssn code',
                            'this is the third contact surname'),
                            (4,
                             'category',
                             'Steve',
                             'ssn code',
                             'Jobs'),
                            (5,
                             'category',
                             'Carlo',
                             'ssn code',
                             'Alberto');

insert into message (message_id, body, channel, date, priority, state, subject, sender) values
                            (1,
                            'this is the first message body',
                            'this is the first message channel',
                            current_timestamp,
                            2,
                            0,
                            'this is the first message subject',
                            'this is the first message sender'),
                           (2,
                            'this is the second message body',
                            'this is the second message channel',
                            current_timestamp,
                            100,
                            0,
                            'this is the second message subject',
                            'this is the second message sender'),
                           (3,
                            'this is the third message body',
                            'this is the third message channel',
                            current_timestamp,
                            4,
                            0,
                            'this is the third message subject',
                            'this is the third message sender');


insert into professional (professional_id, daily_rate, employment, geographical_info, notes, contact_contact_id, job_offer_job_offer_id, job_offer_proposal_job_offer_id) values
                            (11,
                             100.0,
                             0,
                             'Torino',
                             'note',
                             2,
                             NULL,
                             NULL),
                            (12,
                             200.0,
                             0,
                             'Torino',
                             'note',
                             3,
                             NULL,
                             NULL),
                            (13,
                             100.0,
                             0,
                             'Torino',
                             'note',
                             5,
                             NULL,
                             NULL);



insert into skill (skill_id, skill) values
                            (11,
                             'gardener'),
                            (12,
                             'consultant'),
                            (13,
                             'electrician');

insert into skill_professional (skills_skill_id, professional_professional_id) VALUES
                            (11,
                             11),
                            (11,
                             12),
                            (12,
                             11),
                            (13,
                             13);



insert into customer (customer_id, notes, contact_contact_id) values
                            (48,
                             'note',
                             1),
                            (49,
                             'note 2',
                             2);

insert into job_offer (job_offer_id, description, duration, notes, offer_value, required_skills, status, current_customer_customer_id, old_customer_customer_id) values
                             (11,
                              'need a plumber',
                              1.0,
                              'note',
                              100,
                              'plumber',
                              0,
                              48,
                              Null),
                             (12,
                              'need an electrician',
                              2.0,
                              'note',
                              200,
                              'electrician',
                              0,
                              49,
                              Null),
                             (13,
                              'need a consultant',
                              1.0,
                              'note',
                              150,
                              'consultant',
                              0,
                              49,
                              Null),
                             (14,
                              'need a gardener',
                              1.0,
                              'note',
                              100,
                              'gardener',
                              0,
                              49,
                              Null),
                             (15,
                              'need a plumber',
                              1.0,
                              'note',
                              100,
                              'plumber',
                              0,
                              48,
                              Null),
                             (16,
                              'need a plumber',
                              1.0,
                              'note',
                              100,
                              'plumber',
                              1,
                              48,
                              Null);






    create table choice_option (
        is_correct bit not null,
        option_id bigint not null auto_increment,
        question_id binary(16) not null,
        image_url varchar(255),
        option_text TEXT not null,
        primary key (option_id)
    ) engine=InnoDB;

    create table code_answer (
        answer_id bigint not null auto_increment,
        question_id binary(16) not null,
        language varchar(255) not null,
        method_name varchar(255) not null,
        template_code TEXT,
        test_cases TEXT not null,
        primary key (answer_id)
    ) engine=InnoDB;

    create table courses (
        id bigint not null auto_increment,
        profile_id binary(16),
        user_id binary(16) not null,
        certificate_url varchar(255) not null,
        course_name varchar(255) not null,
        description TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table education (
        id bigint not null auto_increment,
        profile_id binary(16),
        user_id binary(16) not null,
        institution varchar(255),
        specialties TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table experience (
        id bigint not null auto_increment,
        profile_id binary(16),
        user_id binary(16) not null,
        description TEXT,
        project_name varchar(255) not null,
        project_url varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table matching_pair (
        pair_id bigint not null auto_increment,
        question_id binary(16) not null,
        answer_text TEXT not null,
        prompt_text TEXT not null,
        primary key (pair_id)
    ) engine=InnoDB;

    create table notification (
        is_read bit,
        created_at datetime(6),
        id bigint not null auto_increment,
        recipient_id binary(16) not null,
        sender_id binary(16),
        message TEXT not null,
        title varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table oauth_identities (
        id integer not null auto_increment,
        provider_id integer not null,
        access_token_expires_at datetime(6),
        created_at datetime(6),
        refresh_token_expires_at datetime(6),
        updated_at datetime(6),
        user_id binary(16) not null,
        access_token TEXT not null,
        provider_user_id varchar(255) not null,
        refresh_token TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table oauth_providers (
        id integer not null auto_increment,
        name varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    create table proctoring_logs (
        id bigint not null auto_increment,
        timestamp datetime(6),
        user_test_attempt_id binary(16) not null,
        description varchar(255),
        event_type enum ('CONNECTION_LOST','COPY_ATTEMPT','PASTE_ATTEMPT','TAB_SWITCH','WINDOW_BLUR'),
        primary key (id)
    ) engine=InnoDB;

    create table profile_links (
        id bigint not null auto_increment,
        profile_id binary(16),
        user_id binary(16) not null,
        type varchar(255),
        url varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table profiles (
        birth_date date,
        created_at datetime(6),
        updated_at datetime(6),
        user_id binary(16) not null,
        about TEXT,
        first_name varchar(255) not null,
        last_name varchar(255),
        profile_image_url varchar(255),
        primary key (user_id)
    ) engine=InnoDB;

    create table question (
        custom_weight float(53),
        level_id bigint,
        author_id binary(16) not null,
        question_id binary(16) not null,
        comment TEXT,
        image_url varchar(255),
        question_text TEXT not null,
        question_type enum ('CODE','MATCHING','MULTIPLE_CHOICE','SINGLE_CHOICE','TEXT') not null,
        primary key (question_id)
    ) engine=InnoDB;

    create table question_categories (
        question_id binary(16) not null,
        category_name enum ('BACKEND','DESIGN','DEVOPS','FRONTEND','MANAGEMENT','QA') not null,
        primary key (question_id, category_name)
    ) engine=InnoDB;

    create table test (
        duration_minutes integer,
        is_fixed_answer_order bit,
        is_fixed_question_order bit,
        is_fixed_time bit,
        is_private bit,
        is_show_result bit,
        end_time datetime(6),
        start_time datetime(6),
        id binary(16) not null,
        user_id binary(16) not null,
        city varchar(255),
        level varchar(255),
        responsibilities TEXT,
        sphere varchar(255),
        test_name varchar(255) not null,
        vacancy_description TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table test_access_codes (
        is_used bit not null,
        created_at datetime(6) not null,
        code varchar(10) not null,
        id binary(16) not null,
        test_id binary(16) not null,
        used_by_user_id binary(16),
        tag varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    create table test_invitations (
        expires_at datetime(6),
        id binary(16) not null,
        test_id binary(16) not null,
        email varchar(255) not null,
        token varchar(255) not null,
        status enum ('EXPIRED','PENDING','USED') not null,
        primary key (id)
    ) engine=InnoDB;

    create table test_level (
        order_index float(53),
        questions_limit integer,
        weight float(53),
        id bigint not null auto_increment,
        test_id binary(16) not null,
        name varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table test_question (
        order_index integer,
        id bigint not null auto_increment,
        question_id binary(16) not null,
        test_id binary(16) not null,
        primary key (id)
    ) engine=InnoDB;

    create table test_registration (
        id bigint not null auto_increment,
        registered_at datetime(6) not null,
        test_id binary(16) not null,
        user_id binary(16) not null,
        primary key (id)
    ) engine=InnoDB;

    create table text_answer (
        is_case_sensitive bit not null,
        answer_id bigint not null auto_increment,
        question_id binary(16) not null,
        correct_text TEXT not null,
        primary key (answer_id)
    ) engine=InnoDB;

    create table user_answer_choice (
        id bigint not null auto_increment,
        selected_option_id bigint not null,
        user_answer_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table user_answer_matching (
        id bigint not null auto_increment,
        prompt_pair_id bigint not null,
        user_answer_id bigint not null,
        selected_answer_text TEXT not null,
        primary key (id)
    ) engine=InnoDB;

    create table user_test_attempt (
        score decimal(5,2),
        completed_at datetime(6),
        started_at datetime(6) not null,
        attempt_id binary(16) not null,
        test_id binary(16) not null,
        user_id binary(16) not null,
        status enum ('COMPLETED','IN_PROGRESS','PENDING_REVIEW'),
        primary key (attempt_id)
    ) engine=InnoDB;

    create table user_types (
        id integer not null auto_increment,
        name varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    create table user_answer (
        awarded_score decimal(38,2),
        is_correct bit,
        user_answer_id bigint not null auto_increment,
        attempt_id binary(16) not null,
        question_id binary(16) not null,
        given_text TEXT,
        teacher_comment TEXT,
        primary key (user_answer_id)
    ) engine=InnoDB;

    create table users (
        is_verified bit,
        user_type_id integer not null,
        verification_code varchar(6),
        created_at datetime(6),
        updated_at datetime(6),
        id binary(16) not null,
        email varchar(255),
        password_hash varchar(255),
        primary key (id)
    ) engine=InnoDB;

    alter table code_answer 
       add constraint UK3ftfr1dviajjjgtv9wl6u69cj unique (question_id);

    alter table oauth_providers 
       add constraint UKawmqtjvajm320l1qqhycx3i6j unique (name);

    alter table test_access_codes 
       add constraint UKj1ajmu559laf7alm9cb47a6xg unique (code);

    alter table test_invitations 
       add constraint UKcbairn7ksktp57rihjqjyi99s unique (token);

    alter table test_level 
       add constraint UK43b828ms60f027ihjml2cclfq unique (name, test_id);

    alter table test_question 
       add constraint UKjratpf7j61hv8gps5f77dvli3 unique (test_id, question_id);

    alter table test_registration 
       add constraint UK2b3ltlqy3neqec1fjm6ucoxly unique (user_id, test_id);

    alter table text_answer 
       add constraint UK7w8jkd3c4k66tbqd7u9vacw41 unique (question_id);

    alter table user_answer_choice 
       add constraint UKmgyg0ayixatkg3etgmnsosyl unique (user_answer_id, selected_option_id);

    alter table user_answer_matching 
       add constraint UKdybgey4rdeo6hx379unq4mrgb unique (user_answer_id, prompt_pair_id);

    alter table user_types 
       add constraint UK8e5n03eqtc9alk98s41o00u5v unique (name);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table choice_option 
       add constraint FKbcnqjpdu66w1brcj9s0o2x4ky 
       foreign key (question_id) 
       references question (question_id);

    alter table code_answer 
       add constraint FKg6rlbffc4dxpuqya2w9p0iae3 
       foreign key (question_id) 
       references question (question_id);

    alter table courses 
       add constraint FKfhxp8h4fcl0r9y7uyem4jpcmd 
       foreign key (profile_id) 
       references profiles (user_id);

    alter table courses 
       add constraint FK51k53m6m5gi9n91fnlxkxgpmv 
       foreign key (user_id) 
       references users (id);

    alter table education 
       add constraint FK8yafawga6neotslnlmcmevpmr 
       foreign key (profile_id) 
       references profiles (user_id);

    alter table education 
       add constraint FKc8qg4a1sd3texfadb2d7eyhgx 
       foreign key (user_id) 
       references users (id);

    alter table experience 
       add constraint FKr6dkc6hdnv1sqfvyqbaqm0sa4 
       foreign key (profile_id) 
       references profiles (user_id);

    alter table experience 
       add constraint FKo8gihpwob4qiyigh869833ove 
       foreign key (user_id) 
       references users (id);

    alter table matching_pair 
       add constraint FKsbb22grwui45my1o6js2lcjd 
       foreign key (question_id) 
       references question (question_id);

    alter table notification 
       add constraint FKfcyn9rsga73dqnorl7owfyl4a 
       foreign key (recipient_id) 
       references users (id);

    alter table notification 
       add constraint FKrg0atx075rr68et2rqrh34qwj 
       foreign key (sender_id) 
       references users (id);

    alter table oauth_identities 
       add constraint FKrkk0ynona0yy0t8y8g9pkl24f 
       foreign key (provider_id) 
       references oauth_providers (id);

    alter table oauth_identities 
       add constraint FKcwhpmr8ej1s107ds2ex7afd65 
       foreign key (user_id) 
       references users (id);

    alter table proctoring_logs 
       add constraint FK8qkex42iq2r6986bpoqiglcc8 
       foreign key (user_test_attempt_id) 
       references user_test_attempt (attempt_id);

    alter table profile_links 
       add constraint FK1msaxsm6uvuqgu3qkf4yoarnl 
       foreign key (profile_id) 
       references profiles (user_id);

    alter table profile_links 
       add constraint FKasow6qdd7mfuhnli31s0nhefq 
       foreign key (user_id) 
       references users (id);

    alter table profiles 
       add constraint FK410q61iev7klncmpqfuo85ivh 
       foreign key (user_id) 
       references users (id);

    alter table question 
       add constraint FK9hbbb7nlsexvarrbh2l3frdj3 
       foreign key (author_id) 
       references users (id);

    alter table question 
       add constraint FKdpg6mqx4p1s9k6jtf0hl6ml1v 
       foreign key (level_id) 
       references test_level (id);

    alter table question_categories 
       add constraint FK15kxoxp8lkadeitevlq5ht9mf 
       foreign key (question_id) 
       references question (question_id);

    alter table test 
       add constraint FKdug99c3uufjv7wedmlt9euews 
       foreign key (user_id) 
       references users (id);

    alter table test_access_codes 
       add constraint FK4ot42jdine84uxbwnh4vtntil 
       foreign key (test_id) 
       references test (id);

    alter table test_access_codes 
       add constraint FK8psir5igxbofye198dp7pos92 
       foreign key (used_by_user_id) 
       references users (id);

    alter table test_invitations 
       add constraint FK8rr6qyneiacw9muc7t7jb9qks 
       foreign key (test_id) 
       references test (id);

    alter table test_level 
       add constraint FKtixlm7kbyw7l3b1axhxt1q7gl 
       foreign key (test_id) 
       references test (id);

    alter table test_question 
       add constraint FKk5qvcm9mkgbi8hm4u2mlidm4i 
       foreign key (question_id) 
       references question (question_id);

    alter table test_question 
       add constraint FKk2sfq1wyx19uvwn7pkgk1bc9n 
       foreign key (test_id) 
       references test (id);

    alter table test_registration 
       add constraint FKajyio2d0e3giovpsgm48c9pjm 
       foreign key (test_id) 
       references test (id);

    alter table test_registration 
       add constraint FK8xphy8ui90ngo5ge2qpvei4mr 
       foreign key (user_id) 
       references users (id);

    alter table text_answer 
       add constraint FKn2oy5cctxfvirjdlg4v4rf2ap 
       foreign key (question_id) 
       references question (question_id);

    alter table user_answer_choice 
       add constraint FK2cgjufs01t5d27bh3v9tckk9u 
       foreign key (selected_option_id) 
       references choice_option (option_id);

    alter table user_answer_choice 
       add constraint FKi6qw776079ax29rhlbvin5n1j 
       foreign key (user_answer_id) 
       references user_answer (user_answer_id);

    alter table user_answer_matching 
       add constraint FKeb0vk31susmb8fdsxteuaqx36 
       foreign key (prompt_pair_id) 
       references matching_pair (pair_id);

    alter table user_answer_matching 
       add constraint FKlmn9v7y74nnki683hbo8du6pb 
       foreign key (user_answer_id) 
       references user_answer (user_answer_id);

    alter table user_test_attempt 
       add constraint FK3kbsaqnx8wklpvpm35we1bafp 
       foreign key (test_id) 
       references test (id);

    alter table user_test_attempt 
       add constraint FKt30lqvw1x7c3g31rc22cq3i00 
       foreign key (user_id) 
       references users (id);

    alter table user_answer 
       add constraint FKmqlvxrybw1r77sribes55hd89 
       foreign key (attempt_id) 
       references user_test_attempt (attempt_id);

    alter table user_answer 
       add constraint FKpsk90eok3ounaet92hku3gny1 
       foreign key (question_id) 
       references question (question_id);

    alter table users 
       add constraint FKp0utx8kvsuc78nb39dgyg6oko 
       foreign key (user_type_id) 
       references user_types (id);

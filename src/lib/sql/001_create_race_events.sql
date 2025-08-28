-- Create race_events table
CREATE TABLE IF NOT EXISTS public.race_events (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    date date NOT NULL,
    track text NOT NULL
);

ALTER TABLE public.race_events OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.race_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.race_events_id_seq OWNER TO postgres;

ALTER TABLE ONLY public.race_events ALTER COLUMN id SET DEFAULT nextval('public.race_events_id_seq'::regclass);

ALTER TABLE ONLY public.race_events
    ADD CONSTRAINT race_events_pkey PRIMARY KEY (id);

ALTER TABLE public.race_events ENABLE ROW LEVEL SECURITY;

-- Create races table
CREATE TABLE IF NOT EXISTS public.races (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    event_id bigint NOT NULL,
    "time" time without time zone NOT NULL,
    name text NOT NULL,
    participants integer DEFAULT 0 NOT NULL
);

ALTER TABLE public.races OWNER TO postgres;

CREATE SEQUENCE IF NOT EXISTS public.races_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.races_id_seq OWNER TO postgres;

ALTER TABLE ONLY public.races ALTER COLUMN id SET DEFAULT nextval('public.races_id_seq'::regclass);

ALTER TABLE ONLY public.races
    ADD CONSTRAINT races_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.races
    ADD CONSTRAINT races_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.race_events(id);

ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

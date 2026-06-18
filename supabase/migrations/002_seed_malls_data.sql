-- ============================================================
-- Lokales: add columns + seed malls (run as one script)
-- ============================================================

-- 1. Add missing columns + fix constraints
ALTER TABLE public.shopping_centers
  ADD COLUMN IF NOT EXISTS shops_count integer,
  ADD COLUMN IF NOT EXISTS center_type text,
  ADD COLUMN IF NOT EXISTS year_opened integer,
  ADD COLUMN IF NOT EXISTS owner       text;

ALTER TABLE public.shopping_centers
  ALTER COLUMN postal_code DROP NOT NULL;

ALTER TABLE public.shopping_centers
  ALTER COLUMN address SET DEFAULT '';

-- 2. Province stats table
CREATE TABLE IF NOT EXISTS public.province_stats (
  id                   uuid default uuid_generate_v4() primary key,
  autonomous_community text not null unique,
  centers_count        integer,
  total_sba_sqm        numeric,
  total_shops_count    integer,
  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null
);
ALTER TABLE public.province_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Province stats are public" ON public.province_stats;
CREATE POLICY "Province stats are public" ON public.province_stats FOR SELECT USING (true);

-- 3. Indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;
DROP INDEX IF EXISTS shopping_centers_name_trgm_idx;
DROP INDEX IF EXISTS shopping_centers_city_trgm_idx;
CREATE INDEX shopping_centers_name_trgm_idx ON public.shopping_centers USING GIN (name gin_trgm_ops);
CREATE INDEX shopping_centers_city_trgm_idx ON public.shopping_centers USING GIN (city gin_trgm_ops);

-- 4. Lock down user inserts
DROP POLICY IF EXISTS "Logged-in users can add shopping centers" ON public.shopping_centers;

-- 5. Seed shopping centers
INSERT INTO public.shopping_centers
  (name, city, province, address, country, gla_sqm, shops_count, owner, center_type, year_opened)
VALUES
  ('Torrecárdenas', 'Almería', 'Andalucía', 'Avda. del Mediterráneo', 'Spain', 79000, 150, 'Sonae Sierra', 'Centro Comercial', 2019),
  ('Nevada Shopping', 'Armilla', 'Andalucía', 'Avda. de Andalucía', 'Spain', 120000, 200, 'Eurofund / Ikea', 'Centro Comercial', 2014),
  ('Camas', 'Camas', 'Andalucía', 'Avda. de Hytasa', 'Spain', 28000, 80, 'Carmila', 'Parque Comercial', 2008),
  ('Galerias Primero', 'Córdoba', 'Andalucía', 'Avda. Medina Azahara', 'Spain', 25000, 80, 'Varios', 'Centro Comercial', 1980),
  ('Zoco', 'Córdoba', 'Andalucía', 'Avda. del Brillante', 'Spain', 40000, 110, 'CBRE IM', 'Centro Comercial', 1992),
  ('Miramar', 'Fuengirola', 'Andalucía', 'Avda. Jesús Santos Rein', 'Spain', 58000, 130, 'Carmila', 'Centro Comercial', 1994),
  ('Holea', 'Huelva', 'Andalucía', 'Avda. de Andalucía', 'Spain', 66000, 140, 'General de Galerías Comerciales (GCC)', 'Centro Comercial', 2015),
  ('Jaén Plaza', 'Jaén', 'Andalucía', 'Avda. de Madrid', 'Spain', 40000, 100, 'Carmila', 'Centro Comercial', 2002),
  ('Carrefour Jerez', 'Jerez de la Frontera', 'Andalucía', 'Avda. de Méjico', 'Spain', 25000, 60, 'Carmila', 'Centro Comercial', 1999),
  ('Larios', 'Málaga', 'Andalucía', 'C/ Larios', 'Spain', 30000, 100, 'CBRE IM', 'Centro Comercial', 2003),
  ('Vialia Málaga', 'Málaga', 'Andalucía', 'Explanada de la Estación', 'Spain', 16000, 60, 'Vialia / Adif', 'Centro Comercial', 2015),
  ('Granaita', 'Pulianas', 'Andalucía', 'Camino de Cúllar', 'Spain', 104000, 150, 'Castellana Properties', 'Parque Comercial', 2006),
  ('Bahía Sur', 'San Fernando', 'Andalucía', 'Avda. de la Bahía', 'Spain', 53000, 120, 'Klépierre', 'Centro Comercial', 1994),
  ('Dos Mares', 'San Javier', 'Andalucía', 'Avda. de la Estación', 'Spain', 45000, 120, 'General de Galerías Comerciales (GCC)', 'Centro Comercial', 1994),
  ('Lagoh', 'Sevilla', 'Andalucía', 'Avda. de la Hispanidad', 'Spain', 123500, 200, 'Lar España', 'Centro Comercial', 2019),
  ('Nervión Plaza', 'Sevilla', 'Andalucía', 'Avda. Luis de Morales', 'Spain', 40000, 130, 'Carmila', 'Centro Comercial', 1993),
  ('Los Arcos', 'Sevilla', 'Andalucía', 'Ctra. de Su Eminencia', 'Spain', 40000, 120, 'Klépierre', 'Centro Comercial', 1999),
  ('El Ingenio', 'Vélez-Málaga', 'Andalucía', 'Avda. Vivar Téllez', 'Spain', 53000, 130, 'Lar España', 'Parque Comercial', 2007),
  ('Los Porches del Audiorama', 'Huesca', 'Aragón', 'Ronda Misericordia', 'Spain', 18000, 60, 'Varios', 'Centro Comercial', 2002),
  ('Puerto Venecia', 'Zaragoza', 'Aragón', 'Avda. de Ranillas', 'Spain', 206890, 300, 'Eurofund / El Corte Inglés', 'Gran Centro Comercial', 2012),
  ('Augusta', 'Zaragoza', 'Aragón', 'Ctra. de Logroño', 'Spain', 70000, 150, 'MERLIN Properties', 'Centro Comercial', 1994),
  ('Los Prados', 'Oviedo', 'Asturias', 'Avda. de los Prados', 'Spain', 60000, 140, 'Castellana Properties', 'Centro Comercial', 1996),
  ('Parque Principado', 'Siero', 'Asturias', 'Avda. de los Campones', 'Spain', 100000, 175, 'Nuveen Real Estate', 'Centro Comercial', 2001),
  ('Festival Park', 'Marratxí', 'Baleares', 'Autovía Ma-13', 'Spain', 30000, 90, 'Castellana Properties', 'Centro Comercial', 1993),
  ('Menorca', 'Maó', 'Baleares', 'Avda. J. Anselm Clavé', 'Spain', 15000, 50, 'Carmila', 'Centro Comercial', 2005),
  ('Fan Mallorca Shopping', 'Palma de Mallorca', 'Baleares', 'Avda. del Cardenal Rosell', 'Spain', 50000, 130, 'Sonae Sierra / Ikea', 'Centro Comercial', 2015),
  ('Bonaire', 'Aldaia', 'C. Valenciana', 'Autovía A-3 km 345', 'Spain', 119000, 230, 'Unibail-Rodamco-Westfield (URW)', 'Centro Comercial', 2002),
  ('Carrefour Alicante', 'Alicante', 'C. Valenciana', 'Avda. de Denia', 'Spain', 28000, 60, 'Carmila', 'Centro Comercial', 1995),
  ('Gran Alacant', 'El Campello', 'C. Valenciana', '', 'Spain', 35000, 85, 'Castellana Properties', 'Parque Comercial', 2006),
  ('Portal de la Marina', 'Ondara', 'C. Valenciana', 'Avda. de la Marina', 'Spain', 49000, 110, 'Lar España', 'Parque Comercial', 2008),
  ('Puerto Mediterráneo', 'Sagunto', 'C. Valenciana', 'Avda. del Puerto', 'Spain', 35000, 80, 'Eurofund', 'Parque Comercial', 2012),
  ('Habaneras', 'Torrevieja', 'C. Valenciana', 'Ctra. N-332', 'Spain', 35000, 100, 'Carmila', 'Centro Comercial', 2006),
  ('El Saler', 'Valencia', 'C. Valenciana', 'Avda. del Saler', 'Spain', 40000, 130, 'Klépierre', 'Centro Comercial', 1994),
  ('Aqua Multiespacio', 'Valencia', 'C. Valenciana', 'C/ Menorca', 'Spain', 44000, 130, 'MERLIN Properties', 'Centro Comercial', 2009),
  ('Nuevo Centro', 'Valencia', 'C. Valenciana', 'Avda. del Menéstral', 'Spain', 40000, 120, 'Savills IM / varios', 'Centro Comercial', 1983),
  ('Arena Multiespacio', 'Valencia', 'C. Valenciana', 'C/ Eduardo Boscá', 'Spain', 20000, 60, 'Varios', 'Centro Comercial', 2001),
  ('Campanar', 'Valencia', 'C. Valenciana', 'Avda. de Campanar', 'Spain', 23000, 70, 'Carmila', 'Centro Comercial', 2003),
  ('Cita', 'Arrecife', 'Canarias', 'Avda. Fred Olsen', 'Spain', 22000, 70, 'Carmila', 'Centro Comercial', 2000),
  ('Atlántico', 'Las Chafiras', 'Canarias', 'Avda. de Los Majuelos', 'Spain', 28000, 80, 'Lar España', 'Parque Comercial', 2010),
  ('Las Arenas', 'Las Palmas de G.C.', 'Canarias', 'Avda. José Mesa y López', 'Spain', 68000, 140, 'Klépierre', 'Centro Comercial', 2009),
  ('El Muelle', 'Las Palmas de G.C.', 'Canarias', 'Muelle de Santa Catalina', 'Spain', 38000, 100, 'GreenOak / Stoneweg', 'Centro Comercial', 1999),
  ('Meridiano', 'Santa Cruz de Tenerife', 'Canarias', 'Avda. de La Trinidad', 'Spain', 42000, 120, 'Klépierre', 'Centro Comercial', 1990),
  ('La Marina', 'Santa Cruz de Tenerife', 'Canarias', 'Avda. Marítima', 'Spain', 25000, 80, 'Varios', 'Centro Comercial', 2003),
  ('Bahía Real', 'Santander', 'Cantabria', 'Avda. de los Castros', 'Spain', 25000, 80, 'Nuveen Real Estate', 'Centro Comercial', 1995),
  ('Portal de Cantabria', 'Torrelavega', 'Cantabria', 'Ctra. N-611', 'Spain', 45000, 110, 'Lar España', 'Parque Comercial', 2009),
  ('El Rosal', 'Ponferrada', 'Castilla y León', 'Avda. del Castillo', 'Spain', 50000, 120, 'Lar España', 'Centro Comercial', 2008),
  ('Vialia Salamanca', 'Salamanca', 'Castilla y León', 'Calle de la Estación', 'Spain', 26000, 80, 'Vialia', 'Centro Comercial', 2017),
  ('Río Shopping', 'Valladolid', 'Castilla y León', 'Paseo de Zorrilla', 'Spain', 50000, 140, 'Lar España', 'Centro Comercial', 2007),
  ('Valladolid', 'Valladolid', 'Castilla y León', 'Ctra. de Madrid', 'Spain', 48000, 120, 'Nuveen Real Estate', 'Centro Comercial', 2002),
  ('Imaginalia', 'Albacete', 'Castilla-La Mancha', 'Avda. del Ejercito', 'Spain', 28000, 90, 'MERLIN Properties', 'Centro Comercial', 2006),
  ('Ferial Plaza', 'Guadalajara', 'Castilla-La Mancha', 'Avda. del Ejercito', 'Spain', 35000, 100, 'Carmila', 'Centro Comercial', 1992),
  ('Luz del Tajo', 'Toledo', 'Castilla-La Mancha', 'Avda. de la Luz del Tajo', 'Spain', 56000, 140, 'Sonae Sierra', 'Centro Comercial', 2002),
  ('Baricentro', 'Barberà del Vallès', 'Cataluña', 'Avda. Can Fatjó', 'Spain', 72000, 180, 'Castellana Properties', 'Centro Comercial', 1986),
  ('Westfield La Maquinista', 'Barcelona', 'Cataluña', 'Carrer de Potosí', 'Spain', 88000, 230, 'URW / Carmila', 'Centro Comercial', 2000),
  ('Westfield Glòries', 'Barcelona', 'Cataluña', 'Avda. Diagonal', 'Spain', 97000, 220, 'Unibail-Rodamco-Westfield (URW)', 'Centro Comercial', 1995),
  ('Diagonal Mar', 'Barcelona', 'Cataluña', 'Avda. Diagonal', 'Spain', 88000, 200, 'Klépierre', 'Centro Comercial', 2001),
  ('Maremagnum', 'Barcelona', 'Cataluña', 'Moll d''Espanya', 'Spain', 33000, 80, 'Klépierre', 'Centro Comercial', 1995),
  ('L''Illa Diagonal', 'Barcelona', 'Cataluña', 'Avda. Diagonal', 'Spain', 38000, 100, 'Deka Immobilien', 'Centro Comercial', 1993),
  ('Arenas de Barcelona', 'Barcelona', 'Cataluña', 'Gran Via de les Corts Catalanes', 'Spain', 35000, 90, 'Nuveen Real Estate', 'Centro Comercial', 2011),
  ('Ànec Blau', 'Castelldefels', 'Cataluña', 'Carrer dels Patins', 'Spain', 68000, 160, 'Lar España', 'Centro Comercial', 2002),
  ('Splau', 'Cornellà de Llobregat', 'Cataluña', 'Ctra. de Cornellà', 'Spain', 65000, 155, 'URW / Carmila', 'Centro Comercial', 2011),
  ('Gran Via 2', 'L''Hospitalet de Llobregat', 'Cataluña', 'Avda. de la Gran Via', 'Spain', 100000, 250, 'Carrefour Property / Nuveen', 'Centro Comercial', 1998),
  ('La Jonquera', 'La Jonquera', 'Cataluña', 'Ctra. N-II', 'Spain', 30000, 70, 'Carmila', 'Centro Comercial', 1994),
  ('La Fira', 'Reus', 'Cataluña', 'Avda. del Carrilet', 'Spain', 30000, 90, 'Sonae Sierra', 'Parque Comercial', 2006),
  ('Sant Cugat', 'Sant Cugat del Vallès', 'Cataluña', 'Ctra. de Cerdanyola', 'Spain', 70000, 170, 'MERLIN Properties', 'Centro Comercial', 1998),
  ('Rambla Nova', 'Tarragona', 'Cataluña', 'Rambla Nova', 'Spain', 18000, 60, 'Inmochan', 'Centro Comercial', 1998),
  ('Parc Central', 'Tarragona', 'Cataluña', 'Avda. Roma', 'Spain', 44000, 100, 'Klepierre', 'Parque Comercial', 2010),
  ('Parc Vallès', 'Terrassa', 'Cataluña', 'Avda. del Vallès', 'Spain', 43000, 120, 'MERLIN Properties', 'Parque Comercial', 1993),
  ('El Faro', 'Badajoz', 'Extremadura', 'Avda. Juan Carlos I', 'Spain', 49000, 120, 'Inmochan / Castellana Properties', 'Centro Comercial', 2002),
  ('Los Arcos', 'Badajoz', 'Extremadura', 'Ctra. de Madrid', 'Spain', 30000, 80, 'GCC', 'Centro Comercial', 2010),
  ('Marineda City', 'A Coruña', 'Galicia', 'Avda. del Ejército', 'Spain', 176000, 200, 'MERLIN Properties', 'Gran Centro Comercial', 2011),
  ('O Porriño', 'O Porriño', 'Galicia', 'Rúa Doutor Carou', 'Spain', 42000, 120, 'Carmila', 'Centro Comercial', 2000),
  ('As Cancelas', 'Santiago de Compostela', 'Galicia', 'Rúa de Compostela', 'Spain', 56000, 150, 'Sonae Sierra', 'Centro Comercial', 2008),
  ('Gran Vía de Vigo', 'Vigo', 'Galicia', 'Gran Vía', 'Spain', 100000, 180, 'Lar España', 'Centro Comercial', 2015),
  ('Portal de La Rioja', 'Logroño', 'La Rioja', 'Avda. de Burgos', 'Spain', 52000, 130, 'Lar España', 'Centro Comercial', 2009),
  ('Alcalá Magna', 'Alcalá de Henares', 'Madrid', 'Avda. Reyes Católicos', 'Spain', 42000, 120, 'Castellana Properties', 'Centro Comercial', 2010),
  ('Torrecárdenas 2', 'Alcalá de Henares', 'Madrid', '', 'Spain', 22000, 60, 'Carmila', 'Parque Comercial', 2015),
  ('Moraleja Green', 'Alcobendas', 'Madrid', 'Avda. de Valdelasfuentes', 'Spain', 42000, 110, 'Nuveen Real Estate', 'Parque Comercial', 2001),
  ('Diversia', 'Alcobendas', 'Madrid', 'Avda. de la Industria', 'Spain', 38000, 90, 'Nuveen Real Estate', 'Centro Comercial', 2007),
  ('Parque Oeste', 'Alcorcón', 'Madrid', 'Avda. Parque Oeste', 'Spain', 125000, 200, 'Castellana Properties', 'Centro Comercial', 2000),
  ('X-Madrid', 'Alcorcón', 'Madrid', 'Calle Leganés', 'Spain', 39000, 60, 'MERLIN Properties', 'Centro de Ocio', 2020),
  ('Xanadú', 'Arroyomolinos', 'Madrid', 'Ctra. N-V km 23', 'Spain', 147000, 220, 'Nuveen Real Estate', 'Centro Comercial', 2003),
  ('Loranca', 'Fuenlabrada', 'Madrid', 'Calle de la Fuente', 'Spain', 30000, 90, 'Lar España', 'Centro Comercial', 1993),
  ('Nassica', 'Getafe', 'Madrid', 'Avda. Camino de la Industria', 'Spain', 47000, 100, 'Compañía de Phalsbourg / CBRE IM', 'Parque Comercial', 1997),
  ('Las Rozas Village', 'Las Rozas', 'Madrid', 'Avda. de Europa', 'Spain', 20000, 100, 'Value Retail', 'Outlet', 2004),
  ('Westfield Parquesur', 'Leganés', 'Madrid', 'Ctra. de Fuenlabrada', 'Spain', 159000, 280, 'Unibail-Rodamco-Westfield (URW)', 'Centro Comercial', 1994),
  ('Arroyosur', 'Leganés', 'Madrid', 'Avda. Arroyosur', 'Spain', 38000, 100, 'Carmila', 'Centro Comercial', 1992),
  ('La Vaguada', 'Madrid', 'Madrid', 'Avda. Monforte de Lemos', 'Spain', 88000, 350, 'URW / El Corte Inglés', 'Centro Comercial', 1983),
  ('La Gavia', 'Madrid', 'Madrid', 'Avda. La Gavia', 'Spain', 66000, 160, 'Klépierre', 'Centro Comercial', 2006),
  ('Plenilunio', 'Madrid', 'Madrid', 'Calle de la Carretera de Barcelona', 'Spain', 56000, 180, 'Klépierre', 'Centro Comercial', 2007),
  ('Islazul', 'Madrid', 'Madrid', 'Calle Rivas', 'Spain', 55000, 175, 'MERLIN Properties / AXA', 'Centro Comercial', 1994),
  ('Príncipe Pío', 'Madrid', 'Madrid', 'Paseo de la Florida', 'Spain', 25000, 80, 'IBA Capital / Realia', 'Centro Comercial', 2000),
  ('MegaPark Barajas', 'Madrid', 'Madrid', 'Avda. de Aragón', 'Spain', 50000, 80, 'Inveravante', 'Parque Comercial', 2010),
  ('El Corte Inglés Castellana', 'Madrid', 'Madrid', 'Paseo de la Castellana', 'Spain', 50000, 30, 'El Corte Inglés', 'Gran Almacén', 1970),
  ('Arkadia', 'Madrid', 'Madrid', 'Paseo de la Dirección', 'Spain', 43000, 110, 'Klépierre', 'Centro Comercial', 2005),
  ('H2O', 'Rivas-Vaciamadrid', 'Madrid', 'Paseo de la Industria', 'Spain', 47000, 160, 'Klépierre', 'Centro Comercial', 2007),
  ('Parque Corredor', 'Torrejón de Ardoz', 'Madrid', 'Ctra. M-204', 'Spain', 123000, 200, 'General de Galerías Comerciales (GCC)', 'Parque Comercial', 1993),
  ('Mediasur', 'Cartagena', 'Murcia', 'Ctra. de Madrid', 'Spain', 40000, 100, 'Carmila', 'Centro Comercial', 2005),
  ('Nueva Condomina', 'Murcia', 'Murcia', 'Ctra. de Madrid', 'Spain', 100000, 200, 'Castellana Properties', 'Centro Comercial', 2006),
  ('Thader', 'Murcia', 'Murcia', 'Ctra. de Cartagena', 'Spain', 85000, 170, 'General de Galerías Comerciales (GCC)', 'Centro Comercial', 2004),
  ('El Valle', 'Murcia', 'Murcia', 'Avda. del Valle', 'Spain', 35000, 90, 'GCC', 'Parque Comercial', 2018),
  ('Itaroa', 'Huarte', 'Navarra', 'Avda. de Itaroa', 'Spain', 53000, 130, 'MERLIN Properties', 'Centro Comercial', 2001),
  ('MaxCenter', 'Barakaldo', 'País Vasco', 'Avda. Altos Hornos', 'Spain', 88000, 200, 'MERLIN Properties', 'Centro Comercial', 2001),
  ('Bilbondo', 'Basauri', 'País Vasco', 'Barrio Arizgoiti', 'Spain', 47000, 130, 'Carmila', 'Centro Comercial', 1996),
  ('Zubiarte', 'Bilbao', 'País Vasco', 'Lehendakari Leizaola', 'Spain', 40000, 100, 'Sonae Sierra / CBRE IM', 'Centro Comercial', 2004),
  ('Garbera', 'San Sebastián', 'País Vasco', 'Avda. de Tolosa', 'Spain', 31000, 100, 'Unibail-Rodamco-Westfield (URW)', 'Centro Comercial', 2001),
  ('Salburua', 'Vitoria-Gasteiz', 'País Vasco', 'Avda. Salburua', 'Spain', 42000, 110, 'Carmila', 'Centro Comercial', 2005)
ON CONFLICT (name, city) DO UPDATE SET
  province     = EXCLUDED.province,
  address      = EXCLUDED.address,
  gla_sqm      = EXCLUDED.gla_sqm,
  shops_count  = EXCLUDED.shops_count,
  owner        = EXCLUDED.owner,
  center_type  = EXCLUDED.center_type,
  year_opened  = EXCLUDED.year_opened;

-- 6. Seed province stats
INSERT INTO public.province_stats
  (autonomous_community, centers_count, total_sba_sqm, total_shops_count)
VALUES
  ('Andalucía', 18, 985500, 2180),
  ('Aragón', 3, 294890, 510),
  ('Asturias', 2, 160000, 315),
  ('Baleares', 3, 95000, 270),
  ('C. Valenciana', 11, 433000, 1175),
  ('Canarias', 6, 223000, 590),
  ('Cantabria', 2, 70000, 190),
  ('Castilla y León', 4, 174000, 460),
  ('Castilla-La Mancha', 3, 119000, 330),
  ('Cataluña', 16, 919000, 2275),
  ('Extremadura', 2, 79000, 200),
  ('Galicia', 4, 374000, 650),
  ('La Rioja', 1, 52000, 130),
  ('Madrid', 22, 1330000, 3055),
  ('Murcia', 4, 260000, 560),
  ('Navarra', 1, 53000, 130),
  ('País Vasco', 5, 248000, 640)
ON CONFLICT (autonomous_community) DO UPDATE SET
  centers_count     = EXCLUDED.centers_count,
  total_sba_sqm     = EXCLUDED.total_sba_sqm,
  total_shops_count = EXCLUDED.total_shops_count;

SELECT 'Done! ' || COUNT(*) || ' shopping centers seeded.' FROM public.shopping_centers;
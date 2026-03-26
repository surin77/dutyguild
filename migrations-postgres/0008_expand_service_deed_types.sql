ALTER TABLE service_deeds
DROP CONSTRAINT IF EXISTS service_deeds_deed_type_check;

ALTER TABLE service_deeds
ADD CONSTRAINT service_deeds_deed_type_check
CHECK (deed_type IN ('trash', 'dust', 'order', 'altars', 'vessels', 'water', 'coffee', 'stores'));

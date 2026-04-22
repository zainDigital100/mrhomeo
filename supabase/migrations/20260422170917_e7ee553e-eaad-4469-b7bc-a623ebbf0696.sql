CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (new.id, 40);
  RETURN new;
END;
$function$;

ALTER TABLE public.user_credits ALTER COLUMN credits SET DEFAULT 40;
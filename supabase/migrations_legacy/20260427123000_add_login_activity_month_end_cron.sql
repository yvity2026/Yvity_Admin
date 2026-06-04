do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then

    perform cron.unschedule(jobid)
    from cron.job
    where jobname = 'last-day-530pm-ist-login-score';

    perform cron.schedule(
      'last-day-530pm-ist-login-score',
      '0 12 * * *',
      $cron$
      select case
        when current_date = (
          date_trunc('month', current_date) + interval '1 month - 1 day'
        )::date
        then public.process_month_end_advisor_login_scores(current_date)
      end;
      $cron$
    );

  end if;
end;
$$;
